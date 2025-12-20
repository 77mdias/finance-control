# ✅ Tasks - Fase 1: MVP Básico (PHASE-1)

**Status:** 🟡 EM ANDAMENTO
**Tipo:** Documento de trabalho (MVP inicial)

**Última atualização:** 2025-12-20
**Sprint/Fase:** Fase 1 - Foundation / Auth + Core Finance

---

## 📊 Resumo de Progresso

| Categoria |  Total | Concluído | Parcial | Pendente | Bloqueado |
| --------- | -----: | --------: | ------: | -------: | --------: |
| Backend   |      6 |         6 |       0 |        0 |         0 |
| Frontend  |      7 |         3 |       1 |        3 |         0 |
| DevOps    |      3 |         1 |       0 |        2 |         0 |
| Testes    |      4 |         0 |       0 |        4 |         0 |
| **TOTAL** | **20** |    **10** |   **1** |    **9** |     **0** |

### 🎯 Principais objetivos

- Entregar MVP mínimo com autenticação local via Server Functions e CRUD básico de transações
- Integrar frontend usando TanStack Router loaders + React Query (QueryClient)
- Expor contrato de API (dev docs) e ambiente de dev com Postgres/Neon (neon-vite-plugin)
- Garantir testes básicos e regras mínimas de segurança (cookies httpOnly, AES para cartões)

---

## 🔴 BACKEND (TanStack Start / Server Functions)

- [x] **BKD-001** - Autenticação com Better Auth ✅ **CONCLUÍDO**
  - **Subtasks:**
    - [x] **BKD-001.a** - Design do contrato de auth (payloads, cookies, CSRF, erros) ✅
    - [x] **BKD-001.b** - Implementar auth (via Better Auth endpoints) ✅
    - [x] **BKD-001.c** - Configurar Better Auth com Prisma adapter ✅
    - [x] **BKD-001.d** - Implementar session helpers (`src/lib/session.ts`) ✅
    - [x] **BKD-001.e** - CSRF protection (via Better Auth built-in) ✅
    - [x] **BKD-001.f** - Testes unitários para session helpers ✅
    - [x] **BKD-001.g** - Documentar contrato de API (`docs/development/API-AUTH.md`) ✅
    - [x] **BKD-001.h** - Atualizar CLAUDE.md com guia de auth ✅
    - [x] **BKD-001.i** - Integrar Better Auth (adapter Prisma) ✅
      - [x] Adicionar dependências `better-auth`
      - [x] Criar `src/lib/auth.ts` e `src/lib/auth-client.ts` e handler `/api/auth/[...].ts`
      - [x] Atualizar `prisma/schema.prisma` com modelos de auth (User, Session, Account, VerificationToken)
      - [x] Gerar Prisma client com novos modelos
      - [x] Configurar Vitest e criar testes unitários (14 testes passando)
  - **Prioridade:** 🔴 Crítica
  - **Estimativa (total):** 11.5h | **Real:** ~12h
  - **Dependências:** nenhum
  - **Arquivos implementados:** `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/session.ts`, `src/routes/api/auth/[...].ts`, `src/db.ts`, `prisma/schema.prisma`, `vitest.config.ts`, `tests/unit/session.test.ts`, `docs/development/API-AUTH.md`
  - **Notas:** Implementação usando Better Auth diretamente (endpoints prontos). Testes de integração pendentes (requerem banco configurado). Seed pendente (requer `.env.local` com DATABASE_URL).

- [x] **BKD-002** - Models Prisma: User, Transaction, Card, Subscription
  - [x] Atualizar `prisma/schema.prisma` com modelos básicos descritos no `PRD.md`
  - [x] Gerar migration e seeds mínimos (usar `prisma migrate dev` / seed automático no Neon dev)
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 3h | **Real:** ~2h
  - **Dependências:** BKD-001
  - **Arquivos:** `prisma/schema.prisma`, `prisma/migrations/20251219155736_bkd_002_models/migration.sql`, `prisma/seed.ts`, `src/generated/prisma/*`
  - **Notas:** Modelos reais adicionados (User/Account/Session/Verification + Card/Subscription/Transaction com enums `TransactionType` e `CardType`, valores em `Decimal(12,2)`, relacionamentos com card/subscription). Migration gerada via `prisma migrate diff --from-empty` (pode exigir recriar schema ao aplicar). Seed cria usuário `test@example.com`/`Test123!`, cartão demo, assinatura e transações base.

