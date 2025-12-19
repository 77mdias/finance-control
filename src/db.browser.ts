export function getClient(): never {
  throw new Error('Database client is server-only')
}

export function getPool(): never {
  throw new Error('Database pool is server-only')
}

export function getPrisma(): never {
  throw new Error('Prisma client is server-only')
}

// @ts-expect-error prisma is server-only
export const prisma = undefined
