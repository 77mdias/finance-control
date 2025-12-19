import { describe, expect, it } from 'vitest'
import {
  createTransactionForUser,
  deleteTransactionForUser,
  listTransactionsForUser,
  updateTransactionForUser,
  type TransactionsClient,
} from '@/server/transactions.server'
import { InMemoryDb } from '../helpers/inMemoryDb'

describe('transactions E2E flow', () => {
  it('creates, lists, updates and deletes a transaction using the same client', async () => {
    const db = new InMemoryDb({
      cards: [{ id: 'card-1', userId: 'user-1' }],
      subscriptions: [{ id: 'sub-1', userId: 'user-1' }],
    })

    const created = await createTransactionForUser(
      'user-1',
      {
        type: 'DEBIT',
        value: 75,
        description: 'Streaming',
        category: 'media',
        date: new Date('2025-02-01T00:00:00Z'),
        cardId: 'card-1',
        subscriptionId: 'sub-1',
      },
      db as unknown as TransactionsClient,
    )

    expect(created.transaction.subscriptionId).toBe('sub-1')
    expect(created.balanceDelta).toBeLessThan(0)

    const listed = await listTransactionsForUser(
      'user-1',
      { month: 2, year: 2025 },
      db as unknown as TransactionsClient,
    )

    expect(listed.total).toBe(1)
    expect(listed.items[0].description).toBe('Streaming')

    const updated = await updateTransactionForUser(
      'user-1',
      listed.items[0].id,
      {
        value: 100,
        description: 'Streaming HD',
      },
      db as unknown as TransactionsClient,
    )

    expect(updated.transaction.value).toBe(100)
    expect(updated.balanceDelta).toBeCloseTo(-25) // -75 -> -100 = delta -25

    const deleted = await deleteTransactionForUser(
      'user-1',
      updated.transaction.id,
      db as unknown as TransactionsClient,
    )

    expect(deleted.balanceDelta).toBe(100)
    expect(deleted.success).toBe(true)

    const afterDelete = await listTransactionsForUser(
      'user-1',
      { month: 2, year: 2025 },
      db as unknown as TransactionsClient,
    )
    expect(afterDelete.total).toBe(0)
  })
})
