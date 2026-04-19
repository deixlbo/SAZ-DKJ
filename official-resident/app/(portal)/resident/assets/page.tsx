"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function ResidentAssetsPage() {
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
        <h1 className="text-3xl font-bold text-slate-900">Barangay Assets</h1>
        <p className="text-slate-600 mt-2">
          View barangay properties and assets
        </p>
      </div>

      {/* Info Box */}
      <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium">Information Only</p>
          <p className="mt-1">
            This is a read-only view of barangay assets managed by officials.
          </p>
        </div>
      </div>

      {/* Assets Grid */}
      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading...</div>
      ) : assetsList.length === 0 ? (
        <div className="text-center py-8 text-slate-600">No assets available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assetsList.map((asset: any) => (
            <Card key={asset.id} className="p-6 hover:shadow-lg transition">
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
                  <span className="font-medium text-slate-900">
                    Estimated Value:
                  </span>
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
