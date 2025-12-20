import { createAuthClient } from 'better-auth/react'

const AUTH_PATH = '/api/auth'

function resolveAuthBaseURL() {
  const viteBase = import.meta.env.VITE_BETTER_AUTH_URL as string | undefined

  if (viteBase) {
    try {
      const resolved = new URL(
        viteBase,
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
      )

      if (!resolved.pathname || resolved.pathname === '/') {
        resolved.pathname = AUTH_PATH
      }

      return resolved.toString().replace(/\/$/, '')
    } catch {
      // ignore
    }
  }

  if (typeof window !== 'undefined') {
    return new URL(AUTH_PATH, window.location.origin).toString()
  }

  const serverOrigin = process.env.BETTER_AUTH_URL
  if (serverOrigin) {
    try {
      const resolved = new URL(serverOrigin)
      if (!resolved.pathname || resolved.pathname === '/') {
        resolved.pathname = AUTH_PATH
      }
      return resolved.toString().replace(/\/$/, '')
    } catch {
      // ignore
    }
  }

  return `http://localhost:3000${AUTH_PATH}`
}

export const authClient = createAuthClient({
  baseURL: resolveAuthBaseURL(),
})

export const { useSession, signIn, signUp, signOut } = authClient

export default authClient
