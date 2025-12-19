# API (Visão Geral)

## Endpoints e contratos
- **Auth (Better Auth):** `/api/auth/sign-up`, `/api/auth/sign-in`, `/api/auth/sign-out`, `/api/auth/session`. Payloads e respostas em `../development/API-AUTH.md`.
- **Transações:** `/api/transactions` (GET/POST) e `/api/transactions/{id}` (PUT/DELETE) com filtros por mês/ano, categoria, tipo, cartão e assinatura. Retorna `balanceDelta`.
- **Cartões:** `/api/cards` (GET/POST) e `/api/cards/{id}` (PUT). Apenas `lastDigits` expostos.
- **Assinaturas:** `/api/subscriptions` (GET/POST) e `/api/subscriptions/{id}` (PUT).
- **Cron:** `/api/subscriptions/cron` (Vercel Scheduler) — exige header `x-vercel-cron`.

## Documentação (OpenAPI/Swagger)
- **Spec JSON:** `GET /docs/openapi.json`
- **UI Swagger:** `GET /docs`
- **Flag:** `ENABLE_API_DOCS` controla exposição (`off` padrão, `on` abre sem auth, `auth` exige sessão Better Auth). Cabeçalho `X-Docs-Mode` indica o modo ativo.
- Detalhes e instruções: `../development/API-DOCS.md`

## Autenticação e segurança
- Sessão via cookie httpOnly `finance-control-session` (Better Auth). Server Functions usam `requireUser`/`requireSession`.
- CSRF: proteção fornecida pelo Better Auth.
- Cartões: números criptografados (AES-256-GCM); nunca retornados em responses.

## Versionamento e ambientes
- **Base URL (dev):** `http://localhost:3000`
- **Banco:** `VITE_DATABASE_URL` (Prisma/Neon).
- **Variáveis necessárias:** ver `.env.example` (inclui `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CARD_ENCRYPTION_KEY`, `ENABLE_API_DOCS`).

## Testes e garantia
- `npm test` cobre unit/integration de auth helpers, transações, cartões e assinaturas.
- CI roda lint + test + build (`.github/workflows/ci.yml`).

## Referências
- Auth detalhado: `../development/API-AUTH.md`
- Docs OpenAPI/Swagger: `../development/API-DOCS.md`
- Fase/Tasks: `../development/TASKS/PHASE-1-MVP.md`
