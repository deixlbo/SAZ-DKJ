'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Download, Plus, Eye } from 'lucide-react';

export default function OfficialDocuments() {
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
          <Link href="/official/documents" className="block px-4 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-medium">
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
            <h1 className="text-3xl font-bold text-foreground">Document Requests</h1>
            <p className="text-muted-foreground">Manage all document requests</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input placeholder="Search by name, ID, or type..." className="flex-1" />
          <select className="px-4 py-2 rounded-lg border border-input bg-background">
            <option>All Documents</option>
            <option>Barangay Clearance</option>
            <option>Residency Certificate</option>
            <option>Indigency</option>
          </select>
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'Pending', 'Processing', 'Approved', 'Rejected'].map(status => (
            <button
              key={status}
              className="px-3 py-1.5 text-sm rounded-full border border-border hover:bg-muted transition"
            >
              {status}
            </button>
          ))}
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Resident Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Document Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date Submitted</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-foreground">Juan Dela Cruz</td>
                  <td className="px-6 py-4 text-foreground">Barangay Clearance</td>
                  <td className="px-6 py-4 text-muted-foreground">Mar 15, 2026</td>
                  <td className="px-6 py-4"><span className="inline-block px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">Pending</span></td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-foreground">Maria Santos</td>
                  <td className="px-6 py-4 text-foreground">Residency Certificate</td>
                  <td className="px-6 py-4 text-muted-foreground">Mar 14, 2026</td>
                  <td className="px-6 py-4"><span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">Processing</span></td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-foreground">Pedro Reyes</td>
                  <td className="px-6 py-4 text-foreground">Indigency</td>
                  <td className="px-6 py-4 text-muted-foreground">Mar 13, 2026</td>
                  <td className="px-6 py-4"><span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">Approved</span></td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
