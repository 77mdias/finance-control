// Frontend auth client wrapper (React)
// Ajuste conforme a API real do pacote `better-auth/react`.
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || '/api/auth',
})

export default authClient
