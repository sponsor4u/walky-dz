# Walky DZ — Algeria COD Ecommerce Platform
## Deployment Guide

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- Netlify account

### Step 1: Create Supabase Project
1. Go to https://app.supabase.io
2. Click "New Project"
3. Enter project name (e.g., "walky-dz")
4. Choose region closest to your users (EU West recommended)
5. Wait for project creation

### Step 2: Run Migration
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Paste the entire contents of `migration.sql`
4. Click **Run** — this creates all tables, enums, indexes, policies, and seed data

### Step 3: Configure Environment Variables
1. Go to **Settings > API** in Supabase
2. Copy:
   - `NEXT_PUBLIC_SUPABASE_URL` → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` → service_role key
   - `DATABASE_URL` → Go to **Settings > Database**, copy connection string
3. Create `.env.local` in project root:
```bash
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=admin@yourstore.com
```

### Step 4: Setup Admin User
1. Run the app locally with `npm run dev`
2. Navigate to `/login`
3. Sign up with the email you set in `ADMIN_EMAIL`
4. The trigger will automatically set your role to `admin`
5. Alternatively, use SQL:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@yourstore.com';
```

### Step 5: Deploy to Netlify
1. Push code to GitHub
2. Connect repo to Netlify
3. Set environment variables in Netlify dashboard:
   - Build command: `npm run build`
   - Output directory: `.next`
4. Add all env variables from `.env.local`
5. Deploy

### Architecture Overview

```
walky-dz-refactor/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Admin routes (protected)
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── products/page.tsx     # Products CRUD
│   │   ├── orders/page.tsx       # Orders management
│   │   ├── landing-pages/        # Landing page builder
│   │   ├── shipping/page.tsx     # Shipping zones
│   │   ├── analytics/page.tsx    # Analytics
│   │   ├── fraud/page.tsx        # Anti-fraud
│   │   └── settings/page.tsx     # Store settings
│   ├── (storefront)/             # Storefront routes
│   │   ├── page.tsx              # Homepage
│   │   ├── product/[slug]/       # Product page + checkout
│   │   ├── l/[slug]/             # Landing pages
│   │   └── thank-you/[order]/    # Order confirmation
│   ├── api/trpc/[trpc]/          # tRPC API handler
│   ├── login/page.tsx            # Auth page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── src/
│   ├── server/
│   │   ├── db/                   # Drizzle ORM + PostgreSQL
│   │   │   ├── schema.ts         # Full database schema
│   │   │   └── connection.ts     # Database connection
│   │   ├── trpc/
│   │   │   ├── router.ts         # Main tRPC router
│   │   │   ├── context.ts        # Request context
│   │   │   ├── middleware.ts     # Auth middleware
│   │   │   └── routers/          # All tRPC routers
│   │   └── lib/
│   │       └── supabase.ts       # Supabase clients
│   └── client/
│       ├── components/ui/        # shadcn/ui components
│       ├── providers/            # React providers
│       ├── hooks/                # Custom hooks
│       └── lib/                  # Client utilities
├── migration.sql                 # Full database migration
├── .env.example                  # Environment variables template
├── drizzle.config.ts             # Drizzle configuration
├── next.config.ts                # Next.js configuration
└── tailwind.config.ts            # Tailwind configuration
```

### Key Architectural Decisions
1. **Next.js App Router** — SSR/ISR support, SEO-first architecture
2. **tRPC** — Type-safe API with end-to-end type inference
3. **Drizzle ORM** — Type-safe SQL with PostgreSQL
4. **Supabase** — Auth, database, storage in one platform
5. **No cart system** — Direct COD funnel for Algeria market
6. **Embedded checkout** — Checkout integrated into product/landing pages
7. **White-label ready** — All settings configurable from dashboard

### Troubleshooting

**Build errors**: Check that all dependencies are installed:
```bash
npm install
```

**Database connection errors**: Verify `DATABASE_URL` format:
```
postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

**Auth not working**: Verify Supabase URL and anon key are correct

**tRPC errors**: Check that the tRPC handler route is properly configured at `/app/api/trpc/[trpc]/route.ts`
