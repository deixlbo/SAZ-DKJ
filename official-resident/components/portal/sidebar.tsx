"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isOfficial = user?.role === "official";

  const links = isOfficial
    ? [
        { href: "/official/dashboard", label: "Dashboard", icon: "📊" },
        { href: "/official/documents", label: "Document Requests", icon: "📄" },
        { href: "/official/blotter", label: "Blotter", icon: "⚖️" },
        { href: "/official/residents", label: "Residents", icon: "👥" },
        { href: "/official/announcements", label: "Announcements", icon: "📢" },
        { href: "/official/projects", label: "Projects", icon: "🏗️" },
        { href: "/official/assets", label: "Assets", icon: "🏢" },
        { href: "/official/ordinances", label: "Ordinances", icon: "📋" },
        { href: "/official/businesses", label: "Businesses", icon: "🏪" },
        { href: "/official/profile", label: "Profile", icon: "👤" },
      ]
    : [
        { href: "/resident/dashboard", label: "Dashboard", icon: "📊" },
        { href: "/resident/documents", label: "Document Requests", icon: "📄" },
        { href: "/resident/announcements", label: "Announcements", icon: "📢" },
        { href: "/resident/blotter", label: "Blotter", icon: "⚖️" },
        { href: "/resident/assets", label: "Assets", icon: "📦" },
        { href: "/resident/ordinances", label: "Ordinances", icon: "📋" },
        { href: "/resident/profile", label: "Profile", icon: "👤" },
      ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 hover:bg-slate-100 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-6 overflow-y-auto transition-transform md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-40 md:z-0`}
      >
        <div className="space-y-8">
          {/* Logo/Title */}
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Santiago Portal</h1>
            <p className="text-sm text-slate-400">
              {isOfficial ? "Official" : "Resident"} Portal
            </p>
          </div>

          {/* User Info */}
          {user && (
            <div className="pb-4 border-b border-slate-700">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-slate-700 font-medium"
                      : "hover:bg-slate-800"
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="pt-4 border-t border-slate-700">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-white border-slate-600 hover:bg-slate-800"
              size="sm"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
