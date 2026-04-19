"use client";

import { useAuth } from "@/lib/auth-context";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PortalHeader() {
  const { user } = useAuth();
  const isOfficial = user?.role === "official";

  return (
    <header className="hidden md:block bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          {isOfficial && user?.image && (
            <div className="flex items-center gap-4">
              <img
                src={user.image}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-slate-900">{user.name}</h2>
                {user.position && (
                  <p className="text-sm text-slate-600">{user.position}</p>
                )}
              </div>
            </div>
          )}
          {!isOfficial && (
            <div>
              <h2 className="font-semibold text-slate-900">{user?.name}</h2>
              <p className="text-sm text-slate-600">Resident</p>
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
        </Button>
      </div>
    </header>
  );
}