- [x] **BKD-003** - CRUD Transações (Server Functions)
  - **Subtasks:**
    - [x] **BKD-003.a** - Design dos endpoints e contratos (list, create, update, delete, filtros) — 1h
    - [x] **BKD-003.b** - Implementar `GET /transactions` loader/serverFn com filtros por mês/ano — 2h
    - [x] **BKD-003.c** - Implementar `POST /transactions` (validações + criação) — 1.5h
    - [x] **BKD-003.d** - Implementar `PUT /transactions/:id` e `DELETE /transactions/:id` — 1.5h
    - [x] **BKD-003.e** - Integrar loaders ao TanStack Router e cache com QueryClient — 1h
    - [x] **BKD-003.f** - Testes de integração E2E para CRUD (end-to-end) — 3h
  - **Prioridade:** 🔴 Crítica
  - **Estimativa (total):** 10h
  - **Dependências:** BKD-002, BKD-001 (auth)
  - **Arquivos:** `src/server/transactions.server.ts`, `src/routes/transactions.*`
  - **Contratos (BKD-003.a):** Server Functions RESTful (`GET/POST/PUT/DELETE /transactions`) com validação via Zod. Filtros `month/year/type/category/cardId/subscriptionId`, paginação `page/perPage (<=50)`, ordenação `date desc`. DTO inclui `id, type, value (number), description, category, date ISO, cardId, subscriptionId, createdAt, updatedAt`. Respostas de mutação trazem `balanceDelta` (CREDIT = +value, DEBIT = -value; updates retornam delta entre antes/depois; delete retorna inverso do impacto original). Erros: `VALIDATION_ERROR`, `UNAUTHORIZED`, `TRANSACTION_NOT_FOUND`, `FORBIDDEN`, `FOREIGN_RELATION_INVALID`.
  - **Entrega:** Server Functions (`list/create/update/deleteTransaction`) em `src/server/transactions.server.ts` com validação e ownership; rota `/transactions` usando loader + QueryClient cache em `src/routes/transactions.tsx`. Testes unitários + integração (`tests/unit/transactions.server.test.ts`, `tests/integration/transactions.e2e.test.ts`) executados no CI (`.github/workflows/ci.yml`).

- [x] **BKD-004** - Cartões lógicos (armazenamento criptografado)
  - [x] Implementar criptografia AES para `encryptedNumber` (chave via env var)
  - [x] Expor somente `lastDigits` nas responses; nunca enviar número completo ao cliente
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 3h
  - **Dependências:** BKD-002
  - **Arquivos:** `src/lib/crypto.ts`, `src/server/cards.server.ts`, `tests/unit/cards.server.test.ts`
  - **Notas:** AES-256-GCM com IV aleatório; chave via `CARD_ENCRYPTION_KEY` suportando plain/hex/base64. Apenas `lastDigits` expostos, número completo nunca sai do backend.

- [x] **BKD-005** - Assinaturas (geração de transações recorrentes)
  - [x] Job idempotente por mês que gera débitos de assinaturas ativas (usa timezone do usuário e evita duplicar se já existir cobrança no mês)
  - [x] Server Functions para criar/listar/atualizar assinaturas com validação de cartão do usuário
  - [x] Testes unitários cobrindo job e contratos (`tests/unit/subscriptions.server.test.ts`)
  - [x] Agendamento Vercel via `vercel.json` (`0 6 * * *` chamando `/api/subscriptions/cron`, protegido por header `x-vercel-cron`)
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 4h
  - **Dependências:** BKD-002, BKD-003
  - **Arquivos:** `src/jobs/subscriptions.ts`, `src/server/subscriptions.server.ts`, `tests/unit/subscriptions.server.test.ts`

- [x] **BKD-006** - OpenAPI / Docs (dev)
  - [x] Publicar `GET /docs/openapi.json` e UI dev (auth opt-in) com Swagger UI. Spec manual cobre Auth, Transactions, Cards e Subscriptions.
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 2h | **Real:** ~2h
  - **Dependências:** BKD-001
  - **Arquivos:** `src/lib/openapi.ts`, `src/routes/docs.ts`, `src/routes/docs/$file.ts`, `.env.example`, `docs/development/API-DOCS.md`
  - **Notas:** Flag `ENABLE_API_DOCS` com modos `on` (livre em dev) e `auth` (exige sessão Better Auth). UI acessível em `/docs` e JSON em `/docs/openapi.json` (sem cache).

## 🎨 FRONTEND (TanStack Router + React Query)

- [x] **FE-001** - Layout mínimo + rotas: signin, signup, dashboard ✅ **CONCLUÍDO**
  - [x] Páginas: `/signin`, `/signup`
  - [x] Página: `/` (dashboard)
  - [x] Layout auth responsivo (mobile-first) + esconder Header nas rotas de auth
  - [x] Usar TanStack Router loaders para pré-carregar dados do dashboard
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 4h
  - **Dependências:** BKD-001
  - **Arquivos:** `src/routes/*`, `src/components/Header.tsx`

