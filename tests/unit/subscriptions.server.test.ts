import { describe, expect, it } from 'vitest'
import {
  generateTransactionsForActiveSubscriptions,
  type SubscriptionsJobClient,
} from '@/jobs/subscriptions'
import {
  SubscriptionsError,
  createSubscriptionForUser,
  listSubscriptionsForUser,
  updateSubscriptionForUser,
  type SubscriptionsClient,
} from '@/routes/subscriptions.server'
import { InMemoryDb } from '../helpers/inMemoryDb'

describe('subscriptions server functions', () => {
  it('validates card ownership on create and maps dto', async () => {
    const db = new InMemoryDb({
      users: [{ id: 'user-1', timezone: 'UTC' }],
      cards: [
        { id: 'card-foreign', userId: 'other-user' },
        { id: 'card-owner', userId: 'user-1' },
      ],
    })

    await expect(
      createSubscriptionForUser(
        'user-1',
        { name: 'Netflix', value: 39.9, billingDay: 5, cardId: 'card-foreign', active: true },
        db as unknown as SubscriptionsClient,
      ),
    ).rejects.toBeInstanceOf(SubscriptionsError)

    const created = await createSubscriptionForUser(
      'user-1',
      { name: 'Netflix', value: 39.9, billingDay: 5, cardId: 'card-owner', active: true },
      db as unknown as SubscriptionsClient,
    )

    expect(created.cardId).toBe('card-owner')
    expect(created.billingDay).toBe(5)
    expect(created.active).toBe(true)
    expect(created.value).toBeCloseTo(39.9)
  })

  it('updates only when owned by the user and allows toggling active status', async () => {
    const db = new InMemoryDb({
      users: [{ id: 'user-1', timezone: 'UTC' }],
      cards: [{ id: 'card-2', userId: 'user-1' }],
      subscriptions: [
        {
          id: 'sub-1',
          userId: 'user-1',
          cardId: null,
          name: 'Prime',
          value: 29.9,
          billingDay: 10,
          active: true,
          createdAt: new Date('2025-02-01T00:00:00Z'),
          updatedAt: new Date('2025-02-01T00:00:00Z'),
        },
      ],
    })

    await expect(
      updateSubscriptionForUser(
        'other-user',
        'sub-1',
        { name: 'Invalid update' },
        db as unknown as SubscriptionsClient,
      ),
    ).rejects.toBeInstanceOf(SubscriptionsError)

    const updated = await updateSubscriptionForUser(
      'user-1',
      'sub-1',
      { active: false, billingDay: 12, cardId: 'card-2' },
      db as unknown as SubscriptionsClient,
    )

    expect(updated.active).toBe(false)
    expect(updated.billingDay).toBe(12)
    expect(updated.cardId).toBe('card-2')
  })

  it('lists subscriptions ordered by creation date', async () => {
    const db = new InMemoryDb({
      users: [{ id: 'user-1', timezone: 'UTC' }],
      subscriptions: [
        {
          id: 'sub-old',
          userId: 'user-1',
          cardId: null,
          name: 'Old One',
          value: 10,
          billingDay: 1,
          active: true,
          createdAt: new Date('2025-01-01T00:00:00Z'),
          updatedAt: new Date('2025-01-02T00:00:00Z'),
        },
        {
          id: 'sub-new',
          userId: 'user-1',
          cardId: null,
          name: 'New One',
          value: 20,
          billingDay: 15,
          active: true,
          createdAt: new Date('2025-02-01T00:00:00Z'),
          updatedAt: new Date('2025-02-01T00:00:00Z'),
        },
      ],
    })

    const list = await listSubscriptionsForUser('user-1', db as unknown as SubscriptionsClient)

    expect(list).toHaveLength(2)
    expect(list[0].id).toBe('sub-new')
    expect(list[1].id).toBe('sub-old')
  })
})

describe('subscription recurring job', () => {
  it('creates monthly transaction when due and skips duplicates', async () => {
    const db = new InMemoryDb({
      users: [{ id: 'user-1', timezone: 'UTC' }],
      subscriptions: [
        {
          id: 'sub-1',
          userId: 'user-1',
          cardId: null,
          name: 'Netflix',
          value: 50,
          billingDay: 10,
          active: true,
          createdAt: new Date('2025-01-01T00:00:00Z'),
          updatedAt: new Date('2025-01-01T00:00:00Z'),
        },
      ],
    })

    const firstRun = await generateTransactionsForActiveSubscriptions({
      referenceDate: new Date('2025-02-15T12:00:00Z'),
      db: db as unknown as SubscriptionsJobClient,
    })

    expect(firstRun.created).toBe(1)
    expect(db.transactions).toHaveLength(1)
    expect(db.transactions[0].subscriptionId).toBe('sub-1')
    expect(db.transactions[0].date.toISOString()).toContain('2025-02-10')

    const secondRun = await generateTransactionsForActiveSubscriptions({
      referenceDate: new Date('2025-02-16T12:00:00Z'),
      db: db as unknown as SubscriptionsJobClient,
    })

    expect(secondRun.created).toBe(0)
    expect(secondRun.skipped).toBe(1)
    expect(db.transactions).toHaveLength(1)
  })

  it('respects billing day, clamps month length and ignores inactive subscriptions', async () => {
    const db = new InMemoryDb({
      users: [{ id: 'user-1', timezone: 'America/Sao_Paulo' }],
      subscriptions: [
        {
          id: 'sub-active',
          userId: 'user-1',
          cardId: null,
          name: 'Annual Tool',
          value: 70,
          billingDay: 31,
          active: true,
          createdAt: new Date('2025-01-01T00:00:00Z'),
          updatedAt: new Date('2025-01-01T00:00:00Z'),
        },
        {
          id: 'sub-inactive',
          userId: 'user-1',
          cardId: null,
          name: 'Paused',
          value: 15,
          billingDay: 5,
          active: false,
          createdAt: new Date('2025-01-01T00:00:00Z'),
          updatedAt: new Date('2025-01-01T00:00:00Z'),
        },
      ],
    })

    const earlyRun = await generateTransactionsForActiveSubscriptions({
      referenceDate: new Date('2025-02-20T12:00:00Z'),
      db: db as unknown as SubscriptionsJobClient,
    })

    expect(earlyRun.processed).toBe(1)
    expect(earlyRun.created).toBe(0)
    expect(db.transactions).toHaveLength(0)

    const dueRun = await generateTransactionsForActiveSubscriptions({
      referenceDate: new Date('2025-02-28T12:00:00Z'),
      db: db as unknown as SubscriptionsJobClient,
    })

    expect(dueRun.created).toBe(1)
    expect(db.transactions).toHaveLength(1)
    expect(db.transactions[0].date.toISOString()).toContain('2025-02-28')
  })
})
