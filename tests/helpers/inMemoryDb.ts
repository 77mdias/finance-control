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
}

type StoredSubscription = {
  id: string
  userId: string
}

function createId() {
  return `tx_${Math.random().toString(36).slice(2, 10)}`
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
  lastFindManyArgs?: Prisma.TransactionFindManyArgs

  constructor(options?: {
    transactions?: StoredTransaction[]
    cards?: StoredCard[]
    subscriptions?: StoredSubscription[]
  }) {
    this.transactions = options?.transactions ?? []
    this.cards = options?.cards ?? []
    this.subscriptions = options?.subscriptions ?? []
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
    count: async (args: Prisma.TransactionCountArgs) => {
      return this.transactions.filter((item) => matchesWhere(item, args.where)).length
    },
    findUnique: async (args: Prisma.TransactionFindUniqueArgs) => {
      return this.transactions.find((item) => item.id === args.where.id) ?? null
    },
    create: async (args: Prisma.TransactionCreateArgs) => {
      const now = new Date()
      const next: StoredTransaction = {
        id: createId(),
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
  }

  subscription = {
    findUnique: async (args: Prisma.SubscriptionFindUniqueArgs) => {
      return this.subscriptions.find((subscription) => subscription.id === args.where.id) ?? null
    },
  }
}
