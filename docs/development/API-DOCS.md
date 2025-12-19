# Documentação de API (OpenAPI / Dev)

## Visão geral

- Spec **OpenAPI 3.1** gerada manualmente a partir dos contratos do backend (Auth, Transactions, Cards, Subscriptions).
- Endpoints publicados apenas para desenvolvimento: `GET /docs/openapi.json` (JSON) e UI Swagger em `GET /docs`.
- Habilitação via flag `ENABLE_API_DOCS` para evitar exposição acidental em produção.

## Como habilitar

`ENABLE_API_DOCS` aceita três modos:

- vazio/`off`: rotas de docs respondem 404 (default).
- `on`: docs liberadas sem autenticação (uso local).
- `auth`: docs habilitadas **exigindo sessão Better Auth** (cookie `finance-control-session`).

Configuração recomendada para uso local:

```bash
ENABLE_API_DOCS=on npm run dev
# ou defina no .env e reinicie o servidor
```

## Rotas de documentação

- `GET /docs/openapi.json` — spec OpenAPI 3.1 (no-cache). `servers[0].url` usa o `origin` da requisição.
- `GET /docs` — Swagger UI carregado via CDN (`swagger-ui-dist`). Usa a spec acima como fonte.
- Cabeçalho `X-Docs-Mode` indica o modo atual (`on` ou `auth`).

## Endpoints cobertos na spec

- **Auth:** `/api/auth/sign-up`, `/api/auth/sign-in`, `/api/auth/sign-out`, `/api/auth/session`
- **Transactions:** `/api/transactions` (GET/POST), `/api/transactions/{id}` (PUT/DELETE) com filtros, paginação e `balanceDelta`
- **Cards:** `/api/cards` (GET/POST) e `/api/cards/{id}` (PUT) — apenas `lastDigits` expostos
- **Subscriptions:** `/api/subscriptions` (GET/POST) e `/api/subscriptions/{id}` (PUT)

Segurança padrão: esquema `sessionCookie` (`apiKey` em cookie `finance-control-session`). Operações públicas de auth anulam o requisito de cookie no nível da operação.

## Dicas rápidas

- Use `ENABLE_API_DOCS=auth` em ambientes compartilhados para forçar login antes de ver a UI/JSON.
- Se consumir a spec via `curl` no modo `auth`, envie o cookie da sessão Better Auth:

```bash
curl -H "Cookie: finance-control-session=<token>" http://localhost:3000/docs/openapi.json
```

## Referências

- Contratos detalhados de autenticação: `docs/development/API-AUTH.md`
- Status da fase e tarefas: `docs/development/TASKS/PHASE-1-MVP.md`
