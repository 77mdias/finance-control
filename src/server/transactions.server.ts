import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { Prisma, PrismaClient, Transaction } from '@/generated/prisma/client'
import { requireUser } from '@/lib/session'

const transactionTypeSchema = z.enum(['CREDIT', 'DEBIT'])

const relationIdSchema = z
  .union([z.string().trim().min(1), z.literal(null)])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined
    if (value === null) return null
    return value
  })

const createTransactionSchema = z.object({
  type: transactionTypeSchema,
  value: z.coerce.number().positive(),
  description: z.string().trim().min(1).max(191),
  category: z.string().trim().min(1).max(80),
  date: z.coerce.date(),
  cardId: relationIdSchema,
  subscriptionId: relationIdSchema,
})

const updateTransactionSchema = createTransactionSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Nenhum campo para atualizar')

const filterRelationIdSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined))

const listTransactionsSchema = z
  .object({
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    type: transactionTypeSchema.optional(),
    category: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value && value.length > 0 ? value : undefined)),
    cardId: filterRelationIdSchema,
    subscriptionId: filterRelationIdSchema,
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(50).default(20),
  })
  .transform((values) => {
    if (values.month != null && values.year == null) {
      return { ...values, year: new Date().getUTCFullYear() }
    }
    return values
  })

type TransactionsFilters = z.infer<typeof listTransactionsSchema>
type TransactionInput = z.infer<typeof createTransactionSchema>
type TransactionUpdateInput = z.infer<typeof updateTransactionSchema>

type TransactionsClient = Pick<PrismaClient, 'transaction' | 'card' | 'subscription'>

type TransactionDto = {
  id: string
  type: TransactionInput['type']
  value: number
  description: string
  category: string
  date: string
  cardId: string | null
  subscriptionId: string | null
  createdAt: string
  updatedAt: string
}

type TransactionsListResponse = {
  items: Array<TransactionDto>
  total: number
  page: number
  perPage: number
  hasNextPage: boolean
  appliedFilters: TransactionsFilters
}

