import { getSession } from './session'

type ApiDocsMode = 'off' | 'on' | 'auth'

function normalizeBaseUrl(origin?: string) {
  if (!origin) return 'http://localhost:3000'
  return origin.endsWith('/') ? origin.slice(0, -1) : origin
}

export function getApiDocsConfig() {
  const raw = (process.env.ENABLE_API_DOCS ?? '').trim().toLowerCase()
  const enabledValues = ['on', 'true', '1']
  const mode: ApiDocsMode = raw === 'auth' ? 'auth' : enabledValues.includes(raw) ? 'on' : 'off'

  return {
    enabled: mode !== 'off',
    requireAuth: mode === 'auth',
    mode,
  }
}

export async function ensureDocsAccess(request: Request) {
  const config = getApiDocsConfig()
  if (!config.enabled) {
    throw new Response('Not Found', { status: 404 })
  }

  if (config.requireAuth) {
    const session = await getSession(request)
    if (!session) {
      throw new Response('Unauthorized', { status: 401 })
    }
  }

  return config
}

export function buildOpenApiDocument(origin?: string) {
  const serverUrl = normalizeBaseUrl(origin)

  const components = {
    securitySchemes: {
      sessionCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'finance-control-session',
        description: 'Sessão Better Auth via cookie httpOnly',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
          details: {},
        },
        required: ['code', 'message'],
      },
      AuthUser: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          currency: { type: 'string', example: 'BRL' },
          timezone: { type: 'string', example: 'America/Sao_Paulo' },
          emailVerified: { type: 'string', format: 'date-time', nullable: true },
          image: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'email', 'currency', 'timezone', 'createdAt', 'updatedAt'],
      },
      AuthSession: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          expiresAt: { type: 'string', format: 'date-time' },
          user: { $ref: '#/components/schemas/AuthUser' },
        },
        required: ['token', 'expiresAt', 'user'],
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['CREDIT', 'DEBIT'] },
          value: { type: 'number', example: 1200.5 },
          description: { type: 'string' },
          category: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
          cardId: { type: 'string', nullable: true },
          subscriptionId: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: [
          'id',
          'type',
          'value',
          'description',
          'category',
          'date',
          'createdAt',
          'updatedAt',
        ],
      },
      TransactionInput: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['CREDIT', 'DEBIT'] },
          value: { type: 'number', minimum: 0 },
          description: { type: 'string', minLength: 1, maxLength: 191 },
          category: { type: 'string', minLength: 1, maxLength: 80 },
          date: { type: 'string', format: 'date-time' },
          cardId: { type: 'string', nullable: true },
          subscriptionId: { type: 'string', nullable: true },
        },
        required: ['type', 'value', 'description', 'category', 'date'],
      },
      TransactionUpdateInput: {
        type: 'object',
        description: 'Envie ao menos um campo para atualizar',
        properties: {
          type: { type: 'string', enum: ['CREDIT', 'DEBIT'] },
          value: { type: 'number', minimum: 0 },
          description: { type: 'string', minLength: 1, maxLength: 191 },
          category: { type: 'string', minLength: 1, maxLength: 80 },
          date: { type: 'string', format: 'date-time' },
          cardId: { type: 'string', nullable: true },
          subscriptionId: { type: 'string', nullable: true },
        },
      },
      TransactionsListResponse: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/Transaction' },
          },
          total: { type: 'number' },
          page: { type: 'number' },
          perPage: { type: 'number' },
          hasNextPage: { type: 'boolean' },
          appliedFilters: { $ref: '#/components/schemas/TransactionsListFilters' },
        },
        required: ['items', 'total', 'page', 'perPage', 'hasNextPage', 'appliedFilters'],
      },
      TransactionsListFilters: {
        type: 'object',
        properties: {
          month: { type: 'number', minimum: 1, maximum: 12 },
          year: { type: 'number', minimum: 2000, maximum: 2100 },
          type: { type: 'string', enum: ['CREDIT', 'DEBIT'] },
          category: { type: 'string' },
          cardId: { type: 'string' },
          subscriptionId: { type: 'string' },
          page: { type: 'number', minimum: 1, default: 1 },
          perPage: { type: 'number', minimum: 1, maximum: 50, default: 20 },
        },
      },
      Card: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          type: { type: 'string', enum: ['CREDIT', 'SUBSCRIPTION'] },
          lastDigits: { type: 'string', nullable: true, example: '1234' },
          color: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'type', 'createdAt', 'updatedAt'],
      },
      CardInput: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 120 },
          type: { type: 'string', enum: ['CREDIT', 'SUBSCRIPTION'] },
          number: { type: 'string', minLength: 8, maxLength: 32 },
          color: { type: 'string' },
        },
        required: ['name', 'type', 'number'],
      },
      CardUpdateInput: {
        type: 'object',
        description: 'Envie ao menos name ou color',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 120 },
          color: { type: 'string' },
        },
      },
      Subscription: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          value: { type: 'number' },
          billingDay: { type: 'number', minimum: 1, maximum: 31 },
          active: { type: 'boolean' },
          cardId: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'value', 'billingDay', 'active', 'createdAt', 'updatedAt'],
      },
      SubscriptionInput: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 120 },
          value: { type: 'number', minimum: 0 },
          billingDay: { type: 'number', minimum: 1, maximum: 31 },
          cardId: { type: 'string', nullable: true },
          active: { type: 'boolean', default: true },
        },
        required: ['name', 'value', 'billingDay'],
      },
      SubscriptionUpdateInput: {
        type: 'object',
        description: 'Envie ao menos um campo para atualizar',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 120 },
          value: { type: 'number', minimum: 0 },
          billingDay: { type: 'number', minimum: 1, maximum: 31 },
          cardId: { type: 'string', nullable: true },
          active: { type: 'boolean' },
        },
      },
    },
  }

  const authResponses = {
    unauthorized: {
      description: 'Sessão inválida ou ausente',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
          examples: {
            unauthorized: { value: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
          },
        },
      },
    },
    validationError: {
      description: 'Payload inválido',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
  }

  const document = {
    openapi: '3.1.0',
    info: {
      title: 'Finance Control API (dev)',
      version: '0.1.0',
      description:
        'Contrato de API para o MVP (TanStack Start + Better Auth + Prisma). Protegido por sessão httpOnly e habilitável apenas em ambientes de desenvolvimento.',
    },
    servers: [{ url: serverUrl }],
    security: [{ sessionCookie: [] }],
    tags: [
      { name: 'Docs', description: 'Acesso ao contrato OpenAPI em ambiente de desenvolvimento' },
      { name: 'Auth', description: 'Autenticação Better Auth' },
      { name: 'Transactions', description: 'CRUD de transações com filtros e paginação' },
      { name: 'Cards', description: 'Cartões lógicos (nunca expõem número completo)' },
      { name: 'Subscriptions', description: 'Assinaturas recorrentes e billing mensal' },
    ],
    components,
    paths: {
      '/api/auth/sign-up': {
        post: {
          tags: ['Auth'],
          summary: 'Registrar usuário',
          description: 'Cria usuário e sessão Better Auth. Abre cookie httpOnly.',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                    currency: { type: 'string', example: 'BRL' },
                    timezone: { type: 'string', example: 'America/Sao_Paulo' },
                  },
                  required: ['name', 'email', 'password'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Usuário criado e sessão iniciada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/AuthUser' },
                      session: { $ref: '#/components/schemas/AuthSession' },
                    },
                  },
                },
              },
            },
            400: authResponses.validationError,
          },
        },
      },
      '/api/auth/sign-in': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          description: 'Valida credenciais e retorna sessão. Define cookie httpOnly.',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Sessão iniciada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/AuthUser' },
                      session: { $ref: '#/components/schemas/AuthSession' },
                    },
                  },
                },
              },
            },
            401: authResponses.unauthorized,
            400: authResponses.validationError,
          },
        },
      },
      '/api/auth/sign-out': {
        post: {
          tags: ['Auth'],
          summary: 'Logout',
          description: 'Revoga sessão atual (cookie httpOnly).',
          responses: {
            200: {
              description: 'Logout bem-sucedido',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { success: { type: 'boolean' } } },
                },
              },
            },
            401: authResponses.unauthorized,
          },
        },
      },
      '/api/auth/session': {
        get: {
          tags: ['Auth'],
          summary: 'Sessão atual',
          description: 'Retorna sessão se cookie válido estiver presente.',
          responses: {
            200: {
              description: 'Sessão válida ou nula',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      session: {
                        anyOf: [{ $ref: '#/components/schemas/AuthSession' }, { type: 'null' }],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/transactions': {
        get: {
          tags: ['Transactions'],
          summary: 'Listar transações',
          description:
            'Lista transações do usuário autenticado com filtros de mês/ano, tipo, categoria, cartão e assinatura.',
          parameters: [
            {
              name: 'month',
              in: 'query',
              schema: { type: 'integer', minimum: 1, maximum: 12 },
              description: '1-12',
            },
            {
              name: 'year',
              in: 'query',
              schema: { type: 'integer', minimum: 2000, maximum: 2100 },
            },
            { name: 'type', in: 'query', schema: { type: 'string', enum: ['CREDIT', 'DEBIT'] } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'cardId', in: 'query', schema: { type: 'string' } },
            { name: 'subscriptionId', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1, minimum: 1 } },
            {
              name: 'perPage',
              in: 'query',
              schema: { type: 'integer', default: 20, minimum: 1, maximum: 50 },
            },
          ],
          responses: {
            200: {
              description: 'Lista paginada',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TransactionsListResponse' },
                },
              },
            },
            401: authResponses.unauthorized,
          },
        },
        post: {
          tags: ['Transactions'],
          summary: 'Criar transação',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/TransactionInput' } },
            },
          },
          responses: {
            200: {
              description: 'Transação criada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      transaction: { $ref: '#/components/schemas/Transaction' },
                      balanceDelta: {
                        type: 'number',
                        description: 'Impacto no saldo (crédito positivo, débito negativo)',
                      },
                    },
                  },
                },
              },
            },
            400: authResponses.validationError,
            401: authResponses.unauthorized,
            403: {
              description: 'Cartão/assinatura não pertencem ao usuário',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/transactions/{id}': {
        put: {
          tags: ['Transactions'],
          summary: 'Atualizar transação',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TransactionUpdateInput' },
              },
            },
          },
          responses: {
            200: {
              description: 'Transação atualizada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      transaction: { $ref: '#/components/schemas/Transaction' },
                      balanceDelta: { type: 'number' },
                    },
                  },
                },
              },
            },
            400: authResponses.validationError,
            401: authResponses.unauthorized,
            403: {
              description: 'Transação não pertence ao usuário',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            404: {
              description: 'Transação não encontrada',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
        delete: {
          tags: ['Transactions'],
          summary: 'Excluir transação',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: {
              description: 'Transação removida',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      balanceDelta: { type: 'number' },
                    },
                  },
                },
              },
            },
            401: authResponses.unauthorized,
            403: {
              description: 'Transação não pertence ao usuário',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            404: {
              description: 'Transação não encontrada',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/cards': {
        get: {
          tags: ['Cards'],
          summary: 'Listar cartões',
          responses: {
            200: {
              description: 'Lista de cartões do usuário',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Card' } },
                },
              },
            },
            401: authResponses.unauthorized,
          },
        },
        post: {
          tags: ['Cards'],
          summary: 'Criar cartão lógico',
          description: 'Número é armazenado criptografado; apenas lastDigits é retornado.',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CardInput' } } },
          },
          responses: {
            200: {
              description: 'Cartão criado',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Card' } } },
            },
            400: authResponses.validationError,
            401: authResponses.unauthorized,
          },
        },
      },
      '/api/cards/{id}': {
        put: {
          tags: ['Cards'],
          summary: 'Atualizar cartão',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/CardUpdateInput' } },
            },
          },
          responses: {
            200: {
              description: 'Cartão atualizado',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Card' } } },
            },
            401: authResponses.unauthorized,
            404: {
              description: 'Cartão não encontrado ou não pertence ao usuário',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/subscriptions': {
        get: {
          tags: ['Subscriptions'],
          summary: 'Listar assinaturas',
          responses: {
            200: {
              description: 'Assinaturas do usuário',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Subscription' } },
                },
              },
            },
            401: authResponses.unauthorized,
          },
        },
        post: {
          tags: ['Subscriptions'],
          summary: 'Criar assinatura',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/SubscriptionInput' } },
            },
          },
          responses: {
            200: {
              description: 'Assinatura criada',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Subscription' } },
              },
            },
            400: authResponses.validationError,
            401: authResponses.unauthorized,
            403: {
              description: 'Cartão não pertence ao usuário',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/subscriptions/{id}': {
        put: {
          tags: ['Subscriptions'],
          summary: 'Atualizar assinatura',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SubscriptionUpdateInput' },
              },
            },
          },
          responses: {
            200: {
              description: 'Assinatura atualizada',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Subscription' } },
              },
            },
            400: authResponses.validationError,
            401: authResponses.unauthorized,
            403: {
              description: 'Assinatura não pertence ao usuário',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            404: {
              description: 'Assinatura não encontrada',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/docs/openapi.json': {
        get: {
          tags: ['Docs'],
          summary: 'Documento OpenAPI',
          description: 'Spec gerada manualmente para o ambiente de desenvolvimento.',
          responses: {
            200: {
              description: 'Documento OpenAPI 3.1',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            401: authResponses.unauthorized,
          },
        },
      },
    },
  }

  return document
}
