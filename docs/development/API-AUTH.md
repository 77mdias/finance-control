# Contrato de API: Autenticação

## Resumo

A autenticação é implementada usando **Better Auth** com adapter Prisma e provider de email/senha. Todos os endpoints são expostos automaticamente através do handler catch-all em `/api/auth/*`.

**Características:**
- Sessões com cookies httpOnly (7 dias de validade)
- Proteção CSRF integrada
- Campos customizados: `currency` e `timezone`
- Validação de senha (mínimo 8 caracteres)

---

## Endpoints Better Auth (automáticos)

### POST /api/auth/sign-up

Registro de novo usuário.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "SenhaSegura123!",
  "currency": "BRL",        // opcional
  "timezone": "America/Sao_Paulo"  // opcional
}
```

**Responses:**

✅ **201 Created** - Usuário criado com sucesso
```json
{
  "user": {
    "id": "clxxx...",
    "name": "João Silva",
    "email": "joao@example.com",
    "currency": "BRL",
    "timezone": "America/Sao_Paulo",
    "emailVerified": false,
    "image": null,
    "createdAt": "2025-12-17T...",
    "updatedAt": "2025-12-17T..."
  },
  "session": {
    "token": "xxx",
    "expiresAt": "2025-12-24T..."
  }
}
```

**Cookie Set:** `finance-control-session` (httpOnly, secure em produção, SameSite=lax)

❌ **400 Bad Request** - Validação falhou
```json
{
  "error": "Email already exists",
  "code": "EMAIL_ALREADY_EXISTS"
}
```

❌ **400 Bad Request** - Senha muito curta
```json
{
  "error": "Password must be at least 8 characters",
  "code": "PASSWORD_TOO_SHORT"
}
```

---

### POST /api/auth/sign-in

Login de usuário existente.

**Request Body:**
```json
{
  "email": "joao@example.com",
  "password": "SenhaSegura123!"
}
```

**Responses:**

✅ **200 OK** - Login bem-sucedido (mesma estrutura do sign-up)

❌ **401 Unauthorized** - Credenciais inválidas
```json
{
  "error": "Invalid credentials",
  "code": "INVALID_CREDENTIALS"
}
```

---

### POST /api/auth/sign-out

Logout (revoga sessão).

**Headers:**
```
Cookie: finance-control-session=xxx
```

**Responses:**

✅ **200 OK** - Logout bem-sucedido
```json
{
  "success": true
}
```

**Cookie Clear:** Remove `finance-control-session`

❌ **401 Unauthorized** - Sessão inválida

---

### GET /api/auth/session

Verifica sessão atual.

**Headers:**
```
Cookie: finance-control-session=xxx
```

**Responses:**

✅ **200 OK** - Sessão válida
```json
{
  "session": {
    "token": "xxx",
    "expiresAt": "2025-12-24T...",
    "user": {
      "id": "clxxx...",
      "name": "João Silva",
      "email": "joao@example.com",
      "currency": "BRL",
      "timezone": "America/Sao_Paulo"
    }
  }
}
```

❌ **401 Unauthorized** - Sem sessão ou expirada
```json
{
  "session": null
}
```

---

## Proteção CSRF

Better Auth implementa proteção CSRF internamente usando:
- **Double-submit cookie pattern**
- **Validação de origin header**
- **Token CSRF** em requests modificadores (POST/PUT/DELETE)

**Não é necessário implementação adicional** para MVP.

---

## Códigos de erro padrão

| Código | Descrição |
|--------|-----------|
| `200` | OK - Operação bem-sucedida |
| `201` | Created - Recurso criado |
| `400` | Bad Request - Validação falhou |
| `401` | Unauthorized - Sem autenticação ou credenciais inválidas |
| `403` | Forbidden - Autenticado mas sem permissão |
| `409` | Conflict - Email já existe |
| `500` | Internal Server Error |

---

## Cookies

**Nome:** `finance-control-session`

**Atributos:**
- `httpOnly: true` - Não acessível via JavaScript (segurança XSS)
- `secure: true` - Apenas HTTPS (produção)
- `sameSite: 'lax'` - Proteção CSRF
- `path: '/'` - Válido para todo o site
- `maxAge: 604800` - 7 dias (em segundos)

**Exemplo de Set-Cookie:**
```
Set-Cookie: finance-control-session=xyz; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800
```

---

## Uso em Server Functions

### Validar sessão (opcional)

```typescript
import { getSession } from '@/lib/session'
import { createServerFn } from '@tanstack/react-start'