- [x] **FE-002** - Forms de autenticação (register/login) ✅ **CONCLUÍDO**
  - [x] Validações básicas, mensagens de erro amigáveis
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 3h
  - **Dependências:** FE-001

- [ ] **FE-003** - Dashboard básico (saldo, ganhos, gastos)
  - [ ] Mostrar resumo mensal e lista de transações recentes
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 6h
  - **Dependências:** BKD-003, FE-001

- [ ] **FE-004** - CRUD transações (UI) e integração com API
  - [ ] Form para criar/editar transações, confirmação de exclusão
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 6h
  - **Dependências:** BKD-003, FE-003

- [ ] **FE-005** - Gerenciar cartões (apenas lastDigits na UI)
  - [ ] Interface para adicionar/remover cartões (nunca mostrar número completo)
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 3h
  - **Dependências:** BKD-004

- [ ] **FE-006** - State de autenticação + integração com cookies 🟡 **PARCIAL**
  - [x] Auth state via hook `useSession()` (cookies httpOnly)
  - [x] Redirect client-side para `/` em `/signin` e `/signup` quando autenticado
  - [ ] Opcional: interceptor/infra de CSRF + refresh server-side se necessário
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 3h
  - **Dependências:** BKD-001

- [x] **FE-007** - Configurar QueryClient + Providers ✅ **CONCLUÍDO**
  - [x] Adicionar `QueryClientProvider` e `ReactQueryDevtools`; integrar com TanStack Router (contexto do router)
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 2h
  - **Dependências:** FE-001

## ⚙️ DEVOPS

- [ ] **DEVOPS-001** - Ambiente de desenvolvimento com Postgres (Neon opcional)
  - [ ] `docker-compose.dev.yml` **ou** usar o `neon-vite-plugin` (já presente no repositório) para dev rápido; documentar ambas as opções em `README.dev.md`
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 2h
  - **Dependências:** BKD-002

- [ ] **DEVOPS-002** - Variáveis de ambiente e secrets mínimos
  - [ ] `JWT_SECRET`, `DATABASE_URL`, `NODE_ENV` documentados em `.env.example`
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 30 min
  - **Dependências:** DEVOPS-001

- [x] **DEVOPS-003** - CI básico (lint + test)
  - [x] Workflow que roda `npm run lint`, `npm test` e `npm run build` em PRs e main (`.github/workflows/ci.yml`, Node 20)
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 2h | **Real:** ~1h
  - **Dependências:** nenhum
  - **Notas:** Inclui envs mínimos para build/test (`VITE_DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`). Ajustar para Neon/produção conforme necessário.

## 🧪 TESTES

- [ ] **TEST-001** - Testes unitários AuthService (backend)
  - [ ] Cobertura dos fluxos register/login/logout (casos felizes e falhas)
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 3h
  - **Dependências:** BKD-001

- [ ] **TEST-002** - Testes de integração Transactions CRUD
  - [ ] End-to-end simples cobrindo criação → leitura → atualização → deleção
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 4h
  - **Dependências:** BKD-003

- [ ] **TEST-003** - Testes de segurança básicos
  - [ ] Verificar que números de cartão não são expostos e que auth protege endpoints
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 2h
  - **Dependências:** BKD-001, BKD-004

- [ ] **TEST-004** - Smoke tests frontend (fluxo register → login → dashboard)
  - [ ] Cypress ou testes de integração leves com intercepts
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 3h
  - **Dependências:** FE-001, FE-002, FE-003

---

## 📌 Notas e decisões iniciais

- Escopo intencionalmente reduzido: foco em autenticação, transações e usuário único.
- Implementação auth com Server Functions + cookies httpOnly (mais seguro para full-stack TanStack Start).
- Para dados sensíveis (cartões) usar AES com chave derivada por env var; rotacionar futuramente com Vault.
- `neon-vite-plugin` é recomendado para dev rápido; `docker-compose` documentado como alternativa.
- Documentação do API publicada em `/docs` (Swagger UI) e `/docs/openapi.json`, controlada pela flag `ENABLE_API_DOCS` (`on` ou `auth`).

---

## Como usar este arquivo

- Copie tasks do template `TEMPLATE.task.md` quando forem necessárias subtasks mais detalhadas.
- Ao finalizar cada task, marcar como `[x]` e atualizar o resumo no topo.
- Quando a fase for arquivada, mover para `docs/references/` e marcar data de conclusão.
