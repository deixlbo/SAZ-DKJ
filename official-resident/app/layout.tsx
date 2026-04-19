import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barangay Santiago Portal",
  description: "Official and Resident Portal for Barangay Santiago",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
