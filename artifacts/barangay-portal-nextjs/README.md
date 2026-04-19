# Barangay Santiago Portal - Next.js + PWA

A modern, production-ready government portal application with web and mobile app support.

## Features

### Web App
- Responsive design
- Real-time updates
- Admin dashboard
- Document management
- AI chatbot assistant
- Announcements system
- Blotter management
- Resident database

### Mobile App (PWA)
- Installable on iOS & Android
- Offline functionality
- Push notifications
- App shortcuts
- Native app experience
- Fast performance

## Technology Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 |
| Runtime | Node.js |
| UI Library | React 19 |
| Styling | Tailwind CSS 3 |
| Database | Supabase PostgreSQL |
| Auth | Custom (JWT) |
| Components | Radix UI |
| Forms | React Hook Form + Zod |
| AI | OpenAI API |
| Deployment | Vercel |
| PWA | Service Workers |

## Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Git

### Installation

```bash
# Clone or navigate to project
cd barangay-portal-nextjs

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start dev server
npm run dev
```

Visit: http://localhost:3000

### Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Export static version
npm run export
```

## Project Structure

```
src/
├── app/                    # App Router (pages & layouts)
│   ├── (auth)/            # Authentication group
│   ├── official/          # Official portal
│   ├── resident/          # Resident portal
│   ├── api/               # API Routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── chatbot/          # AI chatbot
│   └── portal/           # Portal components
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── usePWA.ts
│   └── ...
├── lib/                  # Utilities & config
│   ├── auth-context.tsx
│   ├── api-client.ts
│   ├── utils.ts
│   └── ...
└── middleware.ts        # Auth middleware

public/
├── manifest.json        # PWA manifest
├── sw.js               # Service Worker
├── icons/              # App icons
└── ...
```

## Configuration

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Tailwind CSS

Configured in `tailwind.config.ts` with:
- Custom color palette (green government theme)
- Mobile-first responsive design
- Custom CSS variables
- Dark mode support

## Development

### Creating Pages

```typescript
// src/app/new-feature/page.tsx
export default function Page() {
  return <h1>New Feature</h1>;
}
```

### Creating API Routes

```typescript
// src/app/api/endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: [] });
}
```

### Using Components

```typescript
import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button onClick={() => console.log("Clicked")}>Click me</Button>;
}
```

### Custom Hooks

```typescript
"use client";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}
```

## PWA Features

### Installation

- Android: Chrome menu → Install app
- iOS: Safari share → Add to Home Screen

### Offline Support

- Service Worker caching
- Network-first strategy for API
- Cache-first for static assets
- Offline notification

### Mobile Optimizations

- Touch-optimized UI
- Fast load times
- Responsive images
- Mobile navigation

## API Routes

### Authentication

```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/register
GET  /api/auth/me
```

### Documents

```
GET    /api/documents
POST   /api/documents
GET    /api/documents/[id]
PUT    /api/documents/[id]
DELETE /api/documents/[id]
```

### Residents

```
GET    /api/residents
POST   /api/residents
GET    /api/residents/[id]
PUT    /api/residents/[id]
```

### Blotter

```
GET    /api/blotter
POST   /api/blotter
GET    /api/blotter/[id]
PUT    /api/blotter/[id]
```

## Performance

### Optimization Strategies

1. **Image Optimization**
   - Next.js Image component
   - Automatic optimization
   - Responsive images

2. **Code Splitting**
   - Dynamic imports
   - Route-based splitting
   - Automatic chunking

3. **Caching**
   - Service Worker
   - HTTP caching headers
   - Client-side caching

4. **Fonts**
   - Google Fonts optimization
   - CSS variable-based theming
   - System font fallbacks

### Monitoring

Use Vercel Analytics or similar tools to monitor:
- Core Web Vitals
- Performance metrics
- User interactions
- Error tracking

## Security

### Implemented

- Authentication middleware
- JWT tokens
- HTTP-only cookies
- CSRF protection
- Input validation
- SQL parameterization
- Rate limiting ready

### Best Practices

- Never commit secrets
- Use environment variables
- Validate all inputs
- Sanitize output
- Keep dependencies updated
- Regular security audits

## Testing

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

### Lighthouse

```bash
npm run build
npm start
# Open DevTools → Lighthouse
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel deploy
```

### Other Platforms

- AWS Amplify
- Netlify
- Railway
- Render
- Docker

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Port Already in Use

```bash
npm run dev -- -p 3001
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
npm run type-check
npm run lint
```

### PWA Not Installing

- Check manifest.json
- Verify icons exist
- Try different browser
- Clear cache

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request
5. Code review
6. Merge to main

## Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)

## Support

For issues or questions:
- Email: dev@santiago.gov.ph
- GitHub Issues: (link to repo)
- Documentation: /docs

## License

Government of the Philippines - Barangay Santiago
All rights reserved.

## Version

- **Current**: 2.0
- **Release Date**: April 2026
- **Status**: Production Ready

## Changelog

### v2.0 - Next.js Migration (April 2026)
- Migrated from Vite to Next.js 16
- Added PWA support
- Offline functionality
- Improved mobile experience
- Enhanced performance
- Updated AI chatbot

### v1.0 - Initial Release (2025)
- Original portal launch
- Basic functionality
- Vite + React stack
