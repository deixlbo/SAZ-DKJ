"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function OfficialAnnouncementsPage() {
  const { user } = useAuth();

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => api.announcements.list(),
    enabled: !!user,
  });

  const announcementList = announcements?.data || [];

  return (
    <div className="space-y-6 print-full-page">
      {/* Header */}
      <div className="no-print">
        <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
        <p className="text-slate-600 mt-2">Manage barangay announcements</p>

        <div className="flex justify-end mt-4">
          <Button onClick={() => window.print()} className="gap-2">
            <Printer size={16} />
            Print
          </Button>
        </div>
      </div>

      {/* Announcements List */}
      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading...</div>
      ) : announcementList.length === 0 ? (
        <div className="text-center py-8 text-slate-600">
          No announcements yet
        </div>
      ) : (
        <div className="space-y-6 print:space-y-8">
          {announcementList.map((announcement: any) => (
            <div
              key={announcement.id}
              className="print:border print:border-slate-900 print:p-6 print:page-break-inside-avoid"
            >
              <Card className="p-6 print:border-0">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {announcement.title}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      {new Date(announcement.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                    {announcement.content}
                  </div>

                  {announcement.image_url && (
                    <img
                      src={announcement.image_url}
                      alt={announcement.title}
                      className="w-full max-h-96 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-600 print:hidden">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        announcement.is_published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {announcement.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
