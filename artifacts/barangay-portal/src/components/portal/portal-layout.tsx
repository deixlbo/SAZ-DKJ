import { useState } from "react";
import { createContext, useContext } from "react";
import { Sidebar } from "./sidebar";
import { NotificationsProvider } from "@/lib/notifications-context";
import { useAuth } from "@/lib/auth-context";

export const SidebarToggleContext = createContext({ toggle: () => {} });
export const useSidebarToggle = () => useContext(SidebarToggleContext);

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userData } = useAuth();

  return (
    <NotificationsProvider role={userData?.role ?? null}>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <SidebarToggleContext.Provider value={{ toggle: () => setSidebarOpen(true) }}>
            {children}
          </SidebarToggleContext.Provider>
        </main>
      </div>
    </NotificationsProvider>
  );
}
