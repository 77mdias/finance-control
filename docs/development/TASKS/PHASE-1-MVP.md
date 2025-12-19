# ✅ Tasks - Fase 1: MVP Básico (PHASE-1)

**Status:** 🟡 EM ANDAMENTO
**Tipo:** Documento de trabalho (MVP inicial)

**Última atualização:** 2025-12-19
**Sprint/Fase:** Fase 1 - Foundation / Auth + Core Finance

---

## 📊 Resumo de Progresso

| Categoria |  Total | Concluído | Parcial | Pendente | Bloqueado |
| --------- | -----: | --------: | ------: | -------: | --------: |
| Backend   |      6 |         3 |       0 |        3 |         0 |
| Frontend  |      6 |         0 |       0 |        6 |         0 |
| DevOps    |      3 |         1 |       0 |        2 |         0 |
| Testes    |      4 |         0 |       0 |        4 |         0 |
| **TOTAL** | **19** |     **4** |   **0** |   **15** |     **0** |

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
  - **Arquivos:** `src/routes/transactions.server.ts`, `src/routes/transactions.*`
  - **Contratos (BKD-003.a):** Server Functions RESTful (`GET/POST/PUT/DELETE /transactions`) com validação via Zod. Filtros `month/year/type/category/cardId/subscriptionId`, paginação `page/perPage (<=50)`, ordenação `date desc`. DTO inclui `id, type, value (number), description, category, date ISO, cardId, subscriptionId, createdAt, updatedAt`. Respostas de mutação trazem `balanceDelta` (CREDIT = +value, DEBIT = -value; updates retornam delta entre antes/depois; delete retorna inverso do impacto original). Erros: `VALIDATION_ERROR`, `UNAUTHORIZED`, `TRANSACTION_NOT_FOUND`, `FORBIDDEN`, `FOREIGN_RELATION_INVALID`.
  - **Entrega:** Server Functions (`list/create/update/deleteTransaction`) em `src/routes/transactions.server.ts` com validação e ownership; rota `/transactions` usando loader + QueryClient cache em `src/routes/transactions.tsx`. Testes unitários + integração (`tests/unit/transactions.server.test.ts`, `tests/integration/transactions.e2e.test.ts`) executados no CI (`.github/workflows/ci.yml`).

- [ ] **BKD-004** - Cartões lógicos (armazenamento criptografado)
  - [ ] Implementar criptografia AES para `encryptedNumber` (chave via env var)
  - [ ] Expor somente `lastDigits` nas responses; nunca enviar número completo ao cliente
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 3h
  - **Dependências:** BKD-002
  - **Arquivos:** `src/lib/crypto.*`, `src/routes/cards.server.ts`

- [ ] **BKD-005** - Assinaturas (geração de transações recorrentes)
  - [ ] Model + job simples que gera transações por assinatura (cron diário mínimo) — job pode rodar em server-side cron ou em worker separado
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 4h
  - **Dependências:** BKD-002, BKD-003
  - **Arquivos:** `src/jobs/subscriptions.*`, `src/routes/subscriptions.server.ts`

- [ ] **BKD-006** - OpenAPI / Docs (dev)
  - [ ] Publicar `GET /docs/openapi.json` e UI dev (auth opt-in). Observação: Server Functions podem não gerar spec automaticamente — documentar contratos ou gerar spec manualmente (Swagger/OpenAPI) para endpoints principais.
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 2h
  - **Dependências:** BKD-001

## 🎨 FRONTEND (TanStack Router + React Query)

- [ ] **FE-001** - Layout mínimo + rotas: signin, signup, dashboard
  - [ ] Páginas: `/signin`, `/signup`, `/`(dashboard)
  - [ ] Usar TanStack Router loaders para pré-carregar dados e QueryClient para cache
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 4h
  - **Dependências:** BKD-001
  - **Arquivos:** `src/routes/*`, `src/components/Header.tsx`

- [ ] **FE-002** - Forms de autenticação (register/login)
  - [ ] Validações básicas, mensagens de erro amigáveis
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

- [ ] **FE-006** - State de autenticação + integração com cookies
  - [ ] Implementar auth state via loaders/hooks que usam cookies httpOnly; se usar JWT cookie, não será necessário Authorization header para requests via fetch/Server Functions
  - [ ] Opcional: interceptor para fetch requests que precisem de header CSRF; implementar fallback de refresh (server-side) se necessário
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 3h
  - **Dependências:** BKD-001

- [ ] **FE-007** - Configurar QueryClient + Providers
  - [ ] Adicionar `QueryClientProvider` e `ReactQueryDevtools`; integrar com TanStack Router loaders
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
- Documentação do API em `BKD-006` deve ser habilitável via flag `ENABLE_API_DOCS`.

---

## Como usar este arquivo

- Copie tasks do template `TEMPLATE.task.md` quando forem necessárias subtasks mais detalhadas.
- Ao finalizar cada task, marcar como `[x]` e atualizar o resumo no topo.
- Quando a fase for arquivada, mover para `docs/references/` e marcar data de conclusão.
