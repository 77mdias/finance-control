# Arquitetura (Visão Geral)

## Stack resumida
- **Frontend/SSR:** TanStack Start (React 19) + TanStack Router (file-based) + TanStack Query.
- **Build/Runtime:** Vite + Nitro (node-server) com plugin Neon para Postgres serverless.
- **Backend:** Server Functions (createServerFn) para endpoints protegidos por sessão Better Auth.
- **Persistência:** Prisma (client gerado em `src/generated/prisma`) sobre Postgres/Neon.
- **Estilo:** Tailwind CSS v4 + componentes Shadcn (quando adicionados).
- **Tests/Qualidade:** Vitest (unit/integration), ESLint (`@tanstack/eslint-config`), Prettier.

## Domínios e módulos
- **Auth:** Better Auth configurado em `src/lib/auth.ts`; sessão httpOnly (cookie `finance-control-session`); helpers em `src/lib/session.ts`.
- **Finanças:** Server Functions para transações (`src/server/transactions.server.ts`), cartões (`src/server/cards.server.ts`) e assinaturas (`src/server/subscriptions.server.ts`).
- **Jobs:** Geração mensal de transações de assinaturas (`src/jobs/subscriptions.ts`), acionada por cron Vercel (`/api/subscriptions/cron`).
- **Roteamento:** Arquivos em `src/routes/` são rotas. Geração automática em `src/routeTree.gen.ts` (não editar).
- **Infra de dados:** `src/db.ts` centraliza Prisma/Neon; adaptado para SSR e browser stub em `src/db.browser.ts`.

## Fluxos principais
- **Autenticação:** `/api/auth/*` (Better Auth) cria/valida sessão via cookie. `requireUser()` é aplicado em server functions.
- **Transações:** Server Functions CRUD validam filtros/payloads com Zod, checam ownership e retornam `balanceDelta` para UI.
- **Cartões:** Números criptografados (AES-256-GCM); apenas `lastDigits` são expostos.
- **Assinaturas:** CRUD + job mensal idempotente; exige cartão do usuário quando associado.
- **Docs de API:** OpenAPI 3.1 exposta em `/docs/openapi.json` (flag `ENABLE_API_DOCS`) e UI Swagger em `/docs`.

## Build e deploy (dev)
1. `npm run check` (lint + format:check).
2. `npm test` (Vitest).
3. `npm run build` (Vite + Nitro).
4. Database: `npm run db:generate` e `npm run db:push` quando alterar `prisma/schema.prisma`.

## Referências cruzadas
- Processos de development: `../development/README.md`
- Tasks da fase atual: `../development/TASKS/PHASE-1-MVP.md`
- Contratos de Auth: `../development/API-AUTH.md`
- Contrato geral de API: `../development/API-DOCS.md`
