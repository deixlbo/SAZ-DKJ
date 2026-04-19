"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Purok = "all" | "1" | "2" | "3" | "4" | "5";

export default function OfficialResidentsPage() {
  const { user } = useAuth();
  const [purok, setPurok] = useState<Purok>("all");

  const { data: residents, isLoading } = useQuery({
    queryKey: ["residents", purok],
    queryFn: () =>
      api.residents.list({
        purok: purok !== "all" ? purok : undefined,
      }),
    enabled: !!user,
  });

  const residentsList = residents?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Residents</h1>
        <p className="text-slate-600 mt-2">Manage barangay residents</p>
      </div>

      {/* Filter */}
      <div className="flex gap-3 items-center bg-white p-4 rounded-lg border border-slate-200">
        <label className="text-sm font-medium text-slate-700">
          Filter by Purok:
        </label>
        <Select value={purok} onValueChange={(value: any) => setPurok(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Purok</SelectItem>
            <SelectItem value="1">Purok 1</SelectItem>
            <SelectItem value="2">Purok 2</SelectItem>
            <SelectItem value="3">Purok 3</SelectItem>
            <SelectItem value="4">Purok 4</SelectItem>
            <SelectItem value="5">Purok 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Residents Grid */}
      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading...</div>
      ) : residentsList.length === 0 ? (
        <div className="text-center py-8 text-slate-600">No residents found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {residentsList.map((resident: any) => (
            <Card key={resident.id} className="p-6 hover:shadow-lg transition">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">
                    {resident.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {resident.email}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-slate-900">Address:</span>
                    <p className="text-slate-600">{resident.address}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">
                      Purok:
                    </span>
                    <p className="text-slate-600">
                      Purok {resident.purok || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">
                      Contact:
                    </span>
                    <p className="text-slate-600">
                      {resident.contact_number || "N/A"}
                    </p>
                  </div>
                </div>

                {resident.is_senior_citizen && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <span className="text-sm text-yellow-700">
                      👴 Senior Citizen
                    </span>
                  </div>
                )}

                {resident.is_pwd && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <span className="text-sm text-blue-700">
                      ♿ PWD
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
