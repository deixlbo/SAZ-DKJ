"use client";

import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";

export default function ResidentProfilePage() {
  const { user } = useAuth();

  const { data: residentsResponse, isLoading } = useQuery({
    queryKey: ["residents"],
    queryFn: () => api.residents.list({ role: "resident" }),
    enabled: !!user,
  });

  const residents = residentsResponse?.data || [];
  const currentResident = residents.find((r: any) => r.email === user?.email);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-600 mt-2">Your resident profile information</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading profile...</div>
      ) : (
        <Card className="p-8 max-w-2xl">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <p className="text-lg text-slate-900 mt-1">
                  {currentResident?.name || user?.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <p className="text-lg text-slate-900 mt-1">
                  {currentResident?.email || user?.email}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Contact Number
                </label>
                <p className="text-lg text-slate-900 mt-1">
                  {currentResident?.contact_number || "N/A"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Birthdate
                </label>
                <p className="text-lg text-slate-900 mt-1">
                  {currentResident?.birthdate
                    ? new Date(currentResident.birthdate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              {currentResident?.address && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <p className="text-lg text-slate-900 mt-1">
                    {currentResident.address}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Role
                </label>
                <p className="text-lg text-slate-900 mt-1 capitalize">
                  {currentResident?.role || user?.role || "Resident"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
