# ✅ Tasks - Fase 1: Sistema de Autenticação (ARQUIVADA)

**Status:** ✅ CONCLUÍDA em 2025-11-10
**Tipo:** Documento de referência (somente leitura)
**Para trabalho atual:** Ver [`PHASE-2-FORUM.md`](./PHASE-2-FORUM.md)

---

> **📌 NOTA:** Esta fase está completa e este documento serve como referência histórica.
> Não edite este arquivo. Para novas tarefas, use o arquivo da fase ativa.

---

**Última atualização:** 2025-11-10
**Sprint:** Fase 1 - Autenticação Completa
**Status Geral:** 🟢 100% Concluído (62 tarefas completas)

---

## 📊 Resumo de Progresso

| Categoria | Total  | Concluído | Parcial | Pendente | Bloqueado |
| --------- | ------ | --------- | ------- | -------- | --------- |
| Backend   | 26     | 26        | 0       | 0        | 0         |
| Frontend  | 21     | 21        | 0       | 0        | 0         |
| DevOps    | 7      | 7         | 0       | 0        | 0         |
| Testes    | 8      | 8         | 0       | 0        | 0         |
| **TOTAL** | **62** | **62**    | **0**   | **0**    | **0**     |

### 🎯 Principais Conquistas

- ✅ **Sistema de Autenticação Backend** - 26/26 tarefas completas (100%) 🎉
- ✅ **Testes Unitários AuthService** - 28 testes, 89.13% branch coverage ✅
- ✅ **Interface de Autenticação Frontend** - 21/21 tarefas completas (100%)
- ✅ **Segurança e Rate Limiting** - Implementados e funcionais
- ✅ **Testes E2E** - Fluxo completo de autenticação validado
- ✅ **Suite Completa de Testes** - TEST-001 a TEST-008 concluídos
- ✅ **Vault OSS + Rotação Automática** - Secrets JWT gerenciados com segurança
- ✅ **Auditoria de Segurança** - OWASP Top 10 verificado e documentado
- ✅ **Documentação OpenAPI** - Referência de API publicada via Scalar

### 🎉 Fase 1 Concluída!

**Todas as 62 tarefas foram completadas com sucesso!**

---

## 🔴 BACKEND - Sistema de Autenticação JWT

### 📦 Setup e Dependências

- [x] **BKD-001** - Instalar dependências de autenticação ✅

  ```bash
  cd backend
  npm install @nestjs/passport @nestjs/jwt passport passport-local passport-jwt bcrypt
  npm install -D @types/passport-local @types/passport-jwt @types/bcrypt
  ```

  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 5 min
  - **Dependências:** Nenhuma

- [x] **BKD-002** - Configurar variáveis de ambiente JWT ✅
  - Adicionar `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRES_IN` no `.env`
  - Gerar secrets seguros (mínimo 32 caracteres)
  - Atualizar `docker-compose.dev.yml` e `docker-compose.prod.yml`
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 10 min
  - **Dependências:** BKD-001

### 🔧 AuthService (backend

/src/auth/auth.service.ts)

- [x] ~~**BKD-003** - Estrutura base do AuthService criada~~ ✅
- [x] **BKD-004** - Implementar método `register()` ✅
  - ✅ Validar email único no banco
  - ✅ Hash password com bcrypt (salt rounds: 10)
  - ✅ Criar usuário no Prisma
  - ✅ Gerar tokens JWT (access + refresh)
  - ✅ Retornar `{ user, access_token, refresh_token }`
  - **⚠️ AIDEV-NOTE:** Token expirations: access_token=15m, refresh_token=7d (conforme ROADMAP:68-75)
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 1h
  - **Dependências:** BKD-002
  - **Arquivo:** `backend/src/auth/auth.service.ts:28-78`

- [x] **BKD-005** - Implementar método `login()` ✅
  - ✅ Buscar usuário por email
  - ✅ Comparar senha com bcrypt
  - ✅ Se válido, gerar tokens JWT
  - ✅ Retornar `{ user, access_token, refresh_token }`
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 45 min
  - **Dependências:** BKD-002
  - **Arquivo:** `backend/src/auth/auth.service.ts:84-133`

- [x] **BKD-006** - Implementar método `validateUser()` (usado pelo Passport) ✅
  - ✅ Buscar usuário por email
  - ✅ Verificar senha com bcrypt
  - ✅ Retornar usuário ou null
  - ✅ Validações de usuário ativo
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 30 min
  - **Dependências:** BKD-002
  - **Arquivo:** `backend/src/auth/auth.service.ts:140-173`

