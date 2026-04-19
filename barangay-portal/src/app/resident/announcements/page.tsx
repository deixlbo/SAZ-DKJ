'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Bell } from 'lucide-react';

export default function ResidentAnnouncements() {
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
          <Link href="/resident/documents" className="block px-4 py-2 rounded-lg hover:bg-white/10 text-white transition">
            My Documents
          </Link>
          <Link href="/resident/announcements" className="block px-4 py-2 rounded-lg bg-white/20 text-white font-medium">
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
            <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground">Stay updated with latest news and events</p>
          </div>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {/* Featured Announcement */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">Community Clean-Up Drive 2026</h3>
                <p className="text-muted-foreground mt-2">
                  Join us for our quarterly community clean-up drive. Let&apos;s work together to make our barangay cleaner and greener!
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  <p><span className="font-medium text-foreground">Date:</span> <span className="text-muted-foreground">March 25, 2026</span></p>
                  <p><span className="font-medium text-foreground">Time:</span> <span className="text-muted-foreground">7:00 AM - 12:00 PM</span></p>
                  <p><span className="font-medium text-foreground">Location:</span> <span className="text-muted-foreground">Barangay Hall and Main Grounds</span></p>
                </div>
                <Button className="mt-4 bg-primary hover:bg-primary/90" size="sm">
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Regular Announcements */}
          <div className="bg-white rounded-lg border border-border p-6 hover:border-primary/50 transition">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">Certificate of Good Moral Character Available</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Approved certificates are now ready for pickup at the barangay office. Visit us during office hours.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Posted on March 15, 2026</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">New</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6 hover:border-primary/50 transition">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">Barangay Health Center Extended Hours</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      The barangay health center will now be open until 7:00 PM on Mondays and Fridays to better serve residents.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Posted on March 12, 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6 hover:border-primary/50 transition">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">Road Maintenance Schedule</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Road maintenance will be conducted on selected streets from March 18-22. Please expect temporary traffic interruptions.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Posted on March 10, 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6 hover:border-primary/50 transition">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">Barangay Fiesta 2026</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Mark your calendars! Barangay Santiago fiesta will be celebrated on April 10-12. Various activities and entertainment planned.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Posted on March 5, 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
