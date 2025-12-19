# Repository Guidelines

> **Como usar:** copie este modelo para `AGENTS.md` (ou `backend/AGENTS.md`, `frontend/AGENTS.md`, etc.), substitua os espaços `{{ }}` com informações reais e mantenha a ordem das seções. This ensures every stack guide follows the same structure.

**Descrição curta:** Guia rápido para agentes e contribuidores do framework full-stack finance-control (TanStack Start + Prisma + Neon + Better Auth).  
**Docs detalhados:** [CLAUDE.md](./CLAUDE.md)

---

## 📚 Stack-Specific Guides (opcional)

> Lista outros guias relevantes ou "N/A" se este já for o guia específico.

- N/A (este é o guia principal do repositório)

---

## 🚨 Critical Rules - READ FIRST

> Liste no mínimo 5 regras essenciais. Use subtítulos enumerados com blocos ❌/✅ para comparação.

### 1. Arquivos gerados (rotas e Prisma)
```bash
❌ NEVER: editar src/routeTree.gen.ts ou src/generated/prisma/**
✅ ALWAYS: edite src/routes/ ou prisma/schema.prisma e regenere com npm run db:generate
```

### 2. Secrets e banco de dados
```bash
❌ NEVER: commitar ou hardcode a string de conexao
✅ ALWAYS: usar .env com VITE_DATABASE_URL
```

### 3. Rotas file-based
```typescript
❌ NEVER: registrar rotas manualmente em arrays
✅ ALWAYS: criar arquivos em src/routes/ (ex.: src/routes/relatorios.tsx)
```

### 4. Mudancas no schema Prisma
```bash
❌ NEVER: alterar prisma/schema.prisma sem gerar client
✅ ALWAYS: npm run db:generate + npm run db:push (dev) ou npm run db:migrate
```

### 5. Auth e sessoes (codigo sensivel)
```typescript
❌ NEVER: alterar fluxos de auth sem atualizar docs e testes
✅ ALWAYS: revisar src/lib/auth.ts, src/lib/auth-client.ts, src/lib/session.ts e docs/development/API-AUTH.md
```

### 6. Qualidade antes de PR
```bash
❌ NEVER: abrir PR sem validar lint/format/testes
✅ ALWAYS: npm run check && npm test e citar resultados no PR
```

### 7. Imports consistentes
```typescript
❌ NEVER: usar caminhos longos com ../../../
✅ ALWAYS: usar alias @/ (ex.: import { cn } from '@/lib/utils')
```

### 8. Tasks e docs de processo
```bash
❌ NEVER: editar docs/references/ (arquivados) ou ignorar TASKS
✅ ALWAYS: usar templates em docs/development/TASKS/ e arquivar com npm run archive-task
```

### 9. Dependencias e lockfile
```bash
❌ NEVER: misturar package managers e quebrar o package-lock.json
✅ ALWAYS: usar npm para installs/scripts (pnpm apenas para shadcn)
```

---

## 📁 Project / Stack Structure

> Descreva o layout principal com um bloco de codigo `tree` comentado.

```
finance-control/
|-- src/
|   |-- routes/           # rotas file-based (TanStack Router)
|   |-- components/       # UI reutilizavel
|   |-- lib/              # auth, utils, helpers
|   |-- integrations/     # integracoes (ex.: tanstack-query)
|   |-- generated/prisma/ # Prisma client (gerado)
|   |-- data/             # dados de demo/fixtures (pode ser removido)
|   |-- utils/            # utilitarios compartilhados
|   |-- db.ts             # cliente Neon (serverless)
|   |-- router.tsx        # configuracao TanStack Router/SSR
|   `-- routeTree.gen.ts  # gerado pelo TanStack Router
|-- prisma/               # schema e seed
|-- tests/                # unit/ e integration/ + setup.ts
|-- docs/development/     # processos, tasks e changelog
|-- docs/references/      # documentos arquivados (somente leitura)
|-- public/               # assets estaticos
`-- scripts/              # utilitarios (ex.: archive-subtask)
```

- **Padroes de organizacao:** rotas file-based + pastas por responsabilidade (components/lib/integrations).
- **Arquivos sensiveis:** `.env`, `prisma/schema.prisma`, `docs/development/TASKS/`, `src/lib/auth.ts`.

---

## 🧭 Architecture Overview

- **Framework:** TanStack Start (SSR) com Vite/Nitro; entrada do router em `src/router.tsx`.
- **Routing:** file-based em `src/routes/`, layout principal em `src/routes/__root.tsx`.
- **Data:** loaders do TanStack Router e TanStack Query (provider em `src/integrations/tanstack-query/`).
- **Auth:** Better Auth em `src/lib/auth.ts`; client hooks em `src/lib/auth-client.ts`; sessoes em `src/lib/session.ts`.
- **DB:** Neon serverless em `src/db.ts`; Prisma schema em `prisma/schema.prisma`; client gerado em `src/generated/prisma/`.
- **Styling:** Tailwind CSS v4, globals em `src/styles.css`, componentes Shadcn em `src/components/`.

---

## ⚡ Essential Commands

> Separe por contexto (Development, Database, Testing, etc.). Inclua make targets ou npm scripts.

### Development
```bash
npm run dev       # porta 3000
npm run build
npm run preview
```

### Database / Tooling
```bash
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:studio
npm run db:seed
npm run post-cta-init   # cria banco inicial via create-db@latest
npm run archive-task
pnpm dlx shadcn@latest add <component>
```