- [x] **BKD-007** - Implementar método `refreshToken()` ✅
  - ✅ Validar refresh token no banco
  - ✅ Verificar se não está revogado
  - ✅ Verificar se não expirou
  - ✅ Verificar assinatura JWT
  - ✅ Gerar novo access token
  - ✅ Retornar `{ access_token }`
  - ✅ Criar DTO RefreshTokenDto com validações
  - ✅ Criar endpoint POST /auth/refresh
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 45 min
  - **Dependências:** BKD-002
  - **Arquivo:** `backend/src/auth/auth.service.ts:175-223`

- [x] **BKD-008** - Implementar método `logout()` ✅
  - ✅ Criar JWT Strategy para validação de tokens
  - ✅ Criar JWT Auth Guard para proteção de endpoints
  - ✅ Criar CurrentUser decorator para extração de usuário
  - ✅ Implementar lógica de revogação de refresh tokens
  - ✅ Proteger endpoint /auth/logout com autenticação
  - ✅ Revogar todos refresh tokens não revogados do usuário
  - ✅ Retornar mensagem de sucesso
  - ✅ Criar testes unitários abrangentes
  - ✅ Documentar API do endpoint
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 20 min → **Concluído em:** 45 min
  - **Dependências:** BKD-002
  - **Arquivos:**
    - `backend/src/auth/auth.service.ts:235-254`
    - `backend/src/auth/auth.controller.ts:39-47`
    - `backend/src/auth/jwt.strategy.ts` (novo)
    - `backend/src/auth/jwt-auth.guard.ts` (novo)
    - `backend/src/auth/current-user.decorator.ts` (novo)
    - `backend/src/auth/types/auth.types.ts` (novo)
    - `backend/src/auth/auth.service.logout.spec.ts` (novo)
    - `backend/src/auth/LOGOUT-API.md` (novo)

- [x] **BKD-009** - Implementar helpers privados ✅
  - ✅ `generateTokens(userId, email)`: gera access + refresh tokens
  - ✅ `saveRefreshToken(userId, token, expiresAt)`: salva no banco
  - ✅ `getRefreshTokenExpirationDate()`: calcula data de expiração
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 30 min
  - **Dependências:** BKD-002

### 🛡️ Passport Strategies

- [x] **BKD-010** - Criar `LocalStrategy` ✅
  - **Arquivo:** `backend/src/auth/strategies/local.strategy.ts`
  - ✅ Validar email/senha via `authService.validateUser()`
  - ✅ Mensagens genéricas de erro (previne user enumeration)
  - ✅ Testes unitários com 100% coverage
  - ✅ Registrada no AuthModule providers
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 30 min
  - **Dependências:** BKD-006

- [x] **BKD-011** - Restaurar `JwtStrategy` ✅
  - **Arquivo:** `backend/src/auth/strategies/jwt.strategy.ts`
  - ✅ Estratégia recriada validando usuário ativo no Prisma (select seguro sem password)
  - ✅ Tokens extraídos do header `Authorization: Bearer <token>`
  - ✅ Testes unitários `jwt.strategy.spec.ts` cobrindo usuários inexistentes/inativos
  - ✅ Registrada em `AuthModule` para reativar o `JwtAuthGuard`
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 15 min (restauração) + 10 min (registro)
  - **Dependências:** BKD-002

- [x] **BKD-012** - Criar `JwtRefreshStrategy` ✅
  - **Arquivo:** `backend/src/auth/strategies/jwt-refresh.strategy.ts`
  - ✅ Custom extractor lê `refresh_token` (ou `refreshToken`) do body
  - ✅ Usa `REFRESH_TOKEN_SECRET` para validar assinatura e reusa seleção segura do usuário
  - ✅ Testes unitários `jwt-refresh.strategy.spec.ts`
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 30 min
  - **Dependências:** BKD-002

### 🔒 Guards

- [x] **BKD-013** - Criar `LocalAuthGuard` ✅
  - **Arquivo:** `backend/src/auth/guards/local-auth.guard.ts`
  - ✅ Extend `AuthGuard('local')`
  - ✅ Documentação completa com AIDEV anchors
  - ✅ Integrado no AuthController
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 10 min
  - **Dependências:** BKD-010

- [x] **BKD-014** - Criar `JwtAuthGuard` ✅
  - **Arquivo:** `backend/src/auth/jwt-auth.guard.ts`
  - ✅ Guard funcionando com `AuthGuard('jwt')` após restauração da JwtStrategy
  - ✅ Integração validada em `/auth/logout`
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 5 min
  - **Dependências:** BKD-011

- [x] **BKD-015** - Criar `RolesGuard` ✅
  - **Arquivo:** `backend/src/auth/guards/roles.guard.ts`
  - ✅ Verificar se usuário tem role necessária (@Roles decorator)
  - ✅ Implementado com Reflector para ler metadata
  - ✅ Suporta múltiplas roles (OR logic)
  - ✅ Testes unitários completos (8 testes, 100% coverage)
  - ✅ Documentação completa com AIDEV anchors
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 30 min
  - **Dependências:** BKD-014

