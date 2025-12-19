import { auth } from './auth'
import type { Session, User } from 'better-auth/types'

/**
 * Valida sessão a partir do request
 * Retorna null se inválida
 */
export async function getSession(request: Request): Promise<Session | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    return session
  } catch {
    return null
  }
}

/**
 * Requer sessão válida, lança erro se inválida
 */
export async function requireSession(request: Request): Promise<Session> {
  const session = await getSession(request)
  if (!session) {
    throw new Response('Unauthorized', { status: 401 })
  }
  return session
}

/**
 * Obtém usuário atual da sessão
 */
export async function getCurrentUser(request: Request): Promise<User | null> {
  const session = await getSession(request)
  return session?.user ?? null
}

/**
 * Requer usuário autenticado
 */
export async function requireUser(request: Request): Promise<User> {
  const user = await getCurrentUser(request)
  if (!user) {
    throw new Response('Unauthorized', { status: 401 })
  }
  return user
}
