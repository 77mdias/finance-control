import { describe, expect, it, vi } from 'vitest'
import { createCardForUser, listCardsForUser, updateCardForUser } from '@/server/cards.server'
import { InMemoryDb } from '../helpers/inMemoryDb'

vi.stubEnv('CARD_ENCRYPTION_KEY', 'base64:' + Buffer.alloc(32, 1).toString('base64'))

describe('cards server functions', () => {
  it('creates card encrypting number and exposing only last digits', async () => {
    const db = new InMemoryDb()

    const card = await createCardForUser(
      'user-1',
      {
        name: 'Cartão Teste',
        type: 'CREDIT',
        number: '4111 1111 1111 1234',
        color: '#ff00ff',
      },
      db as never,
    )

    expect(card.lastDigits).toBe('1234')
    expect(card).not.toHaveProperty('number')

    const stored = db.cards[0]
    expect(stored.encryptedNumber).toBeDefined()
    expect(stored.encryptedNumber).not.toContain('1234')
  })

  it('lists only cards of the user ordered by createdAt desc', async () => {
    const db = new InMemoryDb({
      cards: [
        { id: 'c1', userId: 'user-1', lastDigits: '0001', createdAt: new Date('2025-02-01') },
        { id: 'c2', userId: 'user-1', lastDigits: '0002', createdAt: new Date('2025-03-01') },
        { id: 'c3', userId: 'other', lastDigits: '0003', createdAt: new Date('2025-04-01') },
      ],
    })

    const cards = await listCardsForUser('user-1', db as never)

    expect(cards).toHaveLength(2)
    expect(cards[0].id).toBe('c2')
    expect(cards[1].id).toBe('c1')
  })

  it('updates only allowed fields and keeps ownership enforced', async () => {
    const db = new InMemoryDb({
      cards: [
        { id: 'c1', userId: 'user-1', name: 'Old', lastDigits: '0001', createdAt: new Date() },
      ],
    })

    await expect(
      updateCardForUser(
        'other-user',
        {
          id: 'c1',
          name: 'Hack',
        },
        db as never,
      ),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })

    const updated = await updateCardForUser(
      'user-1',
      {
        id: 'c1',
        name: 'Novo Nome',
        color: '#000',
      },
      db as never,
    )

    expect(updated.name).toBe('Novo Nome')
    expect(updated.color).toBe('#000')
  })
})
