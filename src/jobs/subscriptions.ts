import type { Prisma, PrismaClient } from '@/generated/prisma/client'
import { prisma } from '@/db'

type SubscriptionsJobClient = Pick<PrismaClient, 'subscription' | 'transaction'>

type SubscriptionWithUser = Prisma.SubscriptionGetPayload<{
  include: { user: { select: { id: true; timezone: true } } }
}>

type SubscriptionJobResult = {
  processed: number
  created: number
  skipped: number
  errors: Array<{ subscriptionId: string; message: string }>
  transactions: Array<{ id: string; subscriptionId: string; date: string }>
}

type JobOptions = {
  referenceDate?: Date
  db?: SubscriptionsJobClient
}

const SUBSCRIPTION_CATEGORY = 'Subscriptions'

function getLocalDateParts(referenceDate: Date, timezone: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const [yearStr, monthStr, dayStr] = formatter.format(referenceDate).split('-')

  return {
    year: Number(yearStr),
    month: Number(monthStr),
    day: Number(dayStr),
  }
}

function clampBillingDay(billingDay: number, year: number, month: number) {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return Math.min(billingDay, daysInMonth)
}

function getMonthBounds(year: number, month: number) {
  const start = new Date(Date.UTC(year, month - 1, 1))
  const end = new Date(Date.UTC(year, month, 1))
  return { start, end }
}

function buildTransactionDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day))
}

function hasExistingCharge(
  subscription: SubscriptionWithUser,
  monthStart: Date,
  nextMonthStart: Date,
  db: SubscriptionsJobClient,
) {
  return db.transaction.findFirst({
    where: {
      subscriptionId: subscription.id,
      date: { gte: monthStart, lt: nextMonthStart },
    },
  })
}

export async function generateTransactionsForActiveSubscriptions(
  options: JobOptions = {},
): Promise<SubscriptionJobResult> {
  const db = options.db ?? prisma
  const referenceDate = options.referenceDate ?? new Date()

  const activeSubscriptions = await db.subscription.findMany({
    where: { active: true },
    include: { user: { select: { id: true, timezone: true } } },
  })

  const result: SubscriptionJobResult = {
    processed: activeSubscriptions.length,
    created: 0,
    skipped: 0,
    errors: [],
    transactions: [],
  }

  // AIDEV-GOTCHA: cron can run multiple times per day; guard with per-month lookup before creating charges.
  for (const subscription of activeSubscriptions) {
    const timezone = subscription.user.timezone || 'UTC'
    const { year, month, day } = getLocalDateParts(referenceDate, timezone)
    const targetDay = clampBillingDay(subscription.billingDay, year, month)

    if (day < targetDay) {
      result.skipped += 1
      continue
    }

    const { start: monthStart, end: nextMonthStart } = getMonthBounds(year, month)
    const existing = await hasExistingCharge(subscription, monthStart, nextMonthStart, db)

    if (existing) {
      result.skipped += 1
      continue
    }

    const transactionDate = buildTransactionDate(year, month, targetDay)

    try {
      const created = await db.transaction.create({
        data: {
          userId: subscription.userId,
          type: 'DEBIT',
          value: subscription.value,
          description: `${subscription.name} (assinatura)`,
          category: SUBSCRIPTION_CATEGORY,
          date: transactionDate,
          cardId: subscription.cardId ?? undefined,
          subscriptionId: subscription.id,
        },
      })

      result.created += 1
      result.transactions.push({
        id: created.id,
        subscriptionId: subscription.id,
        date: created.date.toISOString(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      result.errors.push({ subscriptionId: subscription.id, message })
    }
  }

  return result
}

export type { SubscriptionJobResult, SubscriptionsJobClient }
