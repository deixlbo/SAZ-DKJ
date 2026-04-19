"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";

export default function OfficialBusinessesPage() {
  const { user } = useAuth();

  const { data: businesses, isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => api.businesses.list(),
    enabled: !!user,
  });

  const businessesList = businesses?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Businesses</h1>
        <p className="text-slate-600 mt-2">Registered businesses in Barangay Santiago</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading...</div>
      ) : businessesList.length === 0 ? (
        <div className="text-center py-8 text-slate-600">No businesses found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessesList.map((business: any) => (
            <Card key={business.id} className="p-6">
              <h3 className="font-semibold text-lg text-slate-900">
                {business.name}
              </h3>
              <p className="text-sm text-slate-600 mt-2">{business.owner_name}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div>
                  <span className="font-medium text-slate-900">Type:</span>
                  <p className="text-slate-600">{business.type}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-900">Address:</span>
                  <p className="text-slate-600">{business.address}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-900">Contact:</span>
                  <p className="text-slate-600">{business.contact_number}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
