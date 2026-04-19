# Next.js + PWA Quick Start Guide

## For Developers

### Installation (5 minutes)

```bash
cd /vercel/share/v0-project/artifacts/barangay-portal-nextjs
npm install
```

### Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_key
```

### Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## For Users - Web App

### Desktop Access

1. Visit: https://barangay-santiago.vercel.app
2. Use your credentials to login
3. Access all features through the web interface

### Features Available

- Document requests
- Status tracking
- Announcements
- Blotter access
- Resident profiles
- AI chatbot assistant

## For Users - Mobile App

### Installation on Android

**Method 1: Chrome Menu**
1. Open in Chrome browser
2. Tap menu (⋮) → Install app
3. Confirm installation
4. App appears on home screen

**Method 2: Google Play Store**
- Distributed via Barangay's Google Play account
- Search: "Barangay Santiago"
- Install like any other app

### Installation on iOS

**Method 1: Safari Share**
1. Open in Safari browser
2. Tap Share icon (↗)
3. Select "Add to Home Screen"
4. Confirm
5. App appears on home screen

**Method 2: App Store**
- Distributed via Barangay's App Store account
- Search: "Barangay Santiago"
- Install like any other app

### Offline Features

- View cached announcements
- Access offline documents
- Store draft requests
- Auto-sync when online

### Mobile Optimizations

- Touch-optimized interface
- Faster load times
- Offline mode
- Data saver mode
- Portrait-optimized layout

## File Structure Overview

```
Key Directories:
├── src/app/          → Pages (Router)
├── src/components/   → Reusable UI parts
├── src/lib/         → Utilities & config
├── public/          → Images, manifest
└── src/middleware.ts → Authentication
```

## Common Tasks

### Create New Page

```typescript
// src/app/new-page/page.tsx
export default function NewPage() {
  return <div>Content</div>;
}
```

### Create API Route

```typescript
// src/app/api/new-route/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: [] });
}
```

### Add Component

```typescript
// src/components/new-component.tsx
export function NewComponent() {
  return <div>Component</div>;
}
```

### Use Hook

```typescript
"use client";
import { useState } from "react";

export default function Page() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari (iOS): Full support with some limitations
- Mobile browsers: Full support

## Known Limitations

### iOS Safari

- Limited background sync
- No web push notifications
- Limited storage (50MB)
- No app shortcuts

### Offline Mode

- API calls fail gracefully
- Previous data shown from cache
- Auto-retries when online

## Performance Tips

- Use mobile data saver: Tap menu → Settings
- Clear cache if experiencing issues
- Update app when prompted
- Use WiFi for large document uploads

## Troubleshooting

### App Won't Install

- Ensure browser is updated
- Clear browser cache
- Try different browser

### Offline Mode Not Working

- Check if service worker registered
- Open DevTools → Application → Service Workers
- Verify "Active" status

### Slow Performance

- Clear cache: Settings → Clear data
- Close background apps
- Check internet connection

## Contact Support

- Email: barangay@santiago.gov.ph
- Phone: +63-XXXX-XXXX
- Hours: 8 AM - 5 PM (Mon-Fri)

## Version Information

- **Version**: 2.0
- **Framework**: Next.js 16
- **Status**: Production Ready
- **Last Updated**: April 2026

## Release Notes

### v2.0 - Next.js Migration

- Migrated from Vite to Next.js 16
- Added PWA support for mobile app
- Offline functionality
- Improved performance
- Enhanced AI chatbot
- Better mobile experience

### v1.0 - Initial Release

- Original Vite + React app
- Basic portal functionality