### Testing / Quality
```bash
npm test
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run check
```

---

## 🔐 Configuration & Environment

- **.env local:** use `.env` para configuracoes; variaveis client-side devem ter prefixo `VITE_`.
- **DB URL:** `VITE_DATABASE_URL` e usado por Prisma/Neon; nao hardcode em codigo.
- **Config files chave:** `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, `prettier.config.js`, `prisma.config.ts`, `neon-vite-plugin.ts`, `components.json`, `tsconfig.json`.
- **Neon claimable DB:** ao rodar `npm run dev`, o plugin pode criar um banco temporario (expira em ~72h).

---

## 🧩 Demo Artifacts

- Arquivos e pastas `src/routes/demo/` e `src/data/demo.*` sao exemplos; podem ser removidos ao iniciar features reais.
- `src/mcp-todos.ts` e `src/utils/mcp-handler.ts` sao demos de MCP; mantenha apenas se forem relevantes.

---

## 📝 Coding Standards

### Naming
- **Services:** `AuthService`, `TransactionService`
- **Components/Controllers:** `TransactionForm`, `DashboardHeader`
- **DTOs/Interfaces:** `CreateTransactionInput`, `UserSettings`

### Formatting
- Indentacao: 2 spaces
- Quotes: single
- Semicolons: none
- Lint/format command: `npm run format`
- ESLint: `@tanstack/eslint-config` em `eslint.config.js`

### Style Guides (opcional)
- TanStack Start patterns + Tailwind utility-first + Shadcn conventions.

### Conventions
- Use `@/` para imports do `src/`.
- Prefira Server Functions com `createServerFn` e proteja com `requireUser` quando necessario.
- Se alterar auth/DB, atualize docs tecnicas relevantes.
- Testes devem seguir `*.test.ts` ou `*.test.tsx` em `tests/unit` ou `tests/integration`.
- Use `cn()` de `src/lib/utils.ts` para composicao de classes Tailwind.
- TypeScript em modo strict; evite `any` e parametros nao usados.

---

## 🧪 Testing Rules

### Backend / TanStack Start + Prisma
- **Locais dos testes:** `tests/unit/`, `tests/integration/`
- **Ferramentas:** Vitest + Testing Library, ambiente `jsdom`
- **Setup:** `tests/setup.ts` carregado via `vitest.config.ts`
- **Cobertura alvo:** sem meta formal; cubra fluxos alterados e regressao critica
- **Execucao:** `npm test` roda `vitest run` (nao watch)

### Frontend / React
- **Locais dos testes:** `tests/unit/`, `tests/integration/`
- **Ferramentas:** Vitest + Testing Library
- **Cobertura alvo:** sem meta formal; priorize componentes e fluxos novos

### Mandatory Commands Before Push
```bash
npm run check
npm test
```

---

## 📋 Commit & PR Guidelines

### Commit Format
```
<type>(<scope>): <subject> (TASK-ID opcional)
```

- **Tipos validos:** feat, fix, docs, style, refactor, test, chore
- **Regras:** subject imperativo, <= 72 chars, sem ponto final; PT-BR ok; referencie task quando existir

### PR Checklist
1. **Titulo:** `[TASK-ID] Resumo` (quando aplicavel)
2. **Testes:** anexar comandos e resultados
3. **Screenshots:** quando houver UI
4. **Env vars / Ports:** documentar mudancas

---

## 🎯 AIDEV Anchors

```typescript
// AIDEV-NOTE: decisoes nao obvias ou trade-offs
// AIDEV-TODO: pendencias que nao cabem neste PR
// AIDEV-QUESTION: duvidas abertas para o time
// AIDEV-CRITICAL: codigo sensivel (auth, DB, pagamentos)
// AIDEV-GOTCHA: armadilhas ou comportamento inesperado
```

- **Antes de alterar modulos criticos:** `rg "AIDEV-" -n src`
- **Quando adicionar:** logica complexa, seguranca, integracoes externas.

---

## 🔄 Workflow & Checklist

1. Revisar `docs/development/TASKS/` e `docs/development/README.md`.
2. Compreender dependencias e migrations necessarias.
3. Implementar seguindo os padroes acima.
4. Adicionar/atualizar `AIDEV-*` anchors quando necessario.
5. Rodar lint/format/testes obrigatorios.
6. Atualizar docs (`docs/development/TASKS/`, `docs/development/CHANGELOG.md`) antes de abrir PR.

### ✅ Pre-push Checklist

- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run db:generate` + `npm run db:push` (quando alterar schema)
- [ ] Docs atualizadas (`docs/development/TASKS/`, `docs/development/CHANGELOG.md`)
- [ ] Se UI mudou, screenshots no PR

---

## 📚 Quick Documentation Lookup (opcional tabela)

| Necessidade | Documento |
| ----------- | --------- |
| Visao geral do stack | `CLAUDE.md` |
| Setup rapido | `README.md` |
| Auth API | `docs/development/API-AUTH.md` |
| Processo de tasks | `docs/development/README.md` |
| Changelog de dev | `docs/development/CHANGELOG.md` |
| PRD do produto | `PRD.md` |

---

> **Nota final (opcional):** o plugin da Neon pode criar um banco "claimable" ao rodar `npm run dev`, que expira em ~72h. Mantenha comunicacao em PT-BR quando possivel.
