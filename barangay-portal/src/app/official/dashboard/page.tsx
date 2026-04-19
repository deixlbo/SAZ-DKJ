'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Users, Megaphone, Briefcase, AlertCircle, BarChart3, Menu } from 'lucide-react';

export default function OfficialDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-6 overflow-y-auto hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Barangay Santiago</h2>
          <p className="text-sm text-sidebar-foreground/70">Official Portal</p>
        </div>

        <nav className="space-y-2">
          <Link href="/official/dashboard" className="block px-4 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-medium">
            Dashboard
          </Link>
          <Link href="/official/documents" className="block px-4 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition">
            Documents
          </Link>
          <Link href="/official/residents" className="block px-4 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition">
            Residents
          </Link>
          <Link href="/official/announcements" className="block px-4 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition">
            Announcements
          </Link>
          <Link href="/official/blotter" className="block px-4 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition">
            Blotter
          </Link>
          <Link href="/official/projects" className="block px-4 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition">
            Projects
          </Link>
          <Link href="/" className="block px-4 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition mt-8">
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome, Barangay Captain</p>
          </div>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm font-medium">Pending Documents</p>
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">12</p>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm font-medium">Total Residents</p>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">1,245</p>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm font-medium">Announcements</p>
              <Megaphone className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">8</p>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm font-medium">Active Projects</p>
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">5</p>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pending Requests */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Document Requests</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Juan Dela Cruz - Barangay Clearance</p>
                  <p className="text-xs text-muted-foreground">Submitted 2 hours ago</p>
                </div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">Pending</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Maria Santos - Residency Certificate</p>
                  <p className="text-xs text-muted-foreground">Submitted 5 hours ago</p>
                </div>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">Processing</span>
              </div>
            </div>
            <Link href="/official/documents">
              <Button variant="outline" className="w-full mt-4">View All Requests</Button>
            </Link>
          </div>

          {/* Recent Announcements */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Announcements</h2>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                <p className="font-medium text-foreground">Community Clean-Up Drive</p>
                <p className="text-xs text-muted-foreground mt-1">Published today</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-accent">
                <p className="font-medium text-foreground">Certificate of Good Moral Character Available</p>
                <p className="text-xs text-muted-foreground mt-1">Published yesterday</p>
              </div>
            </div>
            <Link href="/official/announcements">
              <Button variant="outline" className="w-full mt-4">View All Announcements</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
