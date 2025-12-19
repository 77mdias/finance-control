import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSession, requireSession, getCurrentUser, requireUser } from '@/lib/session'
import { auth } from '@/lib/auth'

// Mock do Better Auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

describe('Session Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSession', () => {
    it('deve retornar sessão válida', async () => {
      const mockSession = {
        token: 'abc123',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      const request = new Request('http://localhost', {
        headers: { cookie: 'finance-control-session=abc123' },
      })

      const result = await getSession(request)

      expect(result).toEqual(mockSession)
      expect(auth.api.getSession).toHaveBeenCalledWith({
        headers: request.headers,
      })
    })

    it('deve retornar null para sessão inválida', async () => {
      vi.mocked(auth.api.getSession).mockRejectedValue(new Error('Invalid'))

      const request = new Request('http://localhost')
      const result = await getSession(request)

      expect(result).toBeNull()
    })

    it('deve retornar null quando Better Auth lança erro', async () => {
      vi.mocked(auth.api.getSession).mockRejectedValue(new Error('Session expired'))

      const request = new Request('http://localhost', {
        headers: { cookie: 'finance-control-session=expired' },
      })

      const result = await getSession(request)

      expect(result).toBeNull()
    })
  })

  describe('requireSession', () => {
    it('deve lançar erro se sessão inválida', async () => {
      vi.mocked(auth.api.getSession).mockRejectedValue(new Error('Invalid'))

      const request = new Request('http://localhost')

      await expect(requireSession(request)).rejects.toThrow()
    })

    it('deve retornar sessão se válida', async () => {
      const mockSession = {
        token: 'abc123',
        user: { id: '1', email: 'test@example.com' },
      }
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      const request = new Request('http://localhost', {
        headers: { cookie: 'finance-control-session=abc123' },
      })

      const result = await requireSession(request)
      expect(result).toEqual(mockSession)
    })

    it('deve lançar Response com status 401 se sessão nula', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as any)

      const request = new Request('http://localhost')

      try {
        await requireSession(request)
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(Response)
        if (error instanceof Response) {
          expect(error.status).toBe(401)
        }
      }
    })
  })

  describe('getCurrentUser', () => {
    it('deve retornar usuário se sessão válida', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      }
      const mockSession = {
        token: 'abc123',
        user: mockUser,
      }
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      const request = new Request('http://localhost', {
        headers: { cookie: 'finance-control-session=abc123' },
      })

      const result = await getCurrentUser(request)
      expect(result).toEqual(mockUser)
    })

    it('deve retornar null se não há sessão', async () => {
      vi.mocked(auth.api.getSession).mockRejectedValue(new Error('No session'))

      const request = new Request('http://localhost')
      const result = await getCurrentUser(request)

      expect(result).toBeNull()
    })

    it('deve retornar null se sessão não tem usuário', async () => {
      const mockSession = {
        token: 'abc123',
        user: null,
      }
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      const request = new Request('http://localhost')
      const result = await getCurrentUser(request)

      expect(result).toBeNull()
    })
  })

  describe('requireUser', () => {
    it('deve lançar erro se sem usuário', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        token: 'abc',
        user: null,
      } as any)

      const request = new Request('http://localhost')

      try {
        await requireUser(request)
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(Response)
        if (error instanceof Response) {
          expect(error.status).toBe(401)
        }
      }
    })

    it('deve retornar usuário se válido', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        currency: 'BRL',
        timezone: 'America/Sao_Paulo',
      }
      const mockSession = {
        token: 'abc123',
        user: mockUser,
      }
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)

      const request = new Request('http://localhost', {
        headers: { cookie: 'finance-control-session=abc123' },
      })

      const result = await requireUser(request)
      expect(result).toEqual(mockUser)
    })

    it('deve lançar erro se sessão inválida', async () => {
      vi.mocked(auth.api.getSession).mockRejectedValue(new Error('Invalid session'))

      const request = new Request('http://localhost')

      try {
        await requireUser(request)
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(Response)
        if (error instanceof Response) {
          expect(error.status).toBe(401)
        }
      }
    })
  })

  describe('Integration scenarios', () => {
    it('deve lidar corretamente com request sem headers', async () => {
      vi.mocked(auth.api.getSession).mockRejectedValue(new Error('No cookies'))

      const request = new Request('http://localhost')

      const session = await getSession(request)
      const user = await getCurrentUser(request)

      expect(session).toBeNull()
      expect(user).toBeNull()
    })

    it('deve extrair user corretamente de sessão complexa', async () => {
      const mockComplexSession = {
        id: 'session-id',
        token: 'complex-token',
        expiresAt: new Date('2025-12-24'),
        user: {
          id: 'user-123',
          email: 'complex@example.com',
          name: 'Complex User',
          currency: 'USD',
          timezone: 'America/New_York',
          emailVerified: new Date('2025-01-01'),
          image: 'https://example.com/avatar.jpg',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-12-17'),
        },
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(mockComplexSession as any)

      const request = new Request('http://localhost', {
        headers: { cookie: 'finance-control-session=complex-token' },
      })

      const user = await getCurrentUser(request)

      expect(user).toEqual(mockComplexSession.user)
      expect(user?.currency).toBe('USD')
      expect(user?.timezone).toBe('America/New_York')
    })
  })
})
