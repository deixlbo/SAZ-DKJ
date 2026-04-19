# Deployment Guide - Barangay Santiago Portal

## Deployment Options

### 1. Vercel (Recommended)

**Advantages:**
- Zero-config Next.js deployment
- Automatic scaling
- Global CDN
- Built-in analytics
- Free tier available
- Edge middleware support

**Steps:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel deploy

# Production deployment
vercel deploy --prod
```

**Environment Variables in Vercel:**
1. Go to vercel.com dashboard
2. Select project
3. Settings → Environment Variables
4. Add variables for production

### 2. Docker + Cloud Run (Google Cloud)

**Advantages:**
- Full control
- Scalable
- Cost-effective
- Standard deployment

**Dockerfile:**
```dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

**Deploy:**
```bash
# Build image
docker build -t barangay-portal .

# Push to Container Registry
docker tag barangay-portal gcr.io/PROJECT_ID/barangay-portal
docker push gcr.io/PROJECT_ID/barangay-portal

# Deploy to Cloud Run
gcloud run deploy barangay-portal \
  --image gcr.io/PROJECT_ID/barangay-portal \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 3. AWS (EC2 + RDS)

**Advantages:**
- Industry standard
- Managed databases
- Auto-scaling
- Load balancing

**Setup:**
1. Launch EC2 instance (t3.medium)
2. Install Node.js
3. Configure security groups
4. Setup RDS PostgreSQL
5. Deploy app

### 4. Railway or Render

**Advantages:**
- Simple deployment
- Auto-deploy from GitHub
- Managed databases
- Cost-effective

**Steps:**
1. Connect GitHub repository
2. Set environment variables
3. Deploy button
4. Auto-scaling configured

## Environment Configuration

### Production Environment Variables

```env
# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://barangay-santiago.gov.ph
NEXT_PUBLIC_API_URL=https://api.barangay-santiago.gov.ph

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Security
JWT_SECRET=your_strong_secret_key
SESSION_SECRET=your_session_secret

# OpenAI
OPENAI_API_KEY=your_production_key

# Analytics
VERCEL_ANALYTICS_ID=your_analytics_id

# Email (optional)
SENDGRID_API_KEY=your_sendgrid_key
```

## Database Setup

### Supabase Setup

```sql
-- Enable authentication
CREATE USER barangay_admin IDENTIFIED BY 'secure_password';

-- Create main tables
CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  role text,
  created_at timestamp
);

CREATE TABLE documents (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  document_type text,
  status text,
  created_at timestamp
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
```

## SSL/TLS Certificate

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d barangay-santiago.gov.ph

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Managed Certificate (Vercel)

- Automatic with custom domain
- Free SSL/TLS
- Auto-renewal

## Performance Optimization for Production

### CDN Configuration

```typescript
// next.config.ts
export const headers = async () => {
  return [
    {
      source: "/api/:path*",
      headers: [
        { key: "Cache-Control", value: "private, max-age=0" },
      ],
    },
    {
      source: "/_next/static/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/images/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000" },
      ],
    },
  ];
};
```

### Image Optimization

```typescript
// Optimize images in production
import Image from "next/image";

export default function Profile() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={200}
      height={200}
      quality={75}
      priority
    />
  );
}
```

## Monitoring & Logging

### Sentry Integration

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Logging

```typescript
// src/lib/logger.ts
export function log(level: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${level}: ${message}`, data);
  
  // Send to service if needed
  if (level === "ERROR") {
    // Send to monitoring service
  }
}
```

## Scaling Considerations

### Load Balancing

- Vercel: Automatic
- AWS: Application Load Balancer
- GCP: Cloud Load Balancing
- On-premises: Nginx reverse proxy

### Database Scaling

- Read replicas
- Connection pooling
- Caching layer (Redis)
- Vertical scaling

### Caching Strategy

```typescript
// Cache API responses
export const revalidate = 3600; // 1 hour

export async function GET(request: NextRequest) {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly set
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Secrets in environment variables
- [ ] Regular dependency updates
- [ ] Security headers (CSP, X-Frame-Options)
- [ ] API authentication
- [ ] Audit logging

## Backup & Disaster Recovery

### Database Backups

```bash
# Supabase automatic backups
# Configure in dashboard → Database → Backups

# Manual backup
pg_dump -h host -U user -d database > backup.sql

# Restore
psql -h host -U user -d database < backup.sql
```

### Code Backups

- GitHub repository as primary
- Regular commits
- Tagged releases

## Maintenance

### Update Dependencies

```bash
npm update
npm audit fix
npm run type-check
npm run lint
```

### Monitor Performance

- Vercel Analytics
- Google Analytics
- Core Web Vitals
- Error tracking

### Regular Tasks

- Weekly: Check error logs
- Monthly: Update dependencies
- Quarterly: Security audit
- Annually: Load testing

## Rollback Procedure

### Vercel

```bash
vercel rollback
```

### Manual

1. Checkout previous commit
2. Deploy
3. Verify deployment
4. Notify users

## Support & Documentation

- Deployment docs: /docs/deployment
- Troubleshooting: /docs/troubleshooting
- Performance: /docs/performance
- Security: /docs/security
