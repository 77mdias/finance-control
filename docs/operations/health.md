# Health & Readiness (MVP)

## Status atual

- Não há endpoint dedicado de health/readiness. Use as verificações abaixo até que um endpoint seja adicionado.

## Checks recomendados

- **Build:** `npm run build` — garante bundling de client/SSR/Nitro.
- **Qualidade:** `npm run check` e `npm test` — validam lint/format e suites de teste (auth helpers, transações, cartões, assinaturas).
- **Banco:** `npm run db:push -- --dry-run` para validar conectividade e migrations em dev (ou `npm run db:generate` para checar schema).
- **Cron:** disparar manualmente `curl -H "x-vercel-cron: 1" http://localhost:3000/api/subscriptions/cron` em ambiente de dev para confirmar execução do job (usar banco isolado).

## Requisitos de ambiente

- `.env` com `VITE_DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CARD_ENCRYPTION_KEY`, e `ENABLE_API_DOCS` opcional.
- Banco Postgres acessível; Prisma client gerado (`npm run db:generate`).

## Futuro (recomendação)

- Criar endpoint `/health` com:
  - ping de DB (consulta leve)
  - verificação de variáveis obrigatórias
  - status do job scheduler (última execução)
- Integrar monitoramento/alerta para falhas do cron de assinaturas.