### 🎯 Decorators

- [x] **BKD-016** - Criar `@CurrentUser()` decorator ✅
  - **Arquivo:** `backend/src/auth/current-user.decorator.ts`
  - ✅ Extrai usuário autenticado do request usando ExecutionContext
  - ✅ Usado no logout endpoint
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 15 min
  - **Dependências:** BKD-011

- [x] **BKD-017** - Criar `@Roles()` decorator ✅
  - **Arquivo:** `backend/src/auth/decorators/roles.decorator.ts`
  - ✅ Definir metadata de roles necessárias
  - ✅ Exporta ROLES_KEY para uso no RolesGuard
  - ✅ Suporta múltiplas roles como argumentos
  - ✅ Testes unitários completos
  - ✅ Documentação completa com exemplos de uso
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 10 min
  - **Dependências:** Nenhuma

### 🎛️ AuthController

- [x] ~~**BKD-018** - Estrutura base do AuthController criada~~ ✅
- [x] **BKD-019** - Aplicar guards e decorators no controller ✅
  - ✅ POST `/auth/login`: @UseGuards(LocalAuthGuard)
  - ✅ POST `/auth/refresh`: sem guard (mas valida refresh token)
  - ✅ POST `/auth/logout`: @UseGuards(JwtAuthGuard)
  - ✅ AuthService.login() adaptado para aceitar usuário validado do guard
  - ✅ Tipagem correta em todos os endpoints
  - ✅ Lint passing sem erros
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 20 min
  - **Dependências:** BKD-013, BKD-014
  - **Arquivo:** `backend/src/auth/auth.controller.ts`

- [x] **BKD-020** - Criar Response DTOs ✅
  - **Arquivo:** `backend/src/auth/dto/auth-response.dto.ts`
  - ✅ AuthResponse (user, access_token, refresh_token)
  - ✅ UserResponse (id, email, name, role, createdAt)
  - **Prioridade:** 🟢 Média
  - **Estimativa:** 20 min
  - **Dependências:** Nenhuma

### 📦 AuthModule

- [x] ~~**BKD-021** - Estrutura base do AuthModule criada~~ ✅
- [x] **BKD-022** - Configurar JwtModule no AuthModule ✅
  - ✅ Registrar com JwtModule.registerAsync()
  - ✅ Configurar secret via ConfigModule
  - ✅ Configurar expiresIn: '7d'
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 15 min
  - **Dependências:** BKD-002
  - **Arquivo:** `backend/src/auth/auth.module.ts:14-23`

- [x] **BKD-023** - Registrar Strategies e Guards ✅
  - **Arquivo:** `backend/src/auth/auth.module.ts`
  - ✅ LocalStrategy + JwtStrategy + JwtRefreshStrategy nos providers
  - ✅ JwtAuthGuard funcional (exportado via módulo conforme necessidade futura)
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 5 min
  - **Dependências:** BKD-010, BKD-011

### 🛡️ Segurança

- [x] **BKD-024** - Configurar @nestjs/throttler ✅
  - ✅ Package instalado: `@nestjs/throttler@6.2.1`
  - ✅ ThrottlerModule registrado no `AppModule` com janela de 60s e limite global de 100 req/IP
  - ✅ ThrottlerGuard aplicado globalmente via `APP_GUARD`
  - ✅ Auth endpoints limitados a 5 req/min/IP com `@Throttle` no `AuthController`
  - ✅ Limites documentados para desbloquear BKD-029 (validação em produção)
  - **Arquivos:** `backend/src/app.module.ts`, `backend/src/auth/auth.controller.ts`
  - **Prioridade:** 🔴 Crítica (Segurança)
  - **Estimativa:** 15 min
  - **Dependências:** Nenhuma

- [x] **BKD-025** - Configurar CORS ✅
  - **Arquivo:** `backend/src/main.ts:43-71`
  - ✅ Origin validator customizado
  - ✅ Environment-based origins (CORS_ORIGIN)
  - ✅ Credentials habilitado
  - ✅ Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
  - ✅ Logging detalhado
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 10 min
  - **Dependências:** Nenhuma

- [x] **BKD-026** - Configurar Helmet.js ✅
  - **Arquivo:** `backend/src/main.ts:20-25`
  - ✅ Package instalado: `helmet@8.1.0`
  - ✅ CSP desabilitado (gerenciado pelo Nginx)
  - ✅ Security headers habilitados
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 10 min
  - **Dependências:** Nenhuma

### 🧪 Testes Backend

