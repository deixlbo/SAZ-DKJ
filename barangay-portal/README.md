# Barangay Santiago Portal - Next.js Web & Mobile App

A modern, production-ready portal for Barangay Santiago built with Next.js 16, supporting both web and mobile (PWA) platforms with all features integrated.

## Features

### For Everyone
- Home page with portal access
- AI Chatbot assistant (25+ features)
- Announcements and news
- Responsive design (web & mobile)
- Offline support via PWA

### Resident Features (Coming)
- Document requests
- Request status tracking
- Personal profile
- Announcements

### Official Features (Coming)
- Document management
- Resident management
- Blotter management
- Project management
- Report generation

## Quick Start

### 1. Install Dependencies
```bash
cd /vercel/share/v0-project/barangay-portal
npm install
```

### 2. Create Environment File
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Mobile App Installation

### Android
1. Open in Chrome
2. Tap menu (⋮)
3. Select "Install app"

### iOS
1. Open in Safari
2. Tap Share (↗)
3. Select "Add to Home Screen"

## Project Structure

```
barangay-portal/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + PWA setup
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   ├── api/
│   │   │   └── chat/route.ts   # Chat API
│   │   ├── resident/           # Resident pages
│   │   └── official/           # Official pages
│   ├── components/
│   │   ├── chatbot.tsx         # AI Assistant
│   │   ├── providers.tsx       # App providers
│   │   └── ui/                 # UI components
│   └── lib/                    # Utilities
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service Worker
│   └── icons/                  # App icons
├── package.json
├── next.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

## Available Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Check code quality
npm run type-check   # TypeScript validation
```

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + Tailwind CSS
- **Mobile:** Progressive Web App (PWA)
- **Styling:** Tailwind CSS + custom theme
- **Components:** shadcn/ui pattern
- **Type Safety:** TypeScript 5
- **Chat API:** Built-in `/api/chat` endpoint

## Deployment

### Vercel (Recommended - Free)
```bash
npm install -g vercel
vercel deploy --prod
```

### Docker
```bash
docker build -t barangay-portal .
docker run -p 3000:3000 barangay-portal
```

### Railway / Render
Connect your GitHub repo to Railway or Render for automatic deployment.

## Features Included

- ✅ Responsive design (mobile-first)
- ✅ PWA support (offline, installable)
- ✅ AI Chatbot with 25+ features
- ✅ Dark mode ready (theme variables)
- ✅ Government green theme
- ✅ TypeScript for type safety
- ✅ Fast performance (Turbopack)
- ✅ SEO optimized
- ✅ Accessibility friendly

## Next Steps

1. **Add Resident Portal:** Create resident pages in `src/app/resident/`
2. **Add Official Portal:** Create official pages in `src/app/official/`
3. **Connect Database:** Setup Supabase PostgreSQL
4. **Setup Authentication:** Implement login/auth flow
5. **Add Real Data:** Connect API endpoints
6. **Customize Theme:** Update colors in `src/app/globals.css`
7. **Deploy:** Push to production

## Environment Variables

```env
NEXT_PUBLIC_API_URL=          # API base URL
SUPABASE_URL=                 # Supabase project URL
SUPABASE_ANON_KEY=           # Supabase anon key
OPENAI_API_KEY=              # For enhanced chatbot
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers (iOS 15+, Android 9+)

## License

Barangay Santiago Portal © 2026

## Support

For issues or questions, check the documentation files or contact development team.
