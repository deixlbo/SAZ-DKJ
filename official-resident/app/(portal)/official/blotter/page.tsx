"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

export default function OfficialBlotterPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const { data: blotter, isLoading, refetch } = useQuery({
    queryKey: ["blotter", search],
    queryFn: () => api.blotter.list({ search }),
    enabled: !!user,
  });

  const filteredBlotter = blotter?.data || [];

  const handleSetMediationOrHearing = async (
    caseId: string,
    type: "mediation" | "hearing"
  ) => {
    try {
      await api.blotter.update(caseId, {
        status: type === "mediation" ? "mediation_scheduled" : "hearing_scheduled",
        notified_respondent: true,
      });
      toast.success(`${type} scheduled and respondent notified`);
      refetch();
    } catch (error) {
      toast.error("Failed to update case");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Blotter</h1>
        <p className="text-slate-600 mt-2">Manage blotter cases and complaints</p>
      </div>

      {/* Search */}
      <div className="flex gap-2 bg-white p-4 rounded-lg border border-slate-200">
        <Search size={20} className="text-slate-400 flex-shrink-0" />
        <Input
          placeholder="Search by person name or reported area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-0 flex-1"
        />
      </div>

      {/* Cases List */}
      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading...</div>
      ) : filteredBlotter.length === 0 ? (
        <div className="text-center py-8 text-slate-600">No cases found</div>
      ) : (
        <div className="grid gap-4">
          {filteredBlotter.map((case_: any) => (
            <Card key={case_.id} className="p-6 hover:shadow-lg transition">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">
                      {case_.complainant} vs {case_.respondent}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Nature: {case_.nature}
                    </p>
                    <p className="text-sm text-slate-600">
                      Reported Area: {case_.reported_area}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      case_.status === "ongoing"
                        ? "bg-blue-100 text-blue-800"
                        : case_.status === "mediation_scheduled"
                        ? "bg-purple-100 text-purple-800"
                        : case_.status === "hearing_scheduled"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {case_.status.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-slate-700">
                  {case_.description}
                </p>

                {case_.notified_respondent && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded">
                    <span className="text-sm text-green-700">
                      ✓ Respondent has been notified
                    </span>
                  </div>
                )}

                {case_.scheduled_date && (
                  <div className="text-sm text-slate-600">
                    <strong>Scheduled Date:</strong>{" "}
                    {new Date(case_.scheduled_date).toLocaleDateString()}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {case_.status === "ongoing" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleSetMediationOrHearing(case_.id, "mediation")
                        }
                      >
                        Set Mediation
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleSetMediationOrHearing(case_.id, "hearing")
                        }
                      >
                        Set Hearing
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
