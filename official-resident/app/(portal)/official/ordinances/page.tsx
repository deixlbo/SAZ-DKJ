"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";

export default function OfficialOrdinancesPage() {
  const { user } = useAuth();

  const { data: ordinances, isLoading } = useQuery({
    queryKey: ["ordinances"],
    queryFn: () => api.ordinances.list(),
    enabled: !!user,
  });

  const ordinanceList = ordinances?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Ordinances</h1>
        <p className="text-slate-600 mt-2">Barangay ordinances and regulations</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading...</div>
      ) : ordinanceList.length === 0 ? (
        <div className="text-center py-8 text-slate-600">No ordinances found</div>
      ) : (
        <div className="grid gap-4">
          {ordinanceList.map((ordinance: any) => (
            <Card key={ordinance.id} className="p-6">
              <h3 className="font-semibold text-lg text-slate-900">
                {ordinance.title}
              </h3>
              <p className="text-sm text-slate-600 mt-2">{ordinance.description}</p>
              <div className="mt-4 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-900">Effective Date:</span>{" "}
                  {new Date(ordinance.effective_date).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
