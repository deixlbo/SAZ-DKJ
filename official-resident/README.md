# Barangay Santiago Official & Resident Portal

A comprehensive Next.js 15+ application for managing Barangay Santiago official and resident operations with AI chatbot integration.

## Features

### Official Portal (12 AI Features)
- Smart daily task assistant
- Real-time data insights  
- Auto report generator
- Document assistance
- Blotter case assistance
- Notification drafting
- Resident search & filtering
- Event/announcement generation
- Smart validation
- Email automation ready
- Predictive insights framework
- Voice command support

### Resident Portal (13 AI Features)
- Step-by-step guidance
- Document request assistance
- Smart checklist system
- Request status tracking
- Notification explanation
- Barangay information
- Announcement explanation
- Blotter process guidance
- Profile management help
- Event discovery
- Email & request help
- Multilingual support (English, Tagalog, Taglish)
- Voice assistant

### Key Pages

**Official Portal**
- Dashboard with statistics
- Document Requests (dropdown filter, Excel export)
- Blotter (mediation/hearing notifications, search by area)
- Projects (print with Republic header)
- Residents (Purok dropdown filter)
- Announcements (full-page, no borders)
- Assets, Ordinances, Businesses, Profile

**Resident Portal**
- Dashboard with quick actions
- Document Requests (upload validation checklist)
- Assets (read-only viewing)
- Announcements
- Blotter (file complaints)
- Ordinances
- Profile

## Tech Stack

- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + React Query
- **Database**: Supabase (via API)
- **Auth**: Session-based with middleware protection
- **Export**: SheetJS (xlsx) for Excel export
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Backend API running on `http://localhost:3001`

### Installation

```bash
# Install dependencies
pnpm install

# Create .env.local
cp .env.example .env.local

# Update environment variables
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

### Running Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase endpoint
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_CHATBOT_ENABLED` - Enable/disable AI chatbot

## Project Structure

```
official-resident/
├── app/                              # Next.js app directory
│   ├── (auth)/                      # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (portal)/                    # Portal routes
│   │   ├── official/                # Official portal pages
│   │   └── resident/                # Resident portal pages
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Global styles
├── components/
│   ├── chatbot/                     # AI chatbot component
│   ├── portal/                      # Portal layout components
│   └── ui/                          # shadcn/ui components
├── lib/
│   ├── api.ts                       # API client
│   ├── auth-context.tsx             # Auth context provider
│   ├── export.ts                    # Export utilities
│   └── queryClient.ts               # React Query client
├── middleware.ts                    # Route protection
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Key Features

### Authentication
- Role-based login (Official/Resident)
- Middleware-based route protection
- API-driven authentication
- No mock credentials

### Data Fetching
- React Query for caching and state management
- API-driven data (no mock data)
- Real-time updates via React Query

### Export & Print
- Excel export for document inventory
- Print-friendly layouts with full-page occupation
- Republic of PH header for official documents
- Dropdown filters for data filtering

### Document Management
- Upload validation checklist for residents
- Cannot submit without all required documents
- Document tracking with status
- Official review and approval workflow

### Chatbot Integration
- 25 AI-powered features
- Role-specific assistance (Official/Resident)
- Multilingual support
- Quick action buttons

## API Integration

All data is fetched from backend API:

```
/auth/login          - User authentication
/auth/register       - User registration
/documents           - Document CRUD
/residents           - Resident management
/blotter             - Blotter cases
/announcements       - Announcements
/projects            - Projects management
/assets              - Asset management
/ordinances          - Ordinances
/businesses          - Business registry
/chatbot/message     - AI chatbot endpoint
```

## Development

### Build for Production

```bash
pnpm build
pnpm start
```

### Code Quality

```bash
pnpm lint
pnpm typecheck
```

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/barangay-official-resident-portal)

Or manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Security Notes

- No demo credentials (remove `captain@brgy-santiago.gov.ph` and `juan@email.com`)
- Session-based authentication with HTTP-only cookies
- Middleware validates user roles
- All API calls require auth token
- Environment variables are never exposed to client (unless prefixed with `NEXT_PUBLIC_`)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please contact the development team.

## Future Enhancements

- OCR for document recognition
- Face verification for identity check
- Real-time push notifications (PWA)
- Predictive analytics dashboard
- Voice-based conversational AI
- Blockchain document verification
- QR code system for authentication
- Geographic heatmaps with GIS
