'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

export default function ResidentLogin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-border shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Resident Login</h1>
            <p className="text-muted-foreground text-sm mt-2">Access your barangay account</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input 
                type="email" 
                placeholder="juan@email.com"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input 
                type="password" 
                placeholder="Enter your password"
                className="w-full"
              />
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90">
              Sign In
            </Button>
          </form>

          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20 text-center">
            <p className="text-xs text-primary font-medium">
              Demo: juan@email.com / any password (4+ chars)
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account? <Link href="/resident/register" className="text-primary font-medium hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
