# Operações

## Rotinas principais
- **Build:** `npm run build` (Vite + Nitro).
- **Qualidade:** `npm run check` (lint + format:check) e `npm test` (Vitest).
- **Banco:** `npm run db:push` (dev) ou `npm run db:migrate` (com migration); sempre seguido de `npm run db:generate`.
- **Docs de API:** habilitar com `ENABLE_API_DOCS=on|auth` antes de acessar `/docs` ou `/docs/openapi.json`.
- **Cron:** `/api/subscriptions/cron` executa job de assinaturas; apenas Vercel Scheduler com header `x-vercel-cron`.

## Ambientes e variáveis
- Arquivo `.env.example` lista todas as variáveis (DB, Better Auth, criptografia de cartões, flag de docs).
- Banco padrão é Postgres/Neon via `VITE_DATABASE_URL`.

## Observabilidade / logs (MVP)
- Logs padrão de server functions. Sem stack de observabilidade dedicada ainda.
- Recomenda-se adicionar: logger estruturado, tracing e alarmes de cron no futuro.

## Referências
- Health checks: `./health.md`
- Arquitetura: `../architecture/README.md`
- API: `../api/README.md`
