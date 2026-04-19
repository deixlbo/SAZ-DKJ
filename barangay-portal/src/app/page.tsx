export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-primary">Barangay Santiago Portal</h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Welcome to your official Barangay Santiago portal for residents and officials
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {/* Resident Portal */}
            <div className="p-8 rounded-lg border border-gray-200 hover:border-primary/50 transition">
              <h2 className="text-2xl font-bold mb-4 text-primary">Resident Portal</h2>
              <p className="text-foreground/70 mb-6">
                Access your barangay services, submit requests, and stay updated with announcements
              </p>
              <a href="/resident/login" className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
                Resident Login
              </a>
            </div>

            {/* Official Portal */}
            <div className="p-8 rounded-lg border border-gray-200 hover:border-primary/50 transition">
              <h2 className="text-2xl font-bold mb-4 text-sidebar">Official Portal</h2>
              <p className="text-foreground/70 mb-6">
                Manage barangay operations, documents, residents, and community services
              </p>
              <a href="/official/login" className="inline-block px-6 py-2 bg-sidebar text-white rounded-lg hover:bg-sidebar/90 transition">
                Official Login
              </a>
            </div>
          </div>

          <div className="mt-12 p-8 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm text-foreground/70">
              Need help? Click the chat button in the bottom right corner to get assistance
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
