export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Barangay Santiago</h1>
        <p className="text-lg text-muted-foreground">Portal initialized. Redirecting...</p>
        <div className="mt-8 animate-pulse text-green-600">Loading...</div>
      </div>
    </main>
  );
}
