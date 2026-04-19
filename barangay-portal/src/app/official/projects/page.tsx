'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Plus, Eye, BarChart3 } from 'lucide-react';

export default function OfficialProjects() {
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
          <Link href="/official/announcements" className="block px-4 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition">
            Announcements
          </Link>
          <Link href="/official/blotter" className="block px-4 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition">
            Blotter
          </Link>
          <Link href="/official/projects" className="block px-4 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-medium">
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
            <h1 className="text-3xl font-bold text-foreground">Community Projects</h1>
            <p className="text-muted-foreground">Track ongoing barangay development initiatives</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary/90 gap-2 hidden sm:flex">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-border p-4">
            <p className="text-muted-foreground text-sm">Total Projects</p>
            <p className="text-2xl font-bold text-foreground mt-2">8</p>
          </div>
          <div className="bg-white rounded-lg border border-border p-4">
            <p className="text-muted-foreground text-sm">Ongoing</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">3</p>
          </div>
          <div className="bg-white rounded-lg border border-border p-4">
            <p className="text-muted-foreground text-sm">Completed</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">4</p>
          </div>
          <div className="bg-white rounded-lg border border-border p-4">
            <p className="text-muted-foreground text-sm">Planned</p>
            <p className="text-2xl font-bold text-amber-600 mt-2">1</p>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {/* Ongoing Project */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Road Rehabilitation Project</h3>
                <p className="text-sm text-muted-foreground mt-1">Phase 2 - Main Street Improvement</p>
              </div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">Ongoing</span>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Progress</span>
                <span className="text-sm text-muted-foreground">65%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Estimated completion: April 30, 2026
            </p>
            <Button variant="outline" size="sm" className="gap-1">
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>

          {/* Ongoing Project */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Water System Upgrade</h3>
                <p className="text-sm text-muted-foreground mt-1">Infrastructure Improvement</p>
              </div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">Ongoing</span>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Progress</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Estimated completion: May 15, 2026
            </p>
            <Button variant="outline" size="sm" className="gap-1">
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>

          {/* Completed Project */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Public Park Beautification</h3>
                <p className="text-sm text-muted-foreground mt-1">Community Green Space</p>
              </div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">Completed</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Completed: February 28, 2026
            </p>
            <Button variant="outline" size="sm" className="gap-1">
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>

          {/* Planned Project */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Community Center Renovation</h3>
                <p className="text-sm text-muted-foreground mt-1">Facility Upgrade</p>
              </div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">Planned</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Scheduled: June 2026
            </p>
            <Button variant="outline" size="sm" className="gap-1">
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
