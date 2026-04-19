'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Users, Megaphone, Briefcase, AlertCircle, BarChart3, Menu, Zap, Brain, MessageSquare, Download } from 'lucide-react';

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

        {/* AI Features Overview */}
        <div className="mb-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">AI Assistant Ready - 12 Official Features</h3>
              <p className="text-sm text-foreground/80 mb-3">Smart daily tasks, real-time insights, auto reports, document assistance, blotter support, notifications, resident search, announcements, validation, email automation, predictive insights, and voice commands.</p>
              <p className="text-xs text-foreground/70">💡 Tip: Ask the chatbot (bottom-right) for document summaries, resident insights, or to generate reports</p>
            </div>
          </div>
        </div>
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

        {/* AI Helper Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Auto Report Generator</h3>
            </div>
            <p className="text-sm text-blue-800">Generate weekly/monthly reports instantly</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Real-time Data Insights</h3>
            </div>
            <p className="text-sm text-green-800">View trends and patterns in resident data</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Smart Validation</h3>
            </div>
            <p className="text-sm text-purple-800">Get AI-powered suggestions and validations</p>
          </div>
        </div>
      </main>
    </div>
  );
}
