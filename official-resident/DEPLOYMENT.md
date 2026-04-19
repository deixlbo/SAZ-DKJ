# Deployment Guide - Barangay Santiago Portal

## Quick Start

### 1. Local Development

```bash
cd official-resident

# Install dependencies
pnpm install

# Create .env.local file
cp .env.local.example .env.local

# Edit .env.local with your API endpoints
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Run development server
pnpm dev
```

Visit `http://localhost:3000`

### 2. Build for Production

```bash
pnpm build
pnpm start
```

## Environment Variables

Required variables in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://your-backend-api.com
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Deploy to Vercel

### Option 1: Using Vercel CLI

```bash
cd official-resident
npm install -g vercel
vercel deploy
```

### Option 2: GitHub Integration

1. Push code to GitHub repository
2. Connect repository to Vercel dashboard
3. Set environment variables in Vercel project settings
4. Deploy automatically on git push

## API Backend Requirements

The app expects the following API endpoints:

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

### Documents
- `GET /documents` - List documents
- `POST /documents` - Create document
- `PUT /documents/:id` - Update document
- `DELETE /documents/:id` - Delete document

### Residents
- `GET /residents` - List residents
- `GET /residents/:id` - Get resident
- `POST /residents` - Create resident
- `PUT /residents/:id` - Update resident
- `DELETE /residents/:id` - Delete resident

### Blotter
- `GET /blotter` - List blotter cases
- `GET /blotter/:id` - Get case
- `POST /blotter` - Create case
- `PUT /blotter/:id` - Update case
- `DELETE /blotter/:id` - Delete case

### Projects
- `GET /projects` - List projects
- `GET /projects/:id` - Get project
- `POST /projects` - Create project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Announcements
- `GET /announcements` - List announcements
- `GET /announcements/:id` - Get announcement
- `POST /announcements` - Create announcement
- `PUT /announcements/:id` - Update announcement
- `DELETE /announcements/:id` - Delete announcement

### Assets
- `GET /assets` - List assets
- `GET /assets/:id` - Get asset
- `POST /assets` - Create asset
- `PUT /assets/:id` - Update asset
- `DELETE /assets/:id` - Delete asset

### Ordinances
- `GET /ordinances` - List ordinances
- `GET /ordinances/:id` - Get ordinance
- `POST /ordinances` - Create ordinance (NEW)
- `PUT /ordinances/:id` - Update ordinance (NEW)
- `DELETE /ordinances/:id` - Delete ordinance (NEW)

### Businesses
- `GET /businesses` - List businesses
- `GET /businesses/:id` - Get business
- `POST /businesses` - Create business (NEW)
- `PUT /businesses/:id` - Update business (NEW)
- `DELETE /businesses/:id` - Delete business (NEW)

### Chatbot
- `POST /chatbot/message` - Send message to chatbot
- `GET /chatbot/insights/:type` - Get insights

## Authentication Flow

1. User selects Official or Resident on landing page
2. Login page specific to role (no demo credentials shown)
3. Backend validates credentials and returns token
4. Token stored in localStorage
5. All API requests include Authorization header
6. Middleware protects routes based on role

## Database Schema Expected

### Users/Officials Table
- id (UUID)
- email (unique)
- password_hash
- name
- position
- image (URL)
- role ('official' | 'resident')
- created_at
- updated_at

### Documents Table
- id (UUID)
- resident_id (FK)
- type (string)
- status ('pending' | 'approved' | 'paid')
- required_files (JSON array)
- uploaded_files (JSON array)
- created_at
- updated_at

### Residents Table
- id (UUID)
- email (unique)
- password_hash
- name
- contact_number
- address
- birthdate
- purok (1-5)
- is_senior_citizen (boolean)
- is_pwd (boolean)
- image (URL)
- role ('resident')
- created_at
- updated_at

### Projects Table
- id (UUID)
- title (string)
- description (text)
- status ('planning' | 'ongoing' | 'completed')
- budget (decimal)
- completion_percentage (integer)
- start_date (date)
- end_date (date)
- created_at
- updated_at

### Ordinances Table
- id (UUID)
- title (string)
- description (text)
- effective_date (date)
- created_at
- updated_at

### Businesses Table
- id (UUID)
- name (string)
- owner_name (string)
- type (string)
- address (string)
- contact_number (string)
- created_at
- updated_at

### Blotter Table
- id (UUID)
- complainant_name (string)
- respondent_name (string)
- reported_area (string)
- complaint_details (text)
- status ('ongoing' | 'mediation_scheduled' | 'hearing_scheduled' | 'resolved')
- created_at
- updated_at

## Troubleshooting

### API Connection Error
- Check `NEXT_PUBLIC_API_URL` in .env.local
- Verify backend is running
- Check CORS settings on backend

### Login Issues
- Verify user exists in database
- Check password is correct
- Ensure backend auth endpoint works

### Data Not Loading
- Check React Query logs in browser console
- Verify API endpoint responses
- Check network tab for failed requests

### Build Errors
- Clear `node_modules` and `.next`: `rm -rf node_modules .next && pnpm install`
- Check Node.js version (v18+)
- Run `pnpm build` to see errors

## Performance Tips

1. Enable caching on static assets
2. Use CDN for images
3. Implement API response caching with React Query
4. Monitor Core Web Vitals in Vercel Analytics
5. Optimize database queries on backend

## Security Checklist

- [ ] Remove demo credentials
- [ ] Use HTTPS in production
- [ ] Set secure cookies (HttpOnly, Secure, SameSite)
- [ ] Validate all user inputs on backend
- [ ] Use parameterized queries
- [ ] Rate limit API endpoints
- [ ] Implement CORS properly
- [ ] Hash passwords with bcrypt
- [ ] Implement refresh token rotation
- [ ] Regular security audits

## Support

For issues or questions:
1. Check browser console for errors
2. Review API response in Network tab
3. Check GitHub issues
4. Contact development team
