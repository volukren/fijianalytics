# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the tracker script and Next.js application (runs `node build.js && next build`)
- `npm start` - Start the production server
- `npm run lint` - Run Biome linter checks
- `npm run format` - Format code with Biome

### Database
- `npx prisma generate` - Generate Prisma client (outputs to `src/generated/client`)
- `npx prisma db push` - Push schema changes to PostgreSQL database
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma studio` - Open Prisma Studio

### Docker Development
- `docker-compose up -d` - Start PostgreSQL (port 5433) and ClickHouse (port 8123) databases
- `docker-compose down` - Stop all services
- `docker-compose logs clickhouse` - View ClickHouse logs
- `docker-compose exec clickhouse clickhouse-client` - Access ClickHouse CLI

### ClickHouse Migrations
- Migration scripts located in `clickhouse-migrations/` directory
- Run automatically via Docker Compose on container startup
- Manual execution: `docker-compose run clickhouse-migrations`
- Migration creates:
  - `events` table with MergeTree engine
  - Monthly partitioning on `timestamp` column
  - Bloom filter indexes on `session_id` and `site_id`
  - Primary key ordering by `(timestamp, event_id)`

## Architecture

This is a privacy-focused web analytics platform built with Next.js 15, using a dual-database architecture for optimal performance.

### Dual Database Architecture
- **PostgreSQL** - Primary application data (users, organizations, websites)
  - Accessed via Prisma ORM with custom output path (`src/generated/client`)
  - Runs on port 5433 in Docker development
  - Migrations via Prisma CLI (`npx prisma migrate dev`)

- **ClickHouse** - High-performance analytics data storage and querying
  - Events table partitioned by month for optimal performance
  - Accessed via `@clickhouse/client` library
  - MergeTree engine with timestamp-based ordering
  - Bloom filter indexes on `session_id` and `site_id` for fast lookups
  - Custom migration system in `clickhouse-migrations/` directory
  - Runs on port 8123 (HTTP) and 9000 (native protocol)

### App Router Structure
Uses Next.js App Router with route groups for organization:

#### Route Groups
- `(auth)/` - Authentication pages
  - `/login` - User login with OAuth and magic links

- `(public)/` - Public pages
  - `/` - Landing page with ClickHouse connection test
  - `/goodbye` - Account deletion confirmation

- `(private)/` - Protected pages (requires authentication)
  - `/account` - User account management
  - `/dashboard` - Main dashboard
  - `/dashboard/new-website` - Add new website
  - `/settings` - Application settings
  - `/websites` - List all websites
  - `/websites/[domain]` - Website analytics dashboard

- `(onboarding)/` - User onboarding flow
  - `/onboarding` - Create first organization

#### API Routes
- `/api/auth/[...all]` - Better-auth authentication endpoints
- `/api/track` - Analytics event ingestion endpoint (writes to ClickHouse)

### Authentication & Authorization
- Uses `better-auth` library with Prisma adapter
- **Multi-provider support**: Google OAuth, GitHub OAuth, Magic Links (via Resend)
- **Organization-based multi-tenancy** with member roles
- **Session enhancement** with `activeOrganizationId` tracking
- Middleware protection on private routes with organization membership validation
- Server-side auth configuration in `src/lib/auth/server.ts`
- Account deletion with email verification and organization cleanup

### Multi-tenancy Model
- **Organizations** - Top-level tenant containers
- **Members** - Users linked to organizations with roles
- **Websites** - Analytics properties owned by organizations
- **Invitations** - Pending member invitations with email verification
- Default organization assignment on user creation

### Analytics Tracking System
#### Browser Tracking Script (`src/tracker/`)
- Built as standalone IIFE bundle to `public/script.js`
- SPA-aware tracking (intercepts `pushState`/`replaceState`)
- Debounced API calls (300ms) to prevent request spam
- Collects: referrer, URL, user agent, session data

#### ClickHouse Integration (`src/lib/clickhouse.ts`)
- **Buffered Insert Pattern** - Events are buffered in-memory before batch insertion
  - Buffer size: 5000 events (configurable)
  - Auto-flush interval: 10 seconds (configurable)
  - Immediate flush when buffer size reached
  - Error recovery: failed batches are prepended back to buffer
- **Connection Management** - Singleton service with persistent client connection
- **Event Schema** - Stores `event_id`, `timestamp`, `session_id`, `pathname`, `screen_width`, `screen_height`, `event_type`, `referrer`, `language`, `site_id`
- **JSONEachRow Format** - Efficient row-by-row JSON format for inserts and queries
- **Query Interface** - Parameterized queries with automatic type safety

### UI Components
- Uses shadcn/ui components with Radix UI primitives
- Tailwind CSS v4 for styling
- Component aliases: `@/components`, `@/lib`, `@/components/ui`
- New York style variant with neutral base color
- Sonner for toast notifications
- When importing icons from `lucide-react`, always use the variant with `Icon` suffix (e.g., `UserIcon`, `ChevronDownIcon`)

### Build Process
The project uses a two-step build process (`build.js`):
1. **Tracker Script Build** - esbuild compiles `src/tracker/` to minified IIFE bundle
2. **Next.js Build** - Standard Next.js application build

### Code Quality
- **Biome** for linting and formatting (NOT ESLint/Prettier)
- TypeScript with strict mode
- Path aliases using `@/*` for `./src/*`
- Git VCS integration for ignore files

### Git Commit Guidelines
- **Use single-line commit messages only** - No multi-line commit messages
- Keep commit messages concise and descriptive
- Follow conventional commit format (e.g., `feat:`, `fix:`, `docs:`, `refactor:`)

## Environment Variables Required

### Application
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret key for better-auth encryption

### OAuth Providers
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret

### Email Service
- `RESEND_API_KEY` - Resend API key for magic links and notifications

### ClickHouse Analytics
- `CLICKHOUSE_HOST` - ClickHouse server URL (default: http://localhost:8123)
- `CLICKHOUSE_DB` - ClickHouse database name (default: fiji)
- `CLICKHOUSE_USER` - ClickHouse username (default: user)
- `CLICKHOUSE_PASSWORD` - ClickHouse password

### Docker Development (optional)
- `POSTGRES_PORT` - PostgreSQL port (default: 5433)
- `POSTGRES_DB` - PostgreSQL database name
- `POSTGRES_USER` - PostgreSQL username
- `POSTGRES_PASSWORD` - PostgreSQL password
