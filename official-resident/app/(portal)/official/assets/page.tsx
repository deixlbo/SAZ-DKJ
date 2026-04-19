"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";

export default function OfficialAssetsPage() {
  const { user } = useAuth();

  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => api.assets.list(),
    enabled: !!user,
  });

  const assetsList = assets?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Assets</h1>
        <p className="text-slate-600 mt-2">Manage barangay assets and properties</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading...</div>
      ) : assetsList.length === 0 ? (
        <div className="text-center py-8 text-slate-600">No assets found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assetsList.map((asset: any) => (
            <Card key={asset.id} className="p-6">
              <h3 className="font-semibold text-lg text-slate-900">
                {asset.name}
              </h3>
              <p className="text-sm text-slate-600 mt-2">{asset.description}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div>
                  <span className="font-medium text-slate-900">Type:</span>
                  <p className="text-slate-600">{asset.type}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-900">Location:</span>
                  <p className="text-slate-600">{asset.location}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-900">Value:</span>
                  <p className="text-slate-600">₱{asset.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
