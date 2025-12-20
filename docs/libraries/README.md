# Bibliotecas e Dependências-chave

## Core da aplicação

- **TanStack Start / Router / Query:** SSR + roteamento file-based e cache de dados. Devtools removidos no build.
- **React 19 + Vite/Nitro:** bundle SSR/CSR; Nitro gera `.output` para deploy node-server.
- **Prisma 7:** ORM para Postgres/Neon, client gerado em `src/generated/prisma`. Usar `npm run db:generate` após mudanças no schema.
- **Better Auth:** Autenticação por email/senha, sessões httpOnly. Config em `src/lib/auth.ts`; helpers em `src/lib/session.ts`.
- **Tailwind CSS v4 + Shadcn:** utilitários de estilo; adicionar componentes via `pnpm dlx shadcn@latest add <component>`.
- **Zod:** validação de payloads (server functions).

## Qualidade e ferramentas

- **ESLint (`@tanstack/eslint-config`)** + **Prettier**: `npm run check` (format:check + lint).
- **Vitest + Testing Library:** testes unitários/integrados (`npm test`).
- **dotenv-cli:** carrega `.env` para scripts Prisma.

## Integrações/Infra

- **@neondatabase/serverless & vite-plugin-postgres:** suporte a Postgres serverless no dev.
- **@tanstack/router-plugin**: geração automática de `src/routeTree.gen.ts` (não editar manualmente).

## Regras de uso rápido

- Sempre usar imports com alias `@/`.
- Não editar código gerado (`src/routeTree.gen.ts`, `src/generated/prisma/**`); regenere com scripts.
- Preferir Server Functions com `requireUser` para endpoints protegidos.
- Rodar `npm run db:push`/`db:migrate` e `npm run db:generate` ao alterar `prisma/schema.prisma`.

## Referências

- Arquitetura: `../architecture/README.md`
- API: `../api/README.md`
- Segurança: `../security/README.md`
