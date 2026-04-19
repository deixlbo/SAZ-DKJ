"use client";

import { AuthProvider } from "@/lib/auth-context";
import { Sidebar } from "@/components/portal/sidebar";
import { PortalHeader } from "@/components/portal/header";
import { Chatbot } from "@/components/chatbot/chatbot";
import { QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@/lib/queryClient";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = createClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <main className="flex-1 md:ml-64">
            <PortalHeader />
            <div className="p-4 md:p-8">{children}</div>
          </main>
        </div>
        <Chatbot />
      </QueryClientProvider>
    </AuthProvider>
  );
}
