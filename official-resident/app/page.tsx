import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-slate-900">
            Barangay Santiago Portal
          </h1>
          <p className="text-lg text-slate-600">
            Select your role to access the portal
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/login/official" className="block">
            <Button
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Official Portal
            </Button>
          </Link>

          <Link href="/login/resident" className="block">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-slate-300"
            >
              Resident Portal
            </Button>
          </Link>
        </div>

        <div className="text-sm text-slate-600">
          <p>Don&apos;t have an account?</p>
          <Link href="/register" className="text-red-600 hover:text-red-700 font-medium">
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
}
