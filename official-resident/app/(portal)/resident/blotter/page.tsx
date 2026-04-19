"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ResidentBlotterPage() {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    nature: "",
    description: "",
    reported_area: "",
  });

  const { data: myBlotterCases, isLoading, refetch } = useQuery({
    queryKey: ["my-blotter"],
    queryFn: () => api.blotter.list({ user_id: user?.id }),
    enabled: !!user,
  });

  const casesList = myBlotterCases?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.blotter.create({
        ...formData,
        complainant: user?.name,
      });

      toast.success("Complaint filed successfully!");
      setFormData({ nature: "", description: "", reported_area: "" });
      setIsCreating(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to file complaint");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Blotter</h1>
        <p className="text-slate-600 mt-2">File complaints and view case status</p>
      </div>

      {/* File Complaint Form */}
      {!isCreating ? (
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          File a Complaint
        </Button>
      ) : (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            File a New Complaint
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nature">Nature of Complaint</Label>
              <Input
                id="nature"
                placeholder="e.g., Noise Dispute, Trespassing, etc."
                value={formData.nature}
                onChange={(e) =>
                  setFormData({ ...formData, nature: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Reported Area</Label>
              <Input
                id="area"
                placeholder="Where did this incident occur?"
                value={formData.reported_area}
                onChange={(e) =>
                  setFormData({ ...formData, reported_area: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the incident in detail..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={5}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                Submit Complaint
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* My Cases */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">My Cases</h2>

        {isLoading ? (
          <p className="text-slate-600">Loading...</p>
        ) : casesList.length === 0 ? (
          <p className="text-slate-600">You haven't filed any complaints yet.</p>
        ) : (
          <div className="space-y-4">
            {casesList.map((case_: any) => (
              <div
                key={case_.id}
                className="p-4 border border-slate-200 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-slate-900">
                    {case_.nature}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
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
                <p className="text-sm text-slate-600">
                  Area: {case_.reported_area}
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  {case_.description}
                </p>
                {case_.scheduled_date && (
                  <p className="text-sm text-slate-900 font-medium mt-2">
                    Scheduled: {new Date(case_.scheduled_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
