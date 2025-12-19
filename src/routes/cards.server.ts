import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { Card, PrismaClient } from '@/generated/prisma/client'
import { prisma } from '@/db'
import { encryptCardNumber, lastDigits, sanitizeCardNumber } from '@/lib/crypto'
import { requireUser } from '@/lib/session'

const createCardSchema = z.object({
  name: z.string().trim().min(1).max(120),
  type: z.enum(['CREDIT', 'SUBSCRIPTION']),
  number: z.string().trim().min(8).max(32),
  color: z.string().trim().optional(),
})

const updateCardSchema = z
  .object({
    id: z.string().trim().min(1),
    name: z.string().trim().min(1).max(120).optional(),
    color: z.string().trim().optional(),
  })
  .refine((data) => data.name !== undefined || data.color !== undefined, {
    message: 'Nenhum campo para atualizar',
  })

type CardInput = z.infer<typeof createCardSchema>
type CardUpdateInput = z.infer<typeof updateCardSchema>

type CardsClient = Pick<PrismaClient, 'card'>

type CardDto = {
  id: string
  name: string
  type: CardInput['type']
  lastDigits: string | null
  color: string | null
  createdAt: string
  updatedAt: string
}

class CardsError extends Error {
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

function buildErrorResponse(error: CardsError) {
  return new Response(
    JSON.stringify({ code: error.code, message: error.message, details: error.details }),
    { status: error.status, headers: { 'Content-Type': 'application/json' } },
  )
}

function mapCard(card: Card): CardDto {
  return {
    id: card.id,
    name: card.name,
    type: card.type as CardInput['type'],
    lastDigits: card.lastDigits ?? null,
    color: card.color ?? null,
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  }
}

export async function createCardForUser(
  userId: string,
  input: CardInput,
  db: CardsClient = prisma,
) {
  const sanitizedNumber = sanitizeCardNumber(input.number)
  if (sanitizedNumber.length < 8) {
    throw new CardsError(400, 'VALIDATION_ERROR', 'Número do cartão inválido')
  }

  const encryptedNumber = encryptCardNumber(sanitizedNumber)
  const card = await db.card.create({
    data: {
      name: input.name,
      type: input.type,
      userId,
      encryptedNumber,
      lastDigits: lastDigits(sanitizedNumber),
      color: input.color,
    },
  })

  return mapCard(card)
}

export async function updateCardForUser(
  userId: string,
  input: CardUpdateInput,
  db: CardsClient = prisma,
) {
  const existing = await db.card.findUnique({ where: { id: input.id } })
  if (!existing) {
    throw new CardsError(404, 'CARD_NOT_FOUND', 'Cartão não encontrado')
  }
  if (existing.userId !== userId) {
    throw new CardsError(403, 'FORBIDDEN', 'Cartão não pertence ao usuário')
  }

  const updated = await db.card.update({
    where: { id: input.id },
    data: {
      ...(input.name ? { name: input.name } : {}),
      ...(input.color !== undefined ? { color: input.color } : {}),
    },
  })

  return mapCard(updated)
}

export async function listCardsForUser(
  userId: string,
  db: CardsClient = prisma,
): Promise<Array<CardDto>> {
  const cards = await db.card.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return cards.map((card) => mapCard(card))
}

function handleError(error: unknown): never {
  if (error instanceof Response) {
    throw error
  }
  if (error instanceof CardsError) {
    throw buildErrorResponse(error)
  }
  if (error instanceof z.ZodError) {
    throw buildErrorResponse(
      new CardsError(400, 'VALIDATION_ERROR', 'Payload inválido', { issues: error.flatten() }),
    )
  }
  throw error
}

export const createCard = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => createCardSchema.parse(input))
  .handler(async ({ data, request }) => {
    try {
      const user = await requireUser(request)
      return await createCardForUser(user.id, data)
    } catch (error) {
      handleError(error)
    }
  })

export const updateCard = createServerFn({ method: 'PUT' })
  .inputValidator((input: unknown) => updateCardSchema.parse(input))
  .handler(async ({ data, request }) => {
    try {
      const user = await requireUser(request)
      return await updateCardForUser(user.id, data)
    } catch (error) {
      handleError(error)
    }
  })

export const listCards = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  try {
    const user = await requireUser(request)
    return await listCardsForUser(user.id)
  } catch (error) {
    handleError(error)
  }
})

export type { CardDto, CardInput, CardUpdateInput, CardsClient }
