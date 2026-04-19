'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Users, Building2, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Barangay Santiago</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/official/login">
                <Button variant="outline" size="sm">Official Login</Button>
              </Link>
              <Link href="/resident/login">
                <Button size="sm">Resident Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Welcome to our Portal</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Barangay Santiago Digital Portal
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your gateway to efficient barangay services. Manage documents, access announcements, and connect with your community.
          </p>
        </div>

        {/* Portal Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Official Portal */}
          <Link href="/official/dashboard">
            <div className="group relative rounded-2xl border border-border p-8 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Official Portal</h3>
              <p className="text-muted-foreground mb-4">
                Access administrative tools, manage documents, view residents, and oversee community projects.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                Access as Official →
              </div>
            </div>
          </Link>

          {/* Resident Portal */}
          <Link href="/resident/dashboard">
            <div className="group relative rounded-2xl border border-border p-8 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Resident Portal</h3>
              <p className="text-muted-foreground mb-4">
                Request documents, view announcements, check application status, and manage your profile.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                Access as Resident →
              </div>
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-4 text-center text-sm">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="font-semibold text-foreground mb-1">24/7 Access</p>
            <p className="text-muted-foreground">Available anytime, anywhere</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="font-semibold text-foreground mb-1">Secure</p>
            <p className="text-muted-foreground">Your data is protected</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="font-semibold text-foreground mb-1">Fast</p>
            <p className="text-muted-foreground">Quick response times</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="font-semibold text-foreground mb-1">Mobile</p>
            <p className="text-muted-foreground">Works on all devices</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/50 bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Barangay Santiago. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
