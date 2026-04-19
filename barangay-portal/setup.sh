#!/bin/bash

echo "🚀 Setting up Barangay Santiago Portal..."

# Check if Node is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is required. Please install it first."
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
  echo "⚙️ Creating .env.local..."
  echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Run development server: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Click the chat button to test the AI assistant"
echo "4. To install as mobile app:"
echo "   - Android: Menu (⋮) → Install app"
echo "   - iOS: Share (↗) → Add to Home Screen"
echo ""
echo "Happy coding! 🎉"
