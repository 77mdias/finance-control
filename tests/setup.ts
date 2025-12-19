import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup após cada teste
afterEach(() => {
  cleanup()
})

// Mock de variáveis de ambiente para testes
process.env.VITE_DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.BETTER_AUTH_SECRET = 'test-secret-key-for-testing-only-min-32-chars'
process.env.BETTER_AUTH_URL = 'http://localhost:3000'

// Mock global de fetch (se necessário para testes de integração)
if (!global.fetch) {
  global.fetch = vi.fn()
}