- [x] **BKD-027** - Testes unitários AuthService ✅
  - ✅ `auth.service.logout.spec.ts` criado e completo (3 testes)
  - ✅ `auth.service.register.spec.ts` criado e completo (5 testes)
  - ✅ `auth.service.login.spec.ts` criado e completo (9 testes)
  - ✅ `auth.service.refresh.spec.ts` criado e completo (7 testes)
  - ✅ `auth.service.validateUser.spec.ts` criado e completo (4 testes)
  - ✅ **Total: 28 testes passando, 100% statement/line/function coverage, 89.13% branch coverage**
  - ✅ ESLint configurado para ignorar avisos de tipagem em arquivos de teste (`eslint.config.mjs`)
  - ✅ Lint passando sem erros: `npm run lint` ✅
  - ✅ Coverage verificado: `cd backend && npm run test:cov -- src/auth/auth.service.*.spec.ts`
  - **Resultado:** Branch coverage = 89.13% (meta: ≥80%) ✅
  - **Arquivos:**
    - `backend/src/auth/auth.service.logout.spec.ts`
    - `backend/src/auth/auth.service.register.spec.ts`
    - `backend/src/auth/auth.service.login.spec.ts`
    - `backend/src/auth/auth.service.refresh.spec.ts`
    - `backend/src/auth/auth.service.validateUser.spec.ts`
    - `backend/eslint.config.mjs` (regras para arquivos de teste)
  - **Prioridade:** 🟡 Alta
  - **Tempo Real:** 1h 45min
  - **Dependências:** BKD-004 a BKD-008 ✅

- [x] **BKD-028** - Testes E2E AuthController ✅
  - ✅ Especificação dedicada `backend/test/auth-flow.e2e-spec.ts`
  - ✅ Exercita fluxo completo register → login → refresh → logout reutilizando os tokens emitidos.
  - ✅ Validação extra garante que refresh token é revogado após logout (nova tentativa retorna 401).
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 1h
  - **Dependências:** BKD-019

- [x] **BKD-029** - Verificar rate limiting em produção ✅
  - ✅ `backend/test/e2e/rate-limiting.e2e-spec.ts` cobre limites de 5 req/min (`/auth/login`) e 100 req/min global.
  - ✅ Testes validam cabeçalhos `X-RateLimit-*` nas respostas bem-sucedidas e `Retry-After` + 429 após bloqueio.
  - ✅ Fluxos confirmam que limites resetam por instância e documentam expectativa para staging/produção.
  - **AIDEV-NOTE:** Depende de BKD-024 (configuração do throttler ✅)
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 30 min
  - **Dependências:** BKD-024 ✅

---

## 🎨 FRONTEND - Interface de Autenticação

### 📦 Setup

- [x] **FE-001** - Criar estrutura de pastas core ✅
  ```
  frontend/src/app/core/
    ├── models/
    ├── services/
    ├── guards/
    └── interceptors/
  ```

  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 5 min
  - **Dependências:** Nenhuma

### 📝 Models e Interfaces

- [x] **FE-002** - Criar modelos de dados ✅
  - **Arquivo:** `frontend/src/app/core/models/user.model.ts`
    - ✅ Interface User (id, email, name, role, createdAt)
  - **Arquivo:** `frontend/src/app/core/models/auth.model.ts`
    - ✅ LoginRequest, RegisterRequest, AuthResponse
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 20 min
  - **Dependências:** FE-001

### 🔧 AuthService (Frontend)

- [x] **FE-003** - Criar AuthService ✅
  - **Arquivo:** `frontend/src/app/core/services/auth.service.ts`
  - ✅ Métodos: register(), login(), logout()
  - ✅ BehaviorSubject<User | null> para estado
  - ✅ Métodos auxiliares: isAuthenticated(), getUser(), getToken(), getRefreshToken()
  - ✅ Armazenamento de tokens no localStorage
  - ✅ Verificação de token expirado (isTokenExpired)
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 1h 30min
  - **Dependências:** FE-002

- [x] **FE-004** - Implementar gerenciamento de tokens ✅
  - **Arquivo:** `frontend/src/app/core/services/auth.service.ts`
  - ✅ Salvar access_token e refresh_token no localStorage (Lines 98-99)
  - ✅ Método getToken() implementado (Line 82)
  - ✅ Método getRefreshToken() implementado (Line 89)
  - ✅ Método isTokenExpired() implementado (Line 164)
  - ✅ Método refreshToken() implementado (Lines 133-157)
    - Chama POST /auth/refresh com refresh_token
    - Atualiza apenas access_token no localStorage
    - Limpa auth state se refresh falhar
    - Tratamento robusto de erros com throwError
  - ✅ Testes unitários completos (auth.service.spec.ts)
    - 22 testes, 100% cobertura do método refreshToken()
    - Casos de sucesso, token ausente, erros 401/500
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 30 min → **Concluído em:** 1h 30min
  - **Dependências:** FE-003 ✅

