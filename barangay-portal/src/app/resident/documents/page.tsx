'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Plus, Eye, CheckCircle, Clock, AlertCircle, Lightbulb } from 'lucide-react';

export default function ResidentDocuments() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-primary text-white border-r border-primary/20 p-6 overflow-y-auto hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold">My Dashboard</h2>
          <p className="text-sm text-primary-foreground/70">Welcome, Juan</p>
        </div>

        <nav className="space-y-2">
          <Link href="/resident/dashboard" className="block px-4 py-2 rounded-lg hover:bg-white/10 text-white transition">
            Home
          </Link>
          <Link href="/resident/documents" className="block px-4 py-2 rounded-lg bg-white/20 text-white font-medium">
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
            <h1 className="text-3xl font-bold text-foreground">My Document Requests</h1>
            <p className="text-muted-foreground">Track and manage your document requests</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary/90 gap-2 hidden sm:flex">
              <Plus className="h-4 w-4" />
              Request Document
            </Button>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-green-900 mb-1">AI Document Assistant Tip</p>
            <p className="text-green-800">Ask the chatbot for step-by-step guidance on what documents you need, how to prepare them, and what to do next!</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'Approved', 'Pending', 'Processing'].map(status => (
            <button
              key={status}
              className="px-3 py-1.5 text-sm rounded-full border border-border hover:bg-muted transition"
            >
              {status}
            </button>
          ))}
        </div>

        {/* Requests Grid */}
        <div className="space-y-4">
          {/* Approved Request */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Barangay Clearance</h3>
                  <p className="text-muted-foreground text-sm">For travel and employment</p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><span className="font-medium">Requested:</span> March 10, 2026</p>
                    <p><span className="font-medium">Status:</span> <span className="text-emerald-600 font-medium">Ready for Pickup</span></p>
                    <p><span className="font-medium">Valid Until:</span> March 10, 2027</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                Details
              </Button>
            </div>
          </div>

          {/* Pending Request */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Residency Certificate</h3>
                  <p className="text-muted-foreground text-sm">Proof of residency</p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><span className="font-medium">Requested:</span> March 15, 2026</p>
                    <p><span className="font-medium">Status:</span> <span className="text-amber-600 font-medium">Processing</span></p>
                    <p><span className="font-medium">Required Documents:</span> Valid ID, Proof of Address</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                Details
              </Button>
            </div>
          </div>

          {/* Rejected Request */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Indigency Certificate</h3>
                  <p className="text-muted-foreground text-sm">Financial assistance document</p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><span className="font-medium">Requested:</span> March 5, 2026</p>
                    <p><span className="font-medium">Status:</span> <span className="text-red-600 font-medium">Needs Revision</span></p>
                    <p><span className="font-medium">Reason:</span> Missing supporting documents</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                Details
              </Button>
            </div>
          </div>
        </div>

        {/* Request New Document */}
        <div className="mt-8 bg-primary/5 rounded-lg border border-primary/20 p-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Need a new document?</h2>
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" />
            Request a New Document
          </Button>
        </div>
      </main>
    </div>
  );
}
