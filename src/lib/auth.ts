import { PrismaClient } from '@prisma/client'
// NOTE: The imports below assume the package names used in the plan.
// Adjust import paths if the actual better-auth package exposes different entry points.
import betterAuth from 'better-auth'
import prismaAdapter from 'better-auth/adapters/prisma'

const prisma = new PrismaClient()

// Configuração mínima/placeholder do Better Auth.
// Ajuste providers, plugins e políticas conforme necessário.
export const auth = betterAuth({
  database: prismaAdapter(prisma as any),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      process.env.VITE_PUBLIC_BETTER_AUTH_URL ||
      'http://localhost:3000',
  ],
})

export type AuthInstance = typeof auth

// TODO: export helpers adicionais (register/login/logout wrappers) conforme necessidade