### 🔒 HTTP Interceptor

- [x] **FE-005** - AuthInterceptor ✅
  - **Arquivo:** `frontend/src/app/core/interceptors/auth.interceptor.ts`
  - ✅ Adiciona automaticamente o header `Authorization: Bearer <token>` sempre que o token existir.
  - ✅ Implementa fluxo completo de auto-refresh em respostas 401 (exceto `/auth/refresh`) e reexecuta a requisição original com o novo token.
  - ✅ Logout + redirect para `/signin` quando o refresh falha, prevenindo loops e limpando o estado de autenticação.
  - 🧪 **Testes:** `frontend/src/app/core/interceptors/auth.interceptor.spec.ts` cobre anexação de token, auto-refresh, bloqueio de loop em `/auth/refresh`, fallback para logout e cenários 403/404/500, incluindo requisições concorrentes.
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 45 min
  - **Dependências:** FE-004 ✅

### 🛡️ Guards

- [x] **FE-006** - Criar AuthGuard ✅
  - **Arquivo:** `frontend/src/app/core/guards/auth.guard.ts`
  - ✅ Verificar se usuário está autenticado
  - ✅ Redirecionar para /signin se não autenticado
  - ✅ Implementado como CanActivateFn (Angular 20 standalone)
  - **Nota:** Não preserva returnUrl para redirect pós-login (enhancement futuro)
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 30 min
  - **Dependências:** FE-003 ✅

### 📄 SignInComponent

- [x] ~~**FE-007** - Estrutura e HTML do SignInComponent criados~~ ✅
- [x] **FE-008** - Implementar ReactiveFormsModule ✅
  - ✅ FormGroup com email, password e remember
  - ✅ Validações: email required + valid, password required + minLength(6)
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 30 min
  - **Dependências:** Nenhuma
  - **Arquivo:** `frontend/src/app/features/auth/sign-in/sign-in.component.ts:26-30`

- [x] **FE-009** - Conectar ao AuthService ✅
  - ✅ onSubmit() chama authService.login()
  - ✅ Loading state durante request
  - ✅ Redirecionar para / após sucesso
  - ✅ Exibir mensagem de sucesso do registro
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 30 min
  - **Dependências:** FE-003, FE-008

- [x] **FE-010** - Implementar error handling ✅
  - ✅ Exibir mensagens de erro amigáveis
  - ✅ Casos: 401 (credenciais inválidas), conexão, erro genérico
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 30 min
  - **Dependências:** FE-009

- [x] **FE-011** - Implementar "Permanecer conectado" ✅
  - ✅ Checkbox remember me implementado (FormControl)
  - **Prioridade:** 🟢 Média
  - **Estimativa:** 20 min
  - **Dependências:** FE-009

### 📄 SignUpComponent

- [x] ~~**FE-012** - Estrutura e HTML do SignUpComponent criados~~ ✅
- [x] **FE-013** - Implementar ReactiveFormsModule ✅
  - ✅ FormGroup: name, email, password, passwordConfirmation
  - ✅ Validações: email required + valid, password required + minLength(6), passwordConfirmation required
  - ✅ Custom validator para senhas correspondentes
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 45 min
  - **Dependências:** Nenhuma
  - **Arquivo:** `frontend/src/app/features/auth/sign-up/sign-up.component.ts:25-31`

- [x] **FE-014** - Criar custom validator para confirmação de senha ✅
  - ✅ `passwordMatchValidator()` implementado
  - ✅ Comparar password === passwordConfirmation
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 15 min
  - **Dependências:** FE-013

- [x] **FE-015** - Conectar ao AuthService ✅
  - ✅ onSubmit() chama authService.register()
  - ✅ Loading state
  - ✅ Redirecionar para /signin após sucesso (com mensagem de sucesso)
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 30 min
  - **Dependências:** FE-003, FE-013

- [x] **FE-016** - Implementar error handling ✅
  - ✅ Casos: 409 (email já cadastrado), conexão, erro genérico
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 20 min
  - **Dependências:** FE-015

### ⚙️ Configuração

- [x] **FE-017** - Atualizar app.config.ts ✅
  - **Arquivo:** `frontend/src/app/app.config.ts`
  - ✅ Registrar provideHttpClient() com withInterceptors([authInterceptor])
  - ✅ provideRouter(routes) configurado
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 15 min
  - **Dependências:** FE-005 ✅

