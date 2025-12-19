import { Pool, neon } from '@neondatabase/serverless'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

let client: ReturnType<typeof neon>
let pool: Pool | null = null
let prismaInstance: PrismaClient | null = null

export async function getClient() {
  const url = process.env.VITE_DATABASE_URL
  if (url == null || url === '') return undefined

  // `client` is lazily initialized; disable the unnecessary-condition rule here
  // because the type system doesn't model this runtime laziness precisely.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!client) {
    client = await neon(url)
  }

  return client
}

export function getPool(): Pool {
  const url = process.env.VITE_DATABASE_URL
  if (url == null || url === '') {
    throw new Error('VITE_DATABASE_URL is not set')
  }

  if (!pool) {
    pool = new Pool({ connectionString: url })
  }

  return pool
}

export function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    const adapter = new PrismaPg(getPool())
    prismaInstance = new PrismaClient({ adapter })
  }
  return prismaInstance
}

export const prisma = getPrisma()
