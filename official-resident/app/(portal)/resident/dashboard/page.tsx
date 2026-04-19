"use client";

import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResidentDashboard() {
  const { user } = useAuth();

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => api.documents.list(),
    enabled: !!user,
  });

  const { data: announcements, isLoading: annoLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => api.announcements.list(),
    enabled: !!user,
  });

  const isLoading = docsLoading || annoLoading;
  const documentsList = documents?.data || [];
  const announcementList = announcements?.data || [];

  const pendingDocuments = documentsList.filter(
    (d: any) => d.status === "pending"
  );
  const approvedDocuments = documentsList.filter(
    (d: any) => d.status === "approved"
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Welcome, {user?.name}</h1>
        <p className="text-slate-600 mt-2">Resident Portal Dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">
            Document Requests
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {documentsList.length}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {pendingDocuments.length}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Ready for Pickup</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {approvedDocuments.length}
          </p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/resident/documents">
            <Button>Request Document</Button>
          </Link>
          <Link href="/resident/announcements">
            <Button variant="outline">View Announcements</Button>
          </Link>
          <Link href="/resident/blotter">
            <Button variant="outline">File Complaint</Button>
          </Link>
        </div>
      </div>

      {/* Recent Announcements */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Recent Announcements
        </h2>
        {isLoading ? (
          <p className="text-slate-600">Loading...</p>
        ) : announcementList.length === 0 ? (
          <p className="text-slate-600">No announcements yet.</p>
        ) : (
          <div className="space-y-4">
            {announcementList.slice(0, 3).map((announcement: any) => (
              <div
                key={announcement.id}
                className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500"
              >
                <h3 className="font-medium text-slate-900">
                  {announcement.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {announcement.content}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {new Date(announcement.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