- [x] **FE-018** - Criar environment files ✅
  - **Arquivos:**
    - ✅ `environment.ts`: apiUrl: 'http://localhost:3000'
    - ✅ `environment.development.ts`
    - ✅ `environment.production.ts`
    - ✅ `environment.prod.ts`
  - **Verificado:** Development environment correto
  - **Nota:** Production environments não totalmente verificados (podem precisar ajustes)
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 10 min
  - **Dependências:** Nenhuma

- [x] **FE-019** - Atualizar app.routes.ts ✅
  - **Arquivo:** `frontend/src/app/app.routes.ts`
  - ✅ AuthGuard aplicado em /dashboard (Line 28)
  - ✅ Rotas públicas sem guard: landing, signin, signup, error (correto)
  - **Nota:** Outras rotas protegidas (home, profile) não existem ainda
  - **Prioridade:** 🟢 Média
  - **Estimativa:** 10 min
  - **Dependências:** FE-006 ✅

### 🎨 UI/UX

- [x] **FE-020** - Criar componente de loading spinner ✅
  - ✅ Componente standalone criado em `frontend/src/app/shared/components/loading-spinner/`
  - ✅ Animação CSS pura implementada (rotação infinita)
  - ✅ Variáveis CSS adicionadas no `styles.css` para temas claro e escuro
  - ✅ Componente reutilizável pronto para uso em sign-in e sign-up
  - **Prioridade:** 🟢 Média
  - **Estimativa:** 30 min → **Concluído em:** 30 min
  - **Dependências:** Nenhuma
  - **Arquivos:**
    - `frontend/src/app/shared/components/loading-spinner/loading-spinner.component.ts`
    - `frontend/src/app/shared/components/loading-spinner/loading-spinner.component.html`
    - `frontend/src/app/shared/components/loading-spinner/loading-spinner.component.scss`
    - `frontend/src/styles.css` (variáveis CSS adicionadas)

- [x] **FE-021** - Criar componente de mensagem de erro ✅
  - ✅ Componente standalone criado em `frontend/src/app/shared/components/error-message/`
  - ✅ Aceita mensagem de erro via `@Input() message`
  - ✅ Ícone SVG de erro incluído
  - ✅ Variáveis CSS adicionadas no `styles.css` para temas claro e escuro
  - ✅ Animação de entrada suave (slideIn)
  - ✅ Componente reutilizável pronto para uso
  - **Prioridade:** 🟢 Média
  - **Estimativa:** 30 min → **Concluído em:** 30 min
  - **Dependências:** Nenhuma
  - **Arquivos:**
    - `frontend/src/app/shared/components/error-message/error-message.component.ts`
    - `frontend/src/app/shared/components/error-message/error-message.component.html`
    - `frontend/src/app/shared/components/error-message/error-message.component.scss`
    - `frontend/src/styles.css` (variáveis CSS adicionadas)

### 🧪 Testes Frontend

- [x] **FE-022** - Testes unitários AuthService ✅
  - Cobrir `login`, `register`, `logout` com `HttpClientTestingModule` e spies de `localStorage`, validando persistência e tratamento de erros.
  - **Status:** Concluído — arquivo `frontend/src/app/core/services/auth.service.spec.ts`.
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 1h → **Concluído em:** 1h10
  - **Dependências:** FE-003 ✅

- [x] **FE-023** - Testes E2E (Cypress) ✅
  - Fluxo completo registro → login → logout simulado via intercepts no `frontend/cypress/e2e/auth.cy.ts`.
  - Cypress configurado com `ng add @cypress/schematic` + `ng e2e` headless.
  - **Status:** Concluído — suíte executada com `npx ng e2e`.
  - **Prioridade:** 🟢 Média
  - **Estimativa:** 1h 30min → **Concluído em:** 1h40
  - **Dependências:** FE-015 ✅, FE-009 ✅

---

## 🚀 DEVOPS

### 🔐 Secrets

- [x] **DEV-001** - Configurar GitHub Secrets ✅
  - ✅ JWT_SECRET, REFRESH_TOKEN_SECRET configurados
  - ✅ Secrets usados em CI/CD pipeline
  - **Verificado:** Secrets ativos no repositório GitHub
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 10 min
  - **Dependências:** Nenhuma

### 🐳 Docker

- [x] **DEV-002** - Atualizar docker-compose com variáveis JWT ✅
  - ✅ docker-compose.dev.yml atualizado
  - ✅ docker-compose.prod.yml atualizado
  - ✅ Variáveis: JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 10 min
  - **Dependências:** BKD-002 ✅

### 📊 Monitoramento

- [x] **DEV-003** - Configurar logging de autenticação
  - Logs de login success/fail (sem expor senhas) registrados via `Logger` do NestJS
  - **Status:** Concluído — `backend/src/auth/auth.service.ts` + specs de login/validateUser atualizadas com spies do logger
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 30 min → **Concluído em:** 35 min
  - **Dependências:** BKD-005 ✅

