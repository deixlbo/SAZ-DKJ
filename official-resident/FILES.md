# Project Files Summary

## Configuration Files
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `middleware.ts` - Route protection middleware

## App Directory Structure (Next.js 15+)

### Root
- `app/layout.tsx` - Root layout
- `app/globals.css` - Global styles
- `app/page.tsx` - Landing page

### Authentication Routes (`app/(auth)/`)
- `app/(auth)/login/official/page.tsx` - Official login
- `app/(auth)/login/resident/page.tsx` - Resident login
- `app/(auth)/register/page.tsx` - Registration

### Portal Layout (`app/(portal)/`)
- `app/(portal)/layout.tsx` - Portal layout with sidebar, header, chatbot

### Official Portal Routes
- `app/(portal)/official/dashboard/page.tsx`
- `app/(portal)/official/documents/page.tsx` (with dropdown filter + Excel export)
- `app/(portal)/official/blotter/page.tsx` (with mediation notifications + search)
- `app/(portal)/official/projects/page.tsx` (with print header)
- `app/(portal)/official/residents/page.tsx` (with Purok filter)
- `app/(portal)/official/announcements/page.tsx` (full-page, no borders)
- `app/(portal)/official/assets/page.tsx`
- `app/(portal)/official/ordinances/page.tsx`
- `app/(portal)/official/businesses/page.tsx`
- `app/(portal)/official/profile/page.tsx`

### Resident Portal Routes
- `app/(portal)/resident/dashboard/page.tsx`
- `app/(portal)/resident/documents/page.tsx` (with upload validation checklist)
- `app/(portal)/resident/assets/page.tsx` (read-only)
- `app/(portal)/resident/announcements/page.tsx`
- `app/(portal)/resident/blotter/page.tsx` (file complaints)
- `app/(portal)/resident/ordinances/page.tsx`
- `app/(portal)/resident/profile/page.tsx`

## Components

### Chatbot (`components/chatbot/`)
- `components/chatbot/chatbot.tsx` - 25-feature AI chatbot

### Portal Components (`components/portal/`)
- `components/portal/sidebar.tsx` - Minimalist sidebar with navigation
- `components/portal/header.tsx` - Header with official info

### UI Components (`components/ui/`)
- All shadcn/ui components copied from original React app
- Including: button, input, select, textarea, card, checkbox, label, scroll-area, etc.

## Library Files (`lib/`)
- `lib/auth-context.tsx` - Authentication context (no mock data)
- `lib/api.ts` - API client with all endpoints
- `lib/queryClient.ts` - React Query configuration
- `lib/export.ts` - Excel export and print utilities

## Documentation
- `README.md` - Main documentation
- `IMPLEMENTATION.md` - Implementation details
- `FILES.md` - This file

## Key Features by File

### Documents Page (Official)
**File:** `app/(portal)/official/documents/page.tsx`
- Dropdown filter: All/Pending/Approved/Paid
- Excel export button (downloads filtered data)
- Print button (removes borders)
- Table display with status badges
- No search bar (replaced with dropdown)

### Documents Page (Resident)
**File:** `app/(portal)/resident/documents/page.tsx`
- Document type selector
- Required documents checklist
- Upload validation (cannot submit incomplete)
- Document request history
- Status tracking

### Blotter Page (Official)
**File:** `app/(portal)/official/blotter/page.tsx`
- Search by person or reported area
- Case cards with status badges
- Set Mediation button (notifies respondent)
- Set Hearing button (notifies respondent)
- Status: Ongoing, Mediation Scheduled, Hearing Scheduled, Resolved

### Projects Page (Official)
**File:** `app/(portal)/official/projects/page.tsx`
- Print header: "Republic of the Philippines", etc.
- No planning/ongoing/completed tabs
- Full-page layout for printing
- Progress bars for completion percentage
- Budget and date information

### Residents Page (Official)
**File:** `app/(portal)/official/residents/page.tsx`
- Purok dropdown filter (1-5)
- Grid display of residents
- Senior citizen and PWD badges
- Contact and address information

### Sidebar Component
**File:** `components/portal/sidebar.tsx`
- Minimalist design
- Official info at top (name, email)
- Mobile hamburger menu
- Logout button
- No official name/position display (moved to header)

### Header Component
**File:** `components/portal/header.tsx`
- Displays official image, name, position (for officials)
- Notification bell with badge
- Resident name display (for residents)

### Chatbot Component
**File:** `components/chatbot/chatbot.tsx`
- 25 AI features (12 official + 13 resident)
- Quick action buttons
- Message history with timestamps
- Role-specific responses
- API-driven responses

## API Integration Points

All pages use `api.ts` for data fetching via React Query:

- Documents: `api.documents.list()`, `api.documents.create()`
- Residents: `api.residents.list()`, `api.residents.get()`
- Blotter: `api.blotter.list()`, `api.blotter.update()`
- Announcements: `api.announcements.list()`
- Projects: `api.projects.list()`
- Assets: `api.assets.list()`
- Chatbot: `api.chatbot.sendMessage()`

## No Mock Data
- ❌ No mock-data.ts
- ❌ No hardcoded demo values
- ❌ No demo credentials
- ✅ All data from API endpoints
- ✅ React Query for state management

## Print Styles
- Global CSS in `app/globals.css`
- `.no-print` hides elements during print
- `.print-full-page` removes margins/borders
- `@media print` rules for print-friendly layout
- Republic header added to official documents

## Export Functionality
- `lib/export.ts` handles Excel generation
- SheetJS (xlsx) library
- Filename includes date
- Custom column widths
- Used in Documents page for inventory export
