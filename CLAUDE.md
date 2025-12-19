# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma / Language

**IMPORTANTE:** Sempre responda em português brasileiro. O desenvolvedor deste projeto prefere comunicação em PT-BR.

## Project Overview

A finance control application built with TanStack Start (React SSR framework), Prisma, PostgreSQL (Neon), and Better Auth. The stack emphasizes file-based routing, type-safe data fetching with TanStack Query and Router, and modern React patterns.

## Development Commands

### Running the application
```bash
npm run dev          # Start dev server on port 3000
npm run build        # Build for production
npm run preview      # Preview production build
```

### Database operations
All database commands use `.env` for configuration via dotenv-cli:

```bash
npm run db:generate  # Generate Prisma client (output: src/generated/prisma)
npm run db:push      # Push schema changes to database
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio GUI
npm run db:seed      # Seed the database
```

**Important:** Database URL is read from `VITE_DATABASE_URL` in `.env`.

### Testing and code quality
```bash
npm test             # Run Vitest tests
npm run lint         # Lint with ESLint (caches results)
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check formatting without modifying
npm run check        # Run both format:check and lint
```

### Task management
```bash
npm run archive-task # Archive completed subtasks (see docs/development/TASKS/)
```

## Architecture

### Tech Stack
- **Frontend:** React 19, TanStack Start (SSR), TanStack Router (file-based), TanStack Query
- **Styling:** Tailwind CSS v4, Shadcn components (use `pnpm dlx shadcn@latest add <component>`)
- **Backend/DB:** Prisma (PostgreSQL via Neon serverless), Better Auth
- **Build:** Vite with Nitro server, custom Neon plugin
- **Testing:** Vitest with jsdom

### Directory Structure
```
src/
├── routes/          # File-based routing (TanStack Router)
│   ├── __root.tsx   # Root layout with Header, devtools
│   ├── index.tsx    # Home page
│   ├── demo/        # Demo pages (can be deleted)
│   └── api/         # API endpoints (e.g., auth/[...].ts)
├── components/      # React components
├── lib/             # Core utilities
│   ├── auth.ts      # Better Auth server instance
│   ├── auth-client.ts # Better Auth client
│   └── utils.ts     # Shared utilities (e.g., cn for className merging)
├── integrations/    # Third-party integrations
│   └── tanstack-query/ # TanStack Query setup (provider, devtools)
├── db.ts            # Neon database client (lazy initialized)
├── router.tsx       # Router creation with SSR-Query integration
└── generated/       # Generated code (Prisma client)

prisma/
├── schema.prisma    # Database schema (output: src/generated/prisma)
└── seed.ts          # Database seeding logic

docs/development/    # Development documentation and task tracking
├── TASKS/           # Active tasks and templates
│   ├── TEMPLATE.task.md   # Template for individual tasks
│   └── SUBTASKS/          # Task breakdown
└── README.md        # Process documentation
```

### Key Patterns

**Routing:** TanStack Router uses file-based routing. Files in `src/routes/` automatically become routes. The router is configured in `src/router.tsx` and integrated with TanStack Query for SSR data loading.

**Database Access:**
- Prisma client is generated to `src/generated/prisma` (non-standard location)
- For Neon serverless: Use `src/db.ts` which exports `getClient()` returning a Neon SQL client
- For Prisma: Import from `src/generated/prisma`
- Database URL: `VITE_DATABASE_URL` from `.env`

**Authentication:**

Better Auth is configured with Prisma adapter and email/password provider:
- **Endpoints:** `/api/auth/*` (sign-up, sign-in, sign-out, session)
- **Session:** httpOnly cookie (`finance-control-session`), 7-day expiry
- **CSRF:** Built-in protection via Better Auth
- **Custom fields:** `currency`, `timezone` for finance domain
- **Server config:** `src/lib/auth.ts`
- **Client hooks:** `src/lib/auth-client.ts` exports `useSession`, `signIn`, `signUp`, `signOut`
- **Session helpers:** `src/lib/session.ts` provides `requireUser()`, `getSession()` for Server Functions

**Test credentials (dev):** `test@example.com` / `Test123!` (after `npm run db:seed`)

**Server Function auth example:**
```typescript
import { requireUser } from '@/lib/session'
import { createServerFn } from '@tanstack/react-start'

const protectedFn = createServerFn({ method: 'GET' })
  .handler(async ({ request }) => {
    const user = await requireUser(request)
    // user is authenticated
    return { message: `Hello ${user.name}` }
  })
```

**Frontend auth example:**
```typescript
import { useSession, signIn } from '@/lib/auth-client'

function MyComponent() {
  const { data: session } = useSession()

  const handleLogin = async () => {
    await signIn.email({ email, password })
  }

  return session ? <div>Hello {session.user.name}</div> : <LoginForm />
}
```

**API documentation:** See `docs/development/API-AUTH.md` for complete API reference.

**Data Fetching:**
- TanStack Router loaders for route-level data loading
- TanStack Query for client-side queries and mutations
- SSR integration via `setupRouterSsrQueryIntegration` in router.tsx

**Styling:**
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- `src/lib/utils.ts` provides `cn()` helper for conditional class merging
- Follows Shadcn component patterns

**Environment Variables:** Use `VITE_` prefix for client-accessible vars (Vite convention). Database and auth URLs should be in `.env`.

### Path Aliases
- `@/*` maps to `src/*` (configured in tsconfig.json and vite-tsconfig-paths plugin)

### Demo Files
Files prefixed with `demo` (in `src/routes/demo/`) can be safely deleted. They demonstrate:
- API routes (api.names.ts, api.tq-todos.ts, api.mcp-todos.ts)
- SSR modes (ssr.full-ssr.tsx, ssr.spa-mode.tsx)
- TanStack Query patterns (tanstack-query.tsx)
- Prisma usage (prisma.tsx)
- Neon integration (neon.tsx)
- MCP server patterns (mcp-todos.tsx)

## Task Management System

This project uses a structured task tracking system in `docs/development/TASKS/`:
- Tasks use format: `[AREA-ID]` (e.g., BKD-001 for backend, FE-001 for frontend)
- Templates in `TEMPLATE.task.md` with checklist, priority (🔴🟡🟢), estimate, dependencies
- Archive completed subtasks with `npm run archive-task`
- See `docs/development/README.md` for full conventions

## Code Quality Standards

**TypeScript:** Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.

**Linting:** Uses `@tanstack/eslint-config` with Prettier integration. ESLint cache is enabled. Config is in flat format (eslint.config.js).

**Testing:** Vitest with React Testing Library. Environment: jsdom.

## Common Development Tasks

**Adding a new route:** Create a file in `src/routes/`. TanStack Router auto-generates route config.

**Adding Shadcn components:** `pnpm dlx shadcn@latest add <component-name>`

**Database schema changes:**
1. Edit `prisma/schema.prisma`
2. Run `npm run db:push` (dev) or `npm run db:migrate` (production)
3. Run `npm run db:generate` to update Prisma client

**Setting up Neon database:** On first `npm run dev`, the Neon Vite plugin creates a claimable database (expires in 72 hours). Claim it via Neon Launchpad.

## Important Notes

- **Prisma output location:** Custom path `src/generated/prisma` (not default `node_modules/.prisma/client`)
- **Environment files:** Use `.env` for local development with dotenv-cli
- **Demo cleanup:** Remove `src/routes/demo/` when starting real development
- **TanStack Devtools:** Integrated in `__root.tsx` combining Router, Query, and React devtools
