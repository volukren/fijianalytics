# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the tracker script and Next.js application
- `npm start` - Start the production server
- `npm run lint` - Run Biome linter checks
- `npm run format` - Format code with Biome

### Database
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma studio` - Open Prisma Studio

## Architecture

This is a Next.js 15 application with the following key architectural patterns:

### App Router Structure
Uses Next.js App Router with route groups for organization:

#### Route Groups
- `(auth)/` - Authentication pages
  - `/login` - User login page
  - Shared layout for auth pages

- `(public)/` - Public pages
  - `/` - Landing page (home)
  - Public layout wrapper

- `(private)/` - Protected pages (requires authentication)
  - `/organizations` - Organizations list
  - `/organizations/new` - Create new organization
  - `/organizations/[id]` - Organization detail page
  - `/organizations/[id]/new-website` - Add website to organization
  - `/websites/[domain]` - Website analytics dashboard
  - Protected layout with sidebar navigation

- `(onboarding)/` - User onboarding flow
  - `/onboarding` - Onboarding start page
  - `/onboarding/create-organization` - Create first organization
  - Onboarding-specific layout

#### API Routes
- `/api/auth/[...all]` - Better-auth authentication endpoints
- `/api/track` - Analytics tracking endpoint for script.js

#### Layout Hierarchy
- Root layout (`src/app/layout.tsx`) - Global providers and configuration
  - Route group layouts - Specific UI wrappers per section
    - Page components - Individual route content

#### Middleware Protection
- Authentication middleware protects `(private)` routes
- Redirects unauthenticated users to `/login`
- Handles organization context and permissions

### Authentication
- Uses `better-auth` library with Prisma adapter
- Google OAuth provider configured
- Middleware protection on `/account` and `/app` routes
- Server-side auth configuration in `src/lib/auth/server.ts`

### Database
- PostgreSQL database with Prisma ORM
- Schema includes User, Session, Account, and Verification models
- Uses `snake_case` for database column names with `@map` directives
- Prisma client singleton pattern in `src/lib/prisma.ts`

### UI Components
- Uses shadcn/ui components with Radix UI primitives
- Tailwind CSS v4 for styling
- Component aliases configured: `@/components`, `@/lib`, `@/components/ui`
- New York style variant with neutral base color
- When importing icons from `lucide-react`, always use the variant with `Icon` suffix (e.g., use `UserIcon` instead of `User`, `ChevronDownIcon` instead of `ChevronDown`)

### Custom Build Process
The project includes a custom build step (`build.js`) that:
- Builds a browser tracking script from `src/tracker/` using esbuild
- Outputs minified IIFE bundle to `public/script.js`
- Must run before Next.js build

### Tracking System
- Custom analytics tracking script in `src/tracker/`
- Collects referrer, URL, and user agent data
- Debounced API calls to `/api/track` endpoint
- Built as standalone browser script

### Code Quality
- Biome for linting and formatting (configured for Next.js and React)
- TypeScript with strict mode enabled
- Path aliases using `@/*` for `./src/*`

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `BETTER_AUTH_SECRET` - Secret key for better-auth encryption
- `RESEND_API_KEY` - Resend email service API key
