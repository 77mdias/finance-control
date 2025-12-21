import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/db'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false, // MVP: desabilitado inicialmente
  },

  user: {
    additionalFields: {
      currency: {
        type: 'string',
        required: false,
        defaultValue: 'BRL',
      },
      timezone: {
        type: 'string',
        required: false,
        defaultValue: 'America/Sao_Paulo',
      },
      lastLoginAt: {
        type: 'date',
        required: false,
      },
      deletionScheduledAt: {
        type: 'date',
        required: false,
      },
      isDisabled: {
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // Atualiza a cada 1 dia
  },

  advanced: {
    cookiePrefix: 'finance-control',
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  trustedOrigins: [process.env.BETTER_AUTH_URL || 'http://localhost:3000'],

  secret: process.env.BETTER_AUTH_SECRET!,
})

export type Auth = typeof auth
