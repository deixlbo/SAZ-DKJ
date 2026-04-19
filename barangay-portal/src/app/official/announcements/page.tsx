'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Plus } from 'lucide-react';

export default function OfficialAnnouncements() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-6 overflow-y-auto hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Barangay Santiago</h2>
          <p className="text-sm text-sidebar-foreground/70">Official Portal</p>
        </div>

        <nav className="space-y-2">
          <Link href="/official/dashboard" className="block px-4 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition">
            Dashboard
          </Link>
          <Link href="/official/documents" className="block px-4 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition">
            Documents
          </Link>
          <Link href="/official/residents" className="block px-4 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition">
            Residents
          </Link>
          <Link href="/official/announcements" className="block px-4 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-medium">
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
            <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground">Manage community announcements</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary/90 gap-2 hidden sm:flex">
              <Plus className="h-4 w-4" />
              New Announcement
            </Button>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input placeholder="Search announcements..." className="w-full" />
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Community Clean-Up Drive 2026</h3>
                <p className="text-sm text-muted-foreground mt-1">Published March 15, 2026</p>
              </div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">Published</span>
            </div>
            <p className="text-foreground mb-4">
              Join us for our quarterly community clean-up drive. Let&apos;s work together to make our barangay cleaner and greener!
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm" className="text-red-600">Delete</Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Certificate of Good Moral Character Available</h3>
                <p className="text-sm text-muted-foreground mt-1">Published March 10, 2026</p>
              </div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">Published</span>
            </div>
            <p className="text-foreground mb-4">
              Approved certificates are now ready for pickup at the barangay office. Visit us during office hours.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm" className="text-red-600">Delete</Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Barangay Health Center Extended Hours</h3>
                <p className="text-sm text-muted-foreground mt-1">Published March 5, 2026</p>
              </div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">Draft</span>
            </div>
            <p className="text-foreground mb-4">
              The barangay health center will now be open until 7:00 PM on Mondays and Fridays.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm" className="text-red-600">Delete</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