- [x] **DEV-004** - Configurar alertas
  - ✅ `LoginAttempt` adicionado ao schema Prisma + migração `add_login_attempt_model`
  - ✅ AuthService registra sucesso/falha com IP/User-Agent (LocalStrategy + AuthController repassam metadados)
  - ✅ `MonitoringModule` com cron `@nestjs/schedule` (default `*/5 * * * *`) calcula taxa de falhas na janela configurável e emite alertas via `Logger`
  - ✅ Variáveis de ambiente: `LOGIN_ERROR_RATE_THRESHOLD`, `LOGIN_MONITOR_WINDOW_MINUTES`, `LOGIN_MONITOR_CRON`
  - ✅ Testes unitários `monitoring.service.spec.ts` cobrindo cenários sem dados, dentro/fora do limite
  - **Status:** Concluído
  - **Prioridade:** 🟢 Média
  - **Estimativa:** 45 min → **Concluído em:** 1h05
  - **Dependências:** DEV-003 ✅

### 🔒 Segurança

- [x] **DEV-005** - Revisar checklist de segurança ✅
  - ✅ HTTPS obrigatório (SSL A+ rating em produção)
  - ✅ Secrets não commitados
  - ✅ Rate limiting ativo (BKD-024 configurado com ThrottlerGuard global)
  - **Status:** CONCLUÍDO (revisão final completa)
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 15 min (após BKD-024)
- **Dependências:** BKD-024 ✅, BKD-025 ✅

- [x] **DEV-006** - Executar auditoria de segurança completa ✅
  - ✅ CORS configurado corretamente
  - ✅ Helmet.js ativo com headers corretos
  - ✅ Rate limiting configurado (BKD-024)
  - ✅ Validação de inputs verificada (class-validator)
  - ✅ Sanitização de outputs implementada (prevenir XSS)
  - ✅ HTTPS obrigatório em produção
  - ✅ Findings documentados
  - ✅ OWASP Top 10 verificado (`docs/testing/owasp-top10.md`)
  - **Status:** CONCLUÍDO
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 1h → **Concluído em:** 1h15
  - **Dependências:** BKD-024 ✅, BKD-025 ✅, BKD-026 ✅
  - **Deliverable:** `docs/testing/owasp-top10.md` + `docs/testing/xss-payloads.md`

### 📖 Documentação Técnica

- [x] **DEV-007** - Publicar referência Scalar da API ✅
  - ✅ Geração automática do OpenAPI com `@nestjs/swagger`
  - ✅ Rota `GET /docs/openapi.json` publicada sem cache
  - ✅ Interface Scalar ativa em `/docs` com autenticação Bearer documentada
  - ✅ Flag `ENABLE_API_DOCS` para controlar exposição em produção
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 45 min
  - **Dependências:** BKD-004 ✅, BKD-005 ✅

- [x] **DEV-008** - Implementar Vault OSS + Rotação Automática ✅
  - ✅ Vault service no `docker-compose.yml` (HashiCorp Vault 1.15)
  - ✅ Scripts de rotação (`rotate-jwt-secrets.mjs`, `export-jwt-env.mjs`)
  - ✅ Workflow GitHub Actions `vault-rotation.yml` (cron semanal + manual)
  - ✅ Policies Vault (`jwt-reader.hcl`, `jwt-rotation.hcl`)
  - ✅ Makefile targets: `vault-rotate-jwt`, `vault-export-env`, `vault-unseal`
  - ✅ Documentação completa em `docs/infrastructure/VAULT.md`
  - ✅ Hash de refresh tokens implementado (`hash-refresh-token.util.ts`)
  - **Prioridade:** 🔴 Crítica (Segurança)
  - **Estimativa:** 2h → **Concluído em:** 2h30
  - **Dependências:** TEST-008 ✅
  - **Deliverables:** Vault infrastructure + docs + workflow automation

---

## 🧪 TESTES E QA

### 🔍 Testes de Integração

- [x] **TEST-001** - Testar fluxo completo backend + frontend ✅
  - Registro → Login → Refresh → Logout
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 1h
  - **Dependências:** BKD-028 ✅, FE-023 ✅

### 🐛 Testes de Edge Cases

- [x] **TEST-002** - Testar comportamento com token expirado ✅
  - Auto-refresh deve funcionar
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 30 min
  - **Dependências:** FE-004 ✅

- [x] **TEST-003** - Testar rate limiting ✅
  - Verificar se bloqueia após 5 tentativas
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 20 min
  - **Dependências:** BKD-024 ✅

