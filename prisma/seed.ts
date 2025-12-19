import { PrismaPg } from '@prisma/adapter-pg'
import { hashPassword } from 'better-auth/crypto'
import { Prisma, PrismaClient } from '../src/generated/prisma/client.js'

const connectionString = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('VITE_DATABASE_URL or DATABASE_URL is required to seed the database')
}

const adapter = new PrismaPg({
  connectionString,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.transaction.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.card.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.user.deleteMany()
  await prisma.todo.deleteMany()

  const password = await hashPassword('Test123!')

  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      currency: 'BRL',
      timezone: 'America/Sao_Paulo',
    },
  })

  await prisma.account.create({
    data: {
      userId: user.id,
      providerId: 'credential',
      accountId: user.id,
      password,
    },
  })

  const card = await prisma.card.create({
    data: {
      userId: user.id,
      name: 'Everyday Card',
      type: Prisma.CardType.CREDIT,
      color: '#4f46e5',
      lastDigits: '4242',
      encryptedNumber: 'demo-encrypted',
    },
  })

  const subscription = await prisma.subscription.create({
    data: {
      userId: user.id,
      cardId: card.id,
      name: 'Spotify',
      value: new Prisma.Decimal(34.9),
      billingDay: 10,
      active: true,
    },
  })

  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        type: Prisma.TransactionType.DEBIT,
        value: new Prisma.Decimal(49.9),
        description: 'Groceries',
        category: 'Food',
        date: new Date(),
        cardId: card.id,
      },
      {
        userId: user.id,
        type: Prisma.TransactionType.DEBIT,
        value: new Prisma.Decimal(subscription.value),
        description: 'Spotify Subscription',
        category: 'Entertainment',
        date: new Date(),
        cardId: card.id,
        subscriptionId: subscription.id,
      },
      {
        userId: user.id,
        type: Prisma.TransactionType.CREDIT,
        value: new Prisma.Decimal(1500),
        description: 'Salary',
        category: 'Income',
        date: new Date(),
      },
    ],
  })

  console.log('✅ Seeded user, account, card, subscription and transactions')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
