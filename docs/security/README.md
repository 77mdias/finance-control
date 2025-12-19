# Segurança

## Sessões e autenticação
- Better Auth com sessão httpOnly (`finance-control-session`), validade de 7 dias. `requireUser` aplicado em Server Functions.
- CSRF protegido pelo Better Auth (double-submit + validação de origin). Não há necessidade de token adicional no MVP.
- `ENABLE_API_DOCS=auth` força login para acessar `/docs` e `/docs/openapi.json`.

## Dados sensíveis
- Cartões armazenados criptografados (AES-256-GCM); apenas `lastDigits` retornados. Chave via `CARD_ENCRYPTION_KEY` (32 bytes, aceita plain/hex/base64).
- Credenciais/URLs devem ficar em `.env` (uso de prefixo `VITE_` apenas para variáveis client-side).
- Não registrar números de cartão ou segredos em logs.

## Acesso e rotas
- Rotas file-based em `src/routes/`; handlers sensíveis estão em `src/server/**`. Não expor server functions sem `requireUser` quando envolver dados do usuário.
- Rota de cron `/api/subscriptions/cron` aceita apenas chamadas com header `x-vercel-cron`.

## Dependências e supply chain
- Use **npm** (não misturar com yarn/pnpm) para manter `package-lock.json` consistente.
- Rodar `npm run check` e `npm test` antes de abrir PR.

## Hardening recomendado (próximos passos)
- Adicionar endpoint de health com verificação de DB + dependências externas.
- Revisar CORS se expor APIs públicas; hoje consumo é interno (SSR/Server Functions).
- Log de auditoria para mutações financeiras.

## Referências
- API: `../api/README.md`
- Docs de auth: `../development/API-AUTH.md`
- Docs OpenAPI: `../development/API-DOCS.md`