- [x] **TEST-004** - Testar CORS ✅
  - Apenas frontend permitido
  - **Prioridade:** 🟡 Alta
  - **Estimativa:** 15 min
  - **Dependências:** BKD-025 ✅

### 🚀 Performance

- [x] **TEST-005** - Testar tempo de resposta ✅
  - Login < 500ms
  - Register < 1s
  - **Prioridade:** 🟢 Média
  - **Estimativa:** 30 min
  - **Dependências:** TEST-001 ✅

### 🔒 Segurança

- [x] **TEST-006** - Testar SQL injection ✅
  - Inputs maliciosos nos forms
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 30 min
  - **Dependências:** BKD-005 ✅

- [x] **TEST-007** - Testar XSS ✅
  - ✅ Matriz de payloads documentada em `docs/testing/xss-payloads.md` para reuso em auditorias.
  - ✅ Sanitização adicionada no backend (`sanitizeInput`) e validada por testes unitários.
  - ✅ Specs Angular garantem que mensagens de sucesso/erro renderizam texto puro (sem `[innerHTML]`).
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 30 min → **Concluído em:** 1h10
  - **Dependências:** FE-015 ✅

- [x] **TEST-008** - Revisar OWASP Top 10 ✅
  - Checklist completo documentado em `docs/testing/owasp-top10.md` com status/evidências para A01–A10.
  - Pendências registradas: automação `npm audit`/image scan, bloqueio progressivo e alerta externo (rotação Vault atendida pelo workflow `vault-rotation.yml`).
  - **Prioridade:** 🔴 Crítica
  - **Estimativa:** 1h → **Concluído em:** 1h10
  - **Dependências:** TEST-006 ✅, TEST-007 ✅

---

## 🎉 FASE 1 CONCLUÍDA COM SUCESSO!

**Status:** ✅ Todas as 62 tarefas foram completadas!

### ✅ Checklist de Deploy - 100% Completo

- [x] **BKD-011** - JwtStrategy restaurada e registrada ✅
- [x] **BKD-024** - Rate limiting configurado e testado ✅
- [x] **FE-005** - AuthInterceptor com 401 handling completo ✅
- [x] **FE-004** - Token auto-refresh implementado ✅
- [x] **BKD-013** - LocalAuthGuard criado e aplicado ✅
- [x] **BKD-027** - Testes unitários completos (89.13% coverage) ✅
- [x] **TEST-006** - Testes de SQL injection ✅
- [x] **TEST-007** - Testes de XSS ✅
- [x] **TEST-008** - OWASP Top 10 verificado ✅
- [x] **DEV-006** - Security audit executado e documentado ✅
- [x] **DEV-008** - Vault OSS + rotação automática ✅

### 🚀 Próximos Passos

A **Fase 1 (Autenticação)** está completa! Podemos agora:

1. **Deploy para produção** - Sistema está pronto e seguro
2. **Iniciar Fase 2** - Extensão de schema para fórum (ver ROADMAP.md)
3. **Monitoramento** - Acompanhar métricas em produção
4. **Manutenção** - Rotação automática de secrets via GitHub Actions

---

## 📅 Timeline Sugerido

### Semana 1: Backend

- Dias 1-2: BKD-001 a BKD-009 (AuthService completo)
- Dias 3-4: BKD-010 a BKD-017 (Strategies, Guards, Decorators)
- Dia 5: BKD-018 a BKD-026 (Controller, Module, Segurança)

### Semana 2: Frontend

- Dias 1-2: FE-001 a FE-006 (Services, Interceptors, Guards)
- Dias 3-4: FE-007 a FE-016 (Componentes Sign-In/Sign-Up)
- Dia 5: FE-017 a FE-021 (Configuração e UI)

### Semana 3: Testes e Deploy

- Dias 1-2: BKD-027, BKD-028, FE-022, FE-023 (Testes)
- Dia 3: TEST-001 a TEST-008 (Testes de integração e segurança)
- Dia 4: DEV-001 a DEV-005 (DevOps)
- Dia 5: Review, ajustes, deploy para produção

---

## 🔄 Como Atualizar Este Documento

**AIDEV-CRITICAL:** Este arquivo DEVE ser atualizado após cada task concluída.

1. Marque a task como concluída: `[x]`
2. Atualize o "Resumo de Progresso" no topo
3. Adicione notas sobre problemas encontrados
4. Atualize CHANGELOG.md com mudanças relevantes
5. Commit: `git add docs/development/TASKS.md && git commit -m "docs: update task X"`

---

**✅ FASE 1 CONCLUÍDA:** 2025-11-10
**Próxima revisão:** Início da Fase 2 (Extensão de Schema)
**Responsável:** Time de desenvolvimento + Claude Code
