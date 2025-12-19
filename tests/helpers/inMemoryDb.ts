import type { Prisma } from '@/generated/prisma/client'

type StoredTransaction = {
  id: string
  userId: string
  type: 'CREDIT' | 'DEBIT'
  value: number
  description: string
  category: string
  date: Date
  cardId: string | null
  subscriptionId: string | null
  createdAt: Date
  updatedAt: Date
}

type StoredCard = {
  id: string
  userId: string
  encryptedNumber?: string | null
  lastDigits?: string | null
  createdAt?: Date
  updatedAt?: Date
}

type StoredSubscription = {
  id: string
  userId: string
  cardId: string | null
  name: string
  value: number
  billingDay: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

type StoredUser = {
  id: string
  timezone?: string
}

function createId(prefix = 'id_') {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}`
}

function matchesWhere(transaction: StoredTransaction, where?: Prisma.TransactionWhereInput) {
  if (!where) return true
  if (where.userId && transaction.userId !== where.userId) return false
  if (where.type && transaction.type !== where.type) return false
  if (where.cardId && transaction.cardId !== where.cardId) return false
  if (where.subscriptionId && transaction.subscriptionId !== where.subscriptionId) return false

  if (where.category && 'contains' in where.category) {
    const needle = (where.category.contains ?? '').toString().toLowerCase()
    if (!transaction.category.toLowerCase().includes(needle)) {
      return false
    }
  }

  if (where.date) {
    const { gte, lt } = where.date as Prisma.DateTimeFilter
    if (gte && transaction.date < new Date(gte)) return false
    if (lt && transaction.date >= new Date(lt)) return false
  }

  return true
}

function sortTransactions(items: StoredTransaction[]) {
  return [...items].sort((a, b) => {
    if (a.date.getTime() === b.date.getTime()) {
      return b.createdAt.getTime() - a.createdAt.getTime()
    }
    return b.date.getTime() - a.date.getTime()
  })
}

export class InMemoryDb {
  transactions: StoredTransaction[]
  cards: StoredCard[]
  subscriptions: StoredSubscription[]
  users: StoredUser[]
  lastFindManyArgs?: Prisma.TransactionFindManyArgs

  constructor(options?: {
    transactions?: StoredTransaction[]
    cards?: StoredCard[]
    subscriptions?: StoredSubscription[]
    users?: StoredUser[]
  }) {
    this.transactions = options?.transactions ?? []
    this.cards = options?.cards ?? []
    this.subscriptions = options?.subscriptions ?? []
    this.users = options?.users ?? []
  }

  transaction = {
    findMany: async (args: Prisma.TransactionFindManyArgs) => {
      this.lastFindManyArgs = args
      const filtered = this.transactions.filter((item) => matchesWhere(item, args.where))
      const sorted = sortTransactions(filtered)
      const start = args.skip ?? 0
      const end = args.take ? start + args.take : undefined
      return sorted.slice(start, end)
    },
    findFirst: async (args: Prisma.TransactionFindFirstArgs) => {
      const filtered = this.transactions.filter((item) => matchesWhere(item, args.where))
      const sorted = sortTransactions(filtered)
      return sorted[0] ?? null
    },
    count: async (args: Prisma.TransactionCountArgs) => {
      return this.transactions.filter((item) => matchesWhere(item, args.where)).length
    },
    findUnique: async (args: Prisma.TransactionFindUniqueArgs) => {
      return this.transactions.find((item) => item.id === args.where.id) ?? null
    },
    create: async (args: Prisma.TransactionCreateArgs) => {
      const now = new Date()
      const next: StoredTransaction = {
        id: createId('tx_'),
        userId: args.data.userId as string,
        type: args.data.type as StoredTransaction['type'],
        value: Number(args.data.value),
        description: args.data.description as string,
        category: args.data.category as string,
        date: args.data.date as Date,
        cardId: (args.data.cardId as string | null | undefined) ?? null,
        subscriptionId: (args.data.subscriptionId as string | null | undefined) ?? null,
        createdAt: now,
        updatedAt: now,
      }
      this.transactions.push(next)
      return next
    },
    update: async (args: Prisma.TransactionUpdateArgs) => {
      const existingIndex = this.transactions.findIndex((item) => item.id === args.where.id)
      if (existingIndex === -1) {
        throw new Error('Not found')
      }
      const existing = this.transactions[existingIndex]
      const data = args.data

      const next: StoredTransaction = {
        ...existing,
        ...data,
        value: data.value !== undefined ? Number(data.value) : existing.value,
        type: (data.type as StoredTransaction['type'] | undefined) ?? existing.type,
        description: (data.description as string | undefined) ?? existing.description,
        category: (data.category as string | undefined) ?? existing.category,
        date: (data.date as Date | undefined) ?? existing.date,
        cardId:
          data.cardId !== undefined ? ((data.cardId as string | null) ?? null) : existing.cardId,
        subscriptionId:
          data.subscriptionId !== undefined
            ? ((data.subscriptionId as string | null) ?? null)
            : existing.subscriptionId,
        updatedAt: new Date(),
      }

      this.transactions[existingIndex] = next
      return next
    },
    delete: async (args: Prisma.TransactionDeleteArgs) => {
      const index = this.transactions.findIndex((item) => item.id === args.where.id)
      if (index === -1) {
        throw new Error('Not found')
      }
      const [removed] = this.transactions.splice(index, 1)
      return removed
    },
  }

  card = {
    findUnique: async (args: Prisma.CardFindUniqueArgs) => {
      return this.cards.find((card) => card.id === args.where.id) ?? null
    },
    findMany: async (args: Prisma.CardFindManyArgs) => {
      const items = this.cards.filter(
        (card) => !args.where?.userId || card.userId === args.where?.userId,
      )
      const ordered =
        args.orderBy && 'createdAt' in args.orderBy && args.orderBy.createdAt === 'desc'
          ? [...items].sort(
              (a, b) => (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0),
            )
          : items
      return ordered.map((card) => ({
        ...card,
        createdAt: card.createdAt ?? new Date(),
        updatedAt: card.updatedAt ?? new Date(),
      }))
    },
    create: async (args: Prisma.CardCreateArgs) => {
      const now = new Date()
      const next: StoredCard = {
        id: args.data.id as string,
        userId: args.data.userId as string,
        encryptedNumber: (args.data.encryptedNumber as string | null | undefined) ?? null,
        lastDigits: (args.data.lastDigits as string | null | undefined) ?? null,
      }
      this.cards.push(next)
      return { ...next, createdAt: now, updatedAt: now }
    },
    update: async (args: Prisma.CardUpdateArgs) => {
      const index = this.cards.findIndex((card) => card.id === args.where.id)
      if (index === -1) {
        throw new Error('Not found')
      }
      const existing = this.cards[index]
      const next: StoredCard = {
        ...existing,
        ...args.data,
        encryptedNumber:
          args.data.encryptedNumber !== undefined
            ? ((args.data.encryptedNumber as string | null) ?? null)
            : existing.encryptedNumber,
        lastDigits:
          args.data.lastDigits !== undefined
            ? ((args.data.lastDigits as string | null) ?? null)
            : existing.lastDigits,
      }
      this.cards[index] = next
      return { ...next, updatedAt: new Date() }
    },
  }

  subscription = {
    findUnique: async (args: Prisma.SubscriptionFindUniqueArgs) => {
      const item = this.subscriptions.find((subscription) => subscription.id === args.where.id)
      if (!item) return null

      if (args.include?.user) {
        const user = this.users.find((current) => current.id === item.userId) ?? {
          id: item.userId,
          timezone: 'UTC',
        }

        return { ...item, user }
      }

      return item
    },
    findMany: async (args: Prisma.SubscriptionFindManyArgs = {}) => {
      const where = args.where ?? {}

      const items = this.subscriptions.filter((subscription) => {
        if (where.userId && subscription.userId !== where.userId) return false
        if (where.active !== undefined && subscription.active !== where.active) return false
        return true
      })

      const ordered =
        args.orderBy && 'createdAt' in args.orderBy && args.orderBy.createdAt === 'desc'
          ? [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          : items

      return ordered.map((subscription) => {
        if (args.include?.user) {
          const user = this.users.find((current) => current.id === subscription.userId) ?? {
            id: subscription.userId,
            timezone: 'UTC',
          }
          return { ...subscription, user }
        }
        return subscription
      })
    },
    create: async (args: Prisma.SubscriptionCreateArgs) => {
      const now = new Date()
      const next: StoredSubscription = {
        id: (args.data.id as string | undefined) ?? createId('sub_'),
        userId: args.data.userId as string,
        cardId: (args.data.cardId as string | null | undefined) ?? null,
        name: args.data.name as string,
        value: Number(args.data.value),
        billingDay: args.data.billingDay as number,
        active: (args.data.active as boolean | undefined) ?? true,
        createdAt: now,
        updatedAt: now,
      }

      this.subscriptions.push(next)
      return next
    },
    update: async (args: Prisma.SubscriptionUpdateArgs) => {
      const index = this.subscriptions.findIndex(
        (subscription) => subscription.id === args.where.id,
      )
      if (index === -1) {
        throw new Error('Not found')
      }

      const existing = this.subscriptions[index]
      const data = args.data

      const next: StoredSubscription = {
        ...existing,
        name: (data.name as string | undefined) ?? existing.name,
        value: data.value !== undefined ? Number(data.value) : existing.value,
        billingDay: (data.billingDay as number | undefined) ?? existing.billingDay,
        cardId:
          data.cardId !== undefined ? ((data.cardId as string | null) ?? null) : existing.cardId,
        active: (data.active as boolean | undefined) ?? existing.active,
        updatedAt: new Date(),
      }

      this.subscriptions[index] = next
      return next
    },
  }

  user = {
    findUnique: async (args: Prisma.UserFindUniqueArgs) => {
      return this.users.find((user) => user.id === args.where.id) ?? null
    },
  }
}
