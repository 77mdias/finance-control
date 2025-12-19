import { describe, expect, it } from 'vitest'
import {
  TransactionsError,
  createTransactionForUser,
  deleteTransactionForUser,
  listTransactionsForUser,
  normalizeTransactionFilters,
  updateTransactionForUser,
  type TransactionsClient,
} from '@/server/transactions.server'
import { InMemoryDb } from '../helpers/inMemoryDb'

describe('transactions server functions', () => {
  it('normalizes filters and applies defaults', () => {
    const filters = normalizeTransactionFilters({ month: '2' as unknown as number })

    expect(filters.page).toBe(1)
    expect(filters.perPage).toBe(20)
    expect(filters.month).toBe(2)
    expect(filters.year).toBe(new Date().getUTCFullYear())
  })

  it('applies filters, pagination and ordering', async () => {
    const db = new InMemoryDb({
      transactions: [
        {
          id: 't1',
          userId: 'user-1',
          type: 'CREDIT',
          value: 100,
          description: 'Salary',
          category: 'income',
          date: new Date('2025-02-10T00:00:00Z'),
          cardId: null,
          subscriptionId: null,
          createdAt: new Date('2025-02-10T00:00:00Z'),
          updatedAt: new Date('2025-02-10T00:00:00Z'),
        },
        {
          id: 't2',
          userId: 'user-1',
          type: 'DEBIT',
          value: 40,
          description: 'Groceries',
          category: 'food',
          date: new Date('2025-02-15T00:00:00Z'),
          cardId: null,
          subscriptionId: null,
          createdAt: new Date('2025-02-15T00:00:00Z'),
          updatedAt: new Date('2025-02-15T00:00:00Z'),
        },
        {
          id: 't3',
          userId: 'user-1',
          type: 'DEBIT',
          value: 25,
          description: 'Snacks',
          category: 'food',
          date: new Date('2025-03-01T00:00:00Z'),
          cardId: null,
          subscriptionId: null,
          createdAt: new Date('2025-03-01T00:00:00Z'),
          updatedAt: new Date('2025-03-01T00:00:00Z'),
        },
        {
          id: 't4',
          userId: 'other-user',
          type: 'DEBIT',
          value: 10,
          description: 'Hidden',
          category: 'misc',
          date: new Date('2025-02-20T00:00:00Z'),
          cardId: null,
          subscriptionId: null,
          createdAt: new Date('2025-02-20T00:00:00Z'),
          updatedAt: new Date('2025-02-20T00:00:00Z'),
        },
      ],
    })

    const result = await listTransactionsForUser(
      'user-1',
      { month: 2, year: 2025, perPage: 1, page: 1 },
      db as unknown as TransactionsClient,
    )

    expect(result.total).toBe(2)
    expect(result.hasNextPage).toBe(true)
    expect(result.items[0].id).toBe('t2') // ordered by date desc
    expect(result.items[0].category).toBe('food')
  })

  it('validates related resources on create', async () => {
    const db = new InMemoryDb({
      cards: [
        { id: 'card-public', userId: 'other-user' },
        { id: 'card-owner', userId: 'user-1' },
      ],
    })

    await expect(
      createTransactionForUser(
        'user-1',
        {
          type: 'CREDIT',
          value: 50,
          description: 'Bonus',
          category: 'income',
          date: new Date('2025-02-01T00:00:00Z'),
          cardId: 'card-public',
          subscriptionId: null,
        },
        db as unknown as TransactionsClient,
      ),
    ).rejects.toBeInstanceOf(TransactionsError)

    const created = await createTransactionForUser(
      'user-1',
      {
        type: 'DEBIT',
        value: 30,
        description: 'Groceries',
        category: 'food',
        date: new Date('2025-02-02T00:00:00Z'),
        cardId: 'card-owner',
        subscriptionId: null,
      },
      db as unknown as TransactionsClient,
    )

    expect(created.transaction.cardId).toBe('card-owner')
    expect(created.balanceDelta).toBeLessThan(0)
  })

  it('enforces ownership on update and delete and calculates balance delta', async () => {
    const db = new InMemoryDb({
      transactions: [
        {
          id: 't-owned',
          userId: 'user-1',
          type: 'DEBIT',
          value: 60,
          description: 'Fuel',
          category: 'transport',
          date: new Date('2025-02-05T00:00:00Z'),
          cardId: null,
          subscriptionId: null,
          createdAt: new Date('2025-02-05T00:00:00Z'),
          updatedAt: new Date('2025-02-05T00:00:00Z'),
        },
      ],
    })

    await expect(
      updateTransactionForUser(
        'other-user',
        't-owned',
        { description: 'Invalid' },
        db as unknown as TransactionsClient,
      ),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })

    const updated = await updateTransactionForUser(
      'user-1',
      't-owned',
      { type: 'CREDIT', value: 60 },
      db as unknown as TransactionsClient,
    )

    expect(updated.balanceDelta).toBe(120) // from -60 to +60

    const deleted = await deleteTransactionForUser(
      'user-1',
      't-owned',
      db as unknown as TransactionsClient,
    )
    expect(deleted.balanceDelta).toBe(-60)
    expect(deleted.success).toBe(true)
  })
})