const myFunction = createServerFn({ method: 'GET' })
  .handler(async ({ request }) => {
    const session = await getSession(request)
    if (session) {
      return { message: `Hello ${session.user.name}` }
    }
    return { message: 'Hello guest' }
  })
```

### Requerer autenticação

```typescript
import { requireUser } from '@/lib/session'
import { createServerFn } from '@tanstack/react-start'

const protectedFunction = createServerFn({ method: 'GET' })
  .handler(async ({ request }) => {
    const user = await requireUser(request)
    // user está autenticado garantido
    return { message: `Hello ${user.name}` }
  })
```

### Obter usuário atual

```typescript
import { getCurrentUser } from '@/lib/session'

const user = await getCurrentUser(request)
if (!user) {
  // Usuário não autenticado
}
```

---

## Uso no Frontend (React)

### Hook useSession

```typescript
import { useSession } from '@/lib/auth-client'

function MyComponent() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <div>Carregando...</div>
  }

  if (!session) {
    return <div>Você precisa fazer login</div>
  }

  return <div>Olá, {session.user.name}!</div>
}
```

### Sign Up

```typescript
import { signUp } from '@/lib/auth-client'

async function handleSignUp(name: string, email: string, password: string) {
  try {
    const result = await signUp.email({
      name,
      email,
      password,
      currency: 'BRL',
      timezone: 'America/Sao_Paulo',
    })

    if (result.data) {
      // Sucesso
      router.navigate({ to: '/dashboard' })
    }
  } catch (error) {
    // Erro
    console.error(error)
  }
}
```

### Sign In

```typescript
import { signIn } from '@/lib/auth-client'

async function handleSignIn(email: string, password: string) {
  try {
    const result = await signIn.email({
      email,
      password,
    })

    if (result.data) {
      router.navigate({ to: '/dashboard' })
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}
```

### Sign Out

```typescript
import { signOut } from '@/lib/auth-client'

async function handleSignOut() {
  await signOut()
  router.navigate({ to: '/login' })
}
```

---

## Proteção de Rotas

### Com loader (Server-side)

```typescript
import { requireUser } from '@/lib/session'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  loader: async ({ request }) => {
    // Redireciona se não autenticado
    const user = await requireUser(request)
    return { user }
  },
})

function Dashboard() {
  const { user } = Route.useLoaderData()
  return <div>Bem-vindo, {user.name}!</div>
}
```

### Com hook (Client-side)

```typescript
import { useSession } from '@/lib/auth-client'
import { Navigate } from '@tanstack/react-router'

function ProtectedPage() {
  const { data: session, isPending } = useSession()

  if (isPending) return <div>Carregando...</div>

  if (!session) {
    return <Navigate to="/login" />
  }

  return <div>Conteúdo protegido</div>
}
```

---

## Credenciais de Teste (Desenvolvimento)

Após executar `npm run db:seed`, você pode usar:

**Email:** `test@example.com`
**Senha:** `Test123!`

---

## Variáveis de Ambiente

Configurar em `.env.local`:

```bash
# Database
VITE_DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Better Auth
BETTER_AUTH_SECRET=<random-secret-min-32-chars>
BETTER_AUTH_URL=http://localhost:3000
```

**Gerar secret:**
```bash
openssl rand -base64 32
```

---

## Segurança

✅ **Implementado:**
- Cookies httpOnly (proteção XSS)
- CSRF protection (Better Auth)
- Hashing de senhas (bcrypt)
- Validação de senha (mínimo 8 caracteres)
- SameSite cookies (proteção CSRF adicional)
- Secure cookies em produção (HTTPS only)

⚠️ **Pendente (futuro):**
- Verificação de email
- 2FA (autenticação de dois fatores)
- Rate limiting
- Rotação de secrets
- Password reset flow

---

## Troubleshooting

### Erro: "BETTER_AUTH_SECRET is not defined"

Adicione ao `.env.local`:
```bash
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
```

### Erro: "Session not found"

Verifique:
1. Cookie está sendo enviado (`finance-control-session`)
2. Sessão não expirou (7 dias de validade)
3. Secret não mudou (invalida todas as sessões)

### Erro: "VITE_DATABASE_URL is not set"

Configure a URL do banco em `.env.local`:
```bash
VITE_DATABASE_URL=postgresql://...
```

---

## Referências

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth Prisma Adapter](https://www.better-auth.com/docs/adapters/prisma)
- Schema Prisma: `prisma/schema.prisma`
- Configuração auth: `src/lib/auth.ts`
- Helpers de sessão: `src/lib/session.ts`
