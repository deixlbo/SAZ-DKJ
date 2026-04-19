"use client";

import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";

export default function ResidentProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-600 mt-2">Your resident profile information</p>
      </div>

      <Card className="p-8 max-w-2xl">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <p className="text-lg text-slate-900 mt-1">{user?.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <p className="text-lg text-slate-900 mt-1">{user?.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Role</label>
              <p className="text-lg text-slate-900 mt-1 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
