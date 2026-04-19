"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";

export default function OfficialProfilePage() {
  const { user } = useAuth();

  const { data: officialsResponse, isLoading } = useQuery({
    queryKey: ["officials"],
    queryFn: () => api.residents.list({ role: "official" }),
    enabled: !!user,
  });

  const officials = officialsResponse?.data || [];
  const currentOfficial = officials.find((o: any) => o.email === user?.email);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-600 mt-2">Your official profile information</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading profile...</div>
      ) : (
        <Card className="p-8 max-w-2xl">
          <div className="space-y-6">
            {(currentOfficial?.image || user?.image) && (
              <div className="flex justify-center">
                <img
                  src={currentOfficial?.image || user?.image}
                  alt={currentOfficial?.name || user?.name}
                  className="w-32 h-32 rounded-full border-4 border-slate-200 object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <p className="text-lg text-slate-900 mt-1">
                  {currentOfficial?.name || user?.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <p className="text-lg text-slate-900 mt-1">
                  {currentOfficial?.email || user?.email}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Position
                </label>
                <p className="text-lg text-slate-900 mt-1">
                  {currentOfficial?.position || user?.position || "N/A"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Contact Number
                </label>
                <p className="text-lg text-slate-900 mt-1">
                  {currentOfficial?.contact_number || "N/A"}
                </p>
              </div>

              {currentOfficial?.address && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <p className="text-lg text-slate-900 mt-1">
                    {currentOfficial.address}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Role
                </label>
                <p className="text-lg text-slate-900 mt-1 capitalize">
                  {currentOfficial?.role || user?.role || "Official"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
