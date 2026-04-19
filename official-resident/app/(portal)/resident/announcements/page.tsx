"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";

export default function ResidentAnnouncementsPage() {
  const { user } = useAuth();

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => api.announcements.list(),
    enabled: !!user,
  });

  const announcementList = announcements?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
        <p className="text-slate-600 mt-2">
          Stay updated with barangay announcements
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading...</div>
      ) : announcementList.length === 0 ? (
        <div className="text-center py-8 text-slate-600">
          No announcements yet
        </div>
      ) : (
        <div className="space-y-4">
          {announcementList.map((announcement: any) => (
            <Card key={announcement.id} className="p-6 hover:shadow-lg transition">
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
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

                <p className="text-slate-700 whitespace-pre-wrap">
                  {announcement.content}
                </p>

                {announcement.image_url && (
                  <img
                    src={announcement.image_url}
                    alt={announcement.title}
                    className="w-full max-h-96 object-cover rounded-lg"
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
