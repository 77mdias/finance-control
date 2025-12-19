# Changelog (Development)

Este changelog registra mudanças em **processos, templates e documentação de development** (não é o changelog de releases do produto).

O formato é inspirado em _Keep a Changelog_.

## [Unreleased]

- (adicione aqui mudanças ainda não consolidadas)

## [2025-12-19]

### Added

- Migration `20251219155736_bkd_002_models` com criação de enums (`TransactionType`, `CardType`) e tabelas Card/Subscription/Transaction.
- Seed Prisma atualizado com usuário demo (`test@example.com` / `Test123!`), cartão, assinatura e transações iniciais.

### Changed

- `prisma/schema.prisma` alinhado ao Better Auth (User/Account/Session/Verification) e ao domínio financeiro (valores em Decimal, relacionamentos com card/subscription).

## [2025-12-17]

### Added

- `docs/development/README.md` com visão geral e convenções.
- `docs/development/TASKS/README.md` com regras de organização das tasks.
- Templates iniciais:
  - `docs/development/TASKS/TEMPLATE.task.md`
  - `docs/development/TASKS/TEMPLATE.phase.md`

### Changed

- 2025-12-17: `docs/development/TASKS/PHASE-1-MVP.md` criado e atualizado para TanStack Start.
- 2025-12-17: `BKD-001` e `BKD-003` quebrados em subtasks detalhadas (auth as Server Functions, transactions server functions, loaders, CSRF, session utils, tests).

### Scripts

- 2025-12-17: `scripts/archive-subtask.js` adicionado para automatizar arquivamento de subtasks; `docs/development/TASKS/ARCHIVED/` criado.
