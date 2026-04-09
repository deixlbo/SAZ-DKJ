import { useState } from "react";
import { Sidebar } from "./sidebar";

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Pass toggleSidebar to children via context or clone */}
        <SidebarToggleContext.Provider value={{ toggle: () => setSidebarOpen(true) }}>
          {children}
        </SidebarToggleContext.Provider>
      </main>
    </div>
  );
}

import { createContext, useContext } from "react";

export const SidebarToggleContext = createContext({ toggle: () => {} });
export const useSidebarToggle = () => useContext(SidebarToggleContext);
