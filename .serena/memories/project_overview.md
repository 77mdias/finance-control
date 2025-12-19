# Project Overview
- Purpose: finance control web app.
- Stack: TypeScript, React 19, TanStack Start (SSR) + TanStack Router (file-based) + TanStack Query; Vite/Nitro build.
- Styling: Tailwind CSS v4, Shadcn components.
- Backend/data: Prisma with PostgreSQL (Neon serverless) and Better Auth for authentication.
- Routing: routes live under src/routes with __root.tsx as the layout.
- Data: Prisma client output is custom at src/generated/prisma; DB URL comes from VITE_DATABASE_URL in .env.
