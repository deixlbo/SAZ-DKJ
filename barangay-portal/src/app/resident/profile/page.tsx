'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Mail, Phone, MapPin, Edit2, Lightbulb } from 'lucide-react';

export default function ResidentProfile() {
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
          <Link href="/resident/announcements" className="block px-4 py-2 rounded-lg hover:bg-white/10 text-white transition">
            Announcements
          </Link>
          <Link href="/resident/profile" className="block px-4 py-2 rounded-lg bg-white/20 text-white font-medium">
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
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">View and manage your account information</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary/90 gap-2 hidden sm:flex">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-border p-8">
              <div className="mb-8 pb-8 border-b border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">JD</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Juan Dela Cruz</h2>
                      <p className="text-muted-foreground">Resident since 2015</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">First Name</label>
                      <p className="text-foreground font-medium">Juan</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                      <p className="text-foreground font-medium">Dela Cruz</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-foreground font-medium">juan@email.com</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-foreground font-medium">09123456789</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">Address Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Purok</label>
                      <p className="text-foreground font-medium">Purok 1 - Saranay</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Street</label>
                      <p className="text-foreground font-medium">Main Street</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">House No.</label>
                      <p className="text-foreground font-medium">123</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Zip Code</label>
                      <p className="text-foreground font-medium">7021</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">Contact Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-foreground">Receive email announcements</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-foreground">Receive SMS notifications</span>
                    </label>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-8 bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">juan@email.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground">09123456789</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">Purok 1</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Requests</span>
                  <span className="font-bold text-foreground">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Approved</span>
                  <span className="font-bold text-emerald-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-bold text-amber-600">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
