"use client";

import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function OfficialDashboard() {
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => api.documents.list({ limit: 5 }),
    enabled: !!user,
  });

  const { data: residents, isLoading: residentsLoading } = useQuery({
    queryKey: ["residents"],
    queryFn: () => api.residents.list({ limit: 10 }),
    enabled: !!user,
  });

  const { data: blotter, isLoading: blotterLoading } = useQuery({
    queryKey: ["blotter"],
    queryFn: () => api.blotter.list({ limit: 5 }),
    enabled: !!user,
  });

  const isLoading = docsLoading || residentsLoading || blotterLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Total Residents</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {residents?.data?.length || 0}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">
            Document Requests
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {documents?.data?.length || 0}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Blotter Cases</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {blotter?.data?.length || 0}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">
            Pending Actions
          </p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {documents?.data?.filter((d: any) => d.status === "pending").length || 0}
          </p>
        </Card>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Document Requests */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Document Requests
          </h2>
          {isLoading ? (
            <p className="text-slate-600">Loading...</p>
          ) : documents?.data?.length === 0 ? (
            <p className="text-slate-600">No document requests yet.</p>
          ) : (
            <div className="space-y-3">
              {documents?.data?.slice(0, 5).map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">{doc.type}</p>
                    <p className="text-sm text-slate-600">{doc.user_name}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      doc.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : doc.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Blotter Cases */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Blotter Cases
          </h2>
          {isLoading ? (
            <p className="text-slate-600">Loading...</p>
          ) : blotter?.data?.length === 0 ? (
            <p className="text-slate-600">No blotter cases yet.</p>
          ) : (
            <div className="space-y-3">
              {blotter?.data?.slice(0, 5).map((case_: any) => (
                <div
                  key={case_.id}
                  className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {case_.complainant} vs {case_.respondent}
                    </p>
                    <p className="text-sm text-slate-600">{case_.nature}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      case_.status === "ongoing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {case_.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
