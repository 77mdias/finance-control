import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { PrismaClient, Subscription } from '@/generated/prisma/client'
import { prisma } from '@/db'
import { requireUser } from '@/lib/session'

const relationIdSchema = z
  .union([z.string().trim().min(1), z.literal(null)])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined
    if (value === null) return null
    return value
  })

const createSubscriptionSchema = z.object({
  name: z.string().trim().min(1).max(120),
  value: z.coerce.number().positive(),
  billingDay: z.coerce.number().int().min(1).max(31),
  cardId: relationIdSchema,
  active: z.boolean().optional().default(true),
})

const updateSubscriptionSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    value: z.coerce.number().positive().optional(),
    billingDay: z.coerce.number().int().min(1).max(31).optional(),
    cardId: relationIdSchema,
    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'Nenhum campo para atualizar')

type SubscriptionInput = z.infer<typeof createSubscriptionSchema>
type SubscriptionUpdateInput = z.infer<typeof updateSubscriptionSchema>

type SubscriptionsClient = Pick<PrismaClient, 'subscription' | 'card'>

type SubscriptionDto = {
  id: string
  name: string
  value: number
  billingDay: number
  active: boolean
  cardId: string | null
  createdAt: string
  updatedAt: string
}

class SubscriptionsError extends Error {
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

function buildErrorResponse(error: SubscriptionsError) {
  return new Response(
    JSON.stringify({ code: error.code, message: error.message, details: error.details }),
    { status: error.status, headers: { 'Content-Type': 'application/json' } },
  )
}

function mapSubscription(subscription: Subscription): SubscriptionDto {
  return {
    id: subscription.id,
    name: subscription.name,
    value: Number(subscription.value),
    billingDay: subscription.billingDay,
    active: subscription.active,
    cardId: subscription.cardId ?? null,
    createdAt: subscription.createdAt.toISOString(),
    updatedAt: subscription.updatedAt.toISOString(),
  }
}

async function assertCardOwnership(
  db: SubscriptionsClient,
  userId: string,
  cardId?: string | null,
) {
  if (!cardId) {
    return
  }

  const card = await db.card.findUnique({ where: { id: cardId } })
  if (!card || card.userId !== userId) {
    throw new SubscriptionsError(
      400,
      'FOREIGN_RELATION_INVALID',
      'Cartão não encontrado para o usuário',
    )
  }
}

export async function createSubscriptionForUser(
  userId: string,
  input: SubscriptionInput,
  db: SubscriptionsClient = prisma,
) {
  await assertCardOwnership(db, userId, input.cardId ?? undefined)

  const created = await db.subscription.create({
    data: {
      userId,
      name: input.name,
      value: input.value,
      billingDay: input.billingDay,
      active: input.active,
      cardId: input.cardId ?? undefined,
    },
  })

  return mapSubscription(created)
}

export async function updateSubscriptionForUser(
  userId: string,
  id: string,
  updates: SubscriptionUpdateInput,
  db: SubscriptionsClient = prisma,
) {
  const existing = await db.subscription.findUnique({ where: { id } })
  if (!existing) {
    throw new SubscriptionsError(404, 'SUBSCRIPTION_NOT_FOUND', 'Assinatura não encontrada')
  }
  if (existing.userId !== userId) {
    throw new SubscriptionsError(403, 'FORBIDDEN', 'Assinatura não pertence ao usuário')
  }

  await assertCardOwnership(db, userId, updates.cardId ?? undefined)

  const data = {
    ...(updates.name ? { name: updates.name } : {}),
    ...(updates.value != null ? { value: updates.value } : {}),
    ...(updates.billingDay ? { billingDay: updates.billingDay } : {}),
    ...(updates.active !== undefined ? { active: updates.active } : {}),
  }

  if (updates.cardId !== undefined) {
    Object.assign(data, { cardId: updates.cardId })
  }

  const updated = await db.subscription.update({
    where: { id },
    data,
  })

  return mapSubscription(updated)
}

export async function listSubscriptionsForUser(
  userId: string,
  db: SubscriptionsClient = prisma,
): Promise<Array<SubscriptionDto>> {
  const subscriptions = await db.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return subscriptions.map(mapSubscription)
}

function handleError(error: unknown): never {
  if (error instanceof Response) {
    throw error
  }
  if (error instanceof SubscriptionsError) {
    throw buildErrorResponse(error)
  }
  if (error instanceof z.ZodError) {
    throw buildErrorResponse(
      new SubscriptionsError(400, 'VALIDATION_ERROR', 'Payload inválido', {
        issues: error.flatten(),
      }),
    )
  }
  throw error
}

export const createSubscription = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => createSubscriptionSchema.parse(input))
  .handler(async ({ data, request }) => {
    try {
      const user = await requireUser(request)
      return await createSubscriptionForUser(user.id, data)
    } catch (error) {
      handleError(error)
    }
  })

const updateValidator = (input: unknown) =>
  z
    .object({
      id: z.string().trim().min(1),
      data: updateSubscriptionSchema,
    })
    .parse(input)

export const updateSubscription = createServerFn({ method: 'PUT' })
  .inputValidator(updateValidator)
  .handler(async ({ data, request }) => {
    try {
      const user = await requireUser(request)
      return await updateSubscriptionForUser(user.id, data.id, data.data)
    } catch (error) {
      handleError(error)
    }
  })

export const listSubscriptions = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  try {
    const user = await requireUser(request)
    return await listSubscriptionsForUser(user.id)
  } catch (error) {
    handleError(error)
  }
})

export type { SubscriptionDto, SubscriptionInput, SubscriptionUpdateInput, SubscriptionsClient }
export { SubscriptionsError }