export class TransactionsError extends Error {
  status: number
  code: string
  details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

function buildErrorResponse(error: TransactionsError) {
  return new Response(
    JSON.stringify({
      code: error.code,
      message: error.message,
      details: error.details,
    }),
    {
      status: error.status,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

function normalizeFilters(filters?: Partial<TransactionsFilters>): TransactionsFilters {
  return listTransactionsSchema.parse(filters ?? {})
}

async function getTransactionsClient(): Promise<TransactionsClient> {
  if (!import.meta.env.SSR) {
    throw new TransactionsError(500, 'SERVER_ONLY', 'Função disponível apenas no servidor')
  }
  const { prisma } = await import('@/db')
  return prisma
}

function mapTransaction(transaction: Transaction): TransactionDto {
  return {
    id: transaction.id,
    type: transaction.type,
    value: Number(transaction.value),
    description: transaction.description,
    category: transaction.category,
    date: transaction.date.toISOString(),
    cardId: transaction.cardId ?? null,
    subscriptionId: transaction.subscriptionId ?? null,
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  }
}

function calculateBalanceDelta(type: TransactionInput['type'], value: number) {
  return type === 'CREDIT' ? value : -value
}

function getDateFilter(filters: TransactionsFilters): Prisma.DateTimeFilter | undefined {
  const { month, year } = filters
  if (month == null && year == null) {
    return undefined
  }

  if (month != null) {
    const targetYear = year ?? new Date().getUTCFullYear()
    const start = new Date(Date.UTC(targetYear, month - 1, 1))
    const end = new Date(Date.UTC(targetYear, month, 1))
    return { gte: start, lt: end }
  }

  const start = new Date(Date.UTC(year!, 0, 1))
  const end = new Date(Date.UTC(year! + 1, 0, 1))
  return { gte: start, lt: end }
}

async function assertRelationsOwnership(
  db: TransactionsClient,
  userId: string,
  relations: { cardId?: string | null; subscriptionId?: string | null },
) {
  if (relations.cardId) {
    const card = await db.card.findUnique({ where: { id: relations.cardId } })
    if (!card || card.userId !== userId) {
      throw new TransactionsError(
        400,
        'FOREIGN_RELATION_INVALID',
        'Cartão não encontrado para o usuário',
      )
    }
  }

  if (relations.subscriptionId) {
    const subscription = await db.subscription.findUnique({
      where: { id: relations.subscriptionId },
    })
    if (!subscription || subscription.userId !== userId) {
      throw new TransactionsError(
        400,
        'FOREIGN_RELATION_INVALID',
        'Assinatura não encontrada para o usuário',
      )
    }
  }
}

export async function listTransactionsForUser(
  userId: string,
  filters: Partial<TransactionsFilters>,
  db?: TransactionsClient,
): Promise<TransactionsListResponse> {
  const client = db ?? (await getTransactionsClient())
  const parsedFilters = normalizeFilters(filters)
  const where: Prisma.TransactionWhereInput = {
    userId,
    type: parsedFilters.type,
    cardId: parsedFilters.cardId,
    subscriptionId: parsedFilters.subscriptionId,
    date: getDateFilter(parsedFilters),
    category: parsedFilters.category
      ? {
          contains: parsedFilters.category,
          mode: 'insensitive',
        }
      : undefined,
  }

  const skip = (parsedFilters.page - 1) * parsedFilters.perPage

  const [items, total] = await Promise.all([
    client.transaction.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: parsedFilters.perPage,
    }),
    client.transaction.count({ where }),
  ])

  const hasNextPage = parsedFilters.page * parsedFilters.perPage < total

  return {
    items: items.map(mapTransaction),
    total,
    page: parsedFilters.page,
    perPage: parsedFilters.perPage,
    hasNextPage,
    appliedFilters: parsedFilters,
  }
}

export async function createTransactionForUser(
  userId: string,
  input: TransactionInput,
  db?: TransactionsClient,
) {
  const client = db ?? (await getTransactionsClient())
  await assertRelationsOwnership(client, userId, {
    cardId: input.cardId ?? undefined,
    subscriptionId: input.subscriptionId ?? undefined,
  })

  const created = await client.transaction.create({
    data: {
      ...input,
      userId,
    },
  })

  return {
    transaction: mapTransaction(created),
    balanceDelta: calculateBalanceDelta(created.type, Number(created.value)),
  }
}

export async function updateTransactionForUser(
  userId: string,
  id: string,
  updates: TransactionUpdateInput,
  db?: TransactionsClient,
) {
  const client = db ?? (await getTransactionsClient())
  const existing = await client.transaction.findUnique({ where: { id } })
  if (!existing) {
    throw new TransactionsError(404, 'TRANSACTION_NOT_FOUND', 'Transação não encontrada')
  }
  if (existing.userId !== userId) {
    throw new TransactionsError(403, 'FORBIDDEN', 'Transação não pertence ao usuário')
  }

  await assertRelationsOwnership(client, userId, {
    cardId: updates.cardId ?? undefined,
    subscriptionId: updates.subscriptionId ?? undefined,
  })

  const data: Prisma.TransactionUpdateInput = {
    ...(updates.type ? { type: updates.type } : {}),
    ...(updates.value != null ? { value: updates.value } : {}),
    ...(updates.description ? { description: updates.description } : {}),
    ...(updates.category ? { category: updates.category } : {}),
    ...(updates.date ? { date: updates.date } : {}),
  }

  if (updates.cardId !== undefined) {
    data.cardId = updates.cardId
  }
  if (updates.subscriptionId !== undefined) {
    data.subscriptionId = updates.subscriptionId
  }

  const updated = await client.transaction.update({
    where: { id },
    data,
  })

  const balanceDelta =
    calculateBalanceDelta(updated.type, Number(updated.value)) -
    calculateBalanceDelta(existing.type, Number(existing.value))

  return {
    transaction: mapTransaction(updated),
    balanceDelta,
  }
}

export async function deleteTransactionForUser(
  userId: string,
  id: string,
  db?: TransactionsClient,
) {
  const client = db ?? (await getTransactionsClient())
  const existing = await client.transaction.findUnique({ where: { id } })
  if (!existing) {
    throw new TransactionsError(404, 'TRANSACTION_NOT_FOUND', 'Transação não encontrada')
  }
  if (existing.userId !== userId) {
    throw new TransactionsError(403, 'FORBIDDEN', 'Transação não pertence ao usuário')
  }

  const removed = await client.transaction.delete({ where: { id } })
  const balanceDelta = -calculateBalanceDelta(removed.type, Number(removed.value))

  return {
    success: true,
    balanceDelta,
  }
}

function handleError(error: unknown): never {
  if (error instanceof Response) {
    throw error
  }
  if (error instanceof TransactionsError) {
    throw buildErrorResponse(error)
  }
  if (error instanceof z.ZodError) {
    throw buildErrorResponse(
      new TransactionsError(400, 'VALIDATION_ERROR', 'Payload inválido', {
        issues: error.flatten(),
      }),
    )
  }
  throw error
}

export const listTransactions = createServerFn({ method: 'GET' })
  .inputValidator((input: unknown) => normalizeFilters(input as Partial<TransactionsFilters>))
  .handler(async ({ data, request }) => {
    try {
      const user = await requireUser(request)
      return await listTransactionsForUser(user.id, data)
    } catch (error) {
      handleError(error)
    }
  })

const createValidator = (input: unknown) => createTransactionSchema.parse(input)

export const createTransaction = createServerFn({ method: 'POST' })
  .inputValidator(createValidator)
  .handler(async ({ data, request }) => {
    try {
      const user = await requireUser(request)
      return await createTransactionForUser(user.id, data)
    } catch (error) {
      handleError(error)
    }
  })

const updateValidator = (input: unknown) =>
  z
    .object({
      id: z.string().trim().min(1),
      data: updateTransactionSchema,
    })
    .parse(input)

export const updateTransaction = createServerFn({ method: 'PUT' })
  .inputValidator(updateValidator)
  .handler(async ({ data, request }) => {
    try {
      const user = await requireUser(request)
      return await updateTransactionForUser(user.id, data.id, data.data)
    } catch (error) {
      handleError(error)
    }
  })

const deleteValidator = (input: unknown) =>
  z
    .object({
      id: z.string().trim().min(1),
    })
    .parse(input)

export const deleteTransaction = createServerFn({ method: 'DELETE' })
  .inputValidator(deleteValidator)
  .handler(async ({ data, request }) => {
    try {
      const user = await requireUser(request)
      return await deleteTransactionForUser(user.id, data.id)
    } catch (error) {
      handleError(error)
    }
  })

export function transactionsQueryOptions(filters: Partial<TransactionsFilters> = {}) {
  const parsedFilters = normalizeFilters(filters)
  return {
    queryKey: ['transactions', parsedFilters],
    queryFn: () => listTransactions({ data: parsedFilters }),
  }
}

export { normalizeFilters as normalizeTransactionFilters }
export type { TransactionsFilters, TransactionsListResponse, TransactionDto }
export type { TransactionsClient }
