# Next.js Migration Guide - Barangay Santiago Portal

## Overview

This guide documents the complete migration from Vite + React to **Next.js 16** with **Progressive Web App (PWA)** support for both web and mobile app functionality.

## Why Next.js?

- **Server-Side Rendering (SSR)**: Better performance and SEO
- **Built-in API Routes**: Backend without separate server
- **Image Optimization**: Automatic optimization
- **App Router**: Modern file-based routing with layouts
- **Middleware**: Authentication and request handling
- **Built-in PWA Support**: Native mobile app-like experience
- **Edge Functions**: Deploy globally
- **TypeScript**: First-class support

## Project Structure

```
barangay-portal-nextjs/
├── src/
│   ├── app/                          # App Router (Next.js 16)
│   │   ├── layout.tsx                # Root layout with metadata
│   │   ├── page.tsx                  # Home page
│   │   ├── globals.css               # Global styles
│   │   ├── login/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── resident/page.tsx
│   │   │   └── official/page.tsx
│   │   ├── official/                 # Official portal routes
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── documents/page.tsx
│   │   │   ├── blotter/page.tsx
│   │   │   ├── residents/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   └── announcements/page.tsx
│   │   ├── resident/                 # Resident portal routes
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── documents/page.tsx
│   │   │   ├── requests/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── announcements/page.tsx
│   │   └── api/                      # API Routes
│   │       ├── auth/[action]/route.ts
│   │       ├── documents/route.ts
│   │       ├── users/route.ts
│   │       └── ...
│   ├── components/                   # Reusable components
│   │   ├── ui/                       # Shadcn/ui components
│   │   ├── chatbot/                  # Chatbot component
│   │   ├── portal/                   # Portal-specific components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── layout.tsx
│   │   └── ...
│   ├── hooks/                        # Custom hooks
│   │   ├── usePWA.ts                 # PWA registration
│   │   ├── useAuth.ts                # Authentication
│   │   └── ...
│   ├── lib/                          # Utilities and config
│   │   ├── auth-context.tsx
│   │   ├── api-client.ts
│   │   ├── chatbot-config.ts
│   │   └── utils.ts
│   └── middleware.ts                 # Authentication middleware
├── public/                           # Static files
│   ├── manifest.json                 # PWA manifest
│   ├── sw.js                         # Service Worker
│   ├── icons/                        # App icons (192x192, 512x512)
│   └── screenshots/                  # PWA screenshots
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── postcss.config.js
```

## Migration Steps

### 1. Setup Next.js Project

```bash
cd /vercel/share/v0-project/artifacts/barangay-portal-nextjs
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# OpenAI (for chatbot)
OPENAI_API_KEY=your_key
```

### 3. Copy Components

Migrate from old Vite project:

```bash
cp -r old-project/src/components/* src/components/
cp -r old-project/src/lib/* src/lib/
cp -r old-project/src/hooks/* src/hooks/
```

### 4. Update Imports

Change from relative to absolute imports:

```typescript
// Old (Vite)
import { Button } from "../components/ui/button";

// New (Next.js)
import { Button } from "@/components/ui/button";
```

### 5. Create API Routes

Move existing API logic to `src/app/api/` directory:

```typescript
// src/app/api/documents/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    return NextResponse.json({ data: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Your logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 6. Update Layout Structure

Use Next.js App Router layouts:

```typescript
// src/app/official/layout.tsx
import { PortalLayout } from "@/components/portal/layout";

export default function OfficialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayout role="official">{children}</PortalLayout>;
}
```

## PWA Configuration

### Features Enabled

- Install to home screen
- Offline functionality
- Push notifications ready
- App shortcuts
- Share target API

### Testing PWA

```bash
# Build and serve
npm run build
npm start

# Open in browser
# Press F12 → Application → Manifest
# Look for "Install app" prompt
```

### Install on Android

1. Visit app in Chrome
2. Tap menu (⋮)
3. Select "Install app"

### Install on iOS

1. Visit app in Safari
2. Tap Share
3. Select "Add to Home Screen"

## Mobile-First Responsive Design

All components use mobile-first approach:

```typescript
// Mobile by default
<div className="flex flex-col gap-4
  // Tablet and up
  md:flex-row md:gap-6
  // Desktop and up
  lg:gap-8"
>
```

### Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Authentication Flow

```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading };
}
```

## API Routes Pattern

### Documents API

```typescript
// src/app/api/documents/route.ts
export async function GET(request: NextRequest) {
  const residentId = request.nextUrl.searchParams.get("residentId");
  // Fetch from database
  return NextResponse.json(documents);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Save to database
  return NextResponse.json({ id: newId });
}

// src/app/api/documents/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Fetch specific document
  return NextResponse.json(document);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Update document
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Delete document
  return NextResponse.json({ success: true });
}
```

## Development Commands

```bash
# Development server
npm run dev
# http://localhost:3000

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start

# Export static site (for mobile)
npm run export
```

## Performance Optimizations

### Image Optimization

```typescript
import Image from "next/image";

export default function Profile() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={200}
      height={200}
      priority
    />
  );
}
```

### Code Splitting

```typescript
import dynamic from "next/dynamic";

const DynamicComponent = dynamic(
  () => import("@/components/heavy-component"),
  { loading: () => <div>Loading...</div> }
);
```

### Font Optimization

```typescript
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });
```

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Set in deployment platform:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
```

## Testing

### Unit Tests

```typescript
// __tests__/lib/utils.test.ts
import { formatDate } from "@/lib/utils";

describe("formatDate", () => {
  it("formats date correctly", () => {
    expect(formatDate(new Date("2024-01-15"))).toBe("Jan 15, 2024");
  });
});
```

### E2E Tests

```typescript
// e2e/login.spec.ts
import { test, expect } from "@playwright/test";

test("login flow", async ({ page }) => {
  await page.goto("/login/resident");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "password");
  await page.click("button:has-text('Sign in')");
  await expect(page).toHaveURL("/resident/dashboard");
});
```

## Troubleshooting

### Service Worker Issues

Clear cache and re-register:

```javascript
// In browser console
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister());
  });
}
```

### Build Errors

Check for missing dependencies:

```bash
npm install
npm run type-check
```

### API Route Not Working

Ensure correct path structure:

```
✓ src/app/api/documents/route.ts
✗ src/api/documents/route.ts
```

## Migration Checklist

- [ ] Setup Next.js project
- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Migrate components
- [ ] Create API routes
- [ ] Update authentication
- [ ] Implement PWA (manifest + SW)
- [ ] Test on mobile
- [ ] Configure deployment
- [ ] Setup CI/CD
- [ ] Performance testing
- [ ] Security review

## Performance Metrics

### Target Metrics

- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Score**: > 90

### Monitoring

Use Vercel Analytics or similar:

```typescript
// src/app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Security Considerations

- HTTPS only
- CSRF protection via middleware
- Input validation on API routes
- Rate limiting
- Authentication middleware
- Row-level security (Supabase)
- Sensitive data in environment variables

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Vercel Documentation](https://vercel.com/docs)
