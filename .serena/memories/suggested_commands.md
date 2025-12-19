# Suggested Commands
## App lifecycle
- npm run dev           # start dev server (Vite, port 3000)
- npm run build         # production build
- npm run preview       # preview production build

## Tests and quality
- npm test              # Vitest run
- npm run lint          # ESLint (cached)
- npm run lint:fix      # ESLint with autofix
- npm run format        # Prettier write
- npm run format:check  # Prettier check
- npm run check         # format:check + lint

## Database (Prisma + .env)
- npm run db:generate   # generate Prisma client (src/generated/prisma)
- npm run db:push       # push schema changes
- npm run db:migrate    # create + run migrations
- npm run db:studio     # Prisma Studio UI
- npm run db:seed       # seed data

## Tasks
- npm run archive-task  # archive completed subtasks in docs/development/TASKS

## UI components
- pnpm dlx shadcn@latest add <component>

## Useful system commands (Linux)
- ls, pwd, cd, cat, rg, find, git status, git diff, git log --oneline
