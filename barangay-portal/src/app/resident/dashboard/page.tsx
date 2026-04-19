'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Megaphone, AlertCircle, User, Menu, Home } from 'lucide-react';

export default function ResidentDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-primary text-white border-r border-primary/20 p-6 overflow-y-auto hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold">My Dashboard</h2>
          <p className="text-sm text-primary-foreground/70">Welcome, Juan</p>
        </div>

        <nav className="space-y-2">
          <Link href="/resident/dashboard" className="block px-4 py-2 rounded-lg bg-white/20 text-white font-medium">
            Home
          </Link>
          <Link href="/resident/documents" className="block px-4 py-2 rounded-lg hover:bg-white/10 text-white transition">
            My Documents
          </Link>
          <Link href="/resident/announcements" className="block px-4 py-2 rounded-lg hover:bg-white/10 text-white transition">
            Announcements
          </Link>
          <Link href="/resident/profile" className="block px-4 py-2 rounded-lg hover:bg-white/10 text-white transition">
            My Profile
          </Link>
          <Link href="/" className="block px-4 py-2 rounded-lg hover:bg-white/10 text-white transition mt-8">
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome, Juan Dela Cruz</h1>
            <p className="text-muted-foreground">Here&apos;s what&apos;s happening in your barangay</p>
          </div>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm font-medium">My Requests</p>
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground mt-2">2 approved, 1 pending</p>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm font-medium">New Announcements</p>
              <Megaphone className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">2</p>
            <p className="text-xs text-muted-foreground mt-2">Unread messages</p>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm font-medium">Profile Status</p>
              <User className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">100%</p>
            <p className="text-xs text-muted-foreground mt-2">Complete</p>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Document Requests */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">My Document Requests</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Barangay Clearance</p>
                  <p className="text-xs text-muted-foreground">Requested on Mar 10, 2026</p>
                </div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">Approved</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Residency Certificate</p>
                  <p className="text-xs text-muted-foreground">Requested on Mar 15, 2026</p>
                </div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">Pending</span>
              </div>
            </div>
            <Link href="/resident/documents">
              <Button variant="outline" className="w-full mt-4">View All Requests</Button>
            </Link>
          </div>

          {/* Latest Announcements */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Latest Announcements</h2>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                <p className="font-medium text-foreground">Community Clean-Up Drive</p>
                <p className="text-xs text-muted-foreground mt-1">Join us on March 25 at 7:00 AM</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-accent">
                <p className="font-medium text-foreground">Certificate Available for Pickup</p>
                <p className="text-xs text-muted-foreground mt-1">Visit barangay office during office hours</p>
              </div>
            </div>
            <Link href="/resident/announcements">
              <Button variant="outline" className="w-full mt-4">View All Announcements</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
