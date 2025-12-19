import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/lib/auth'

export const Route = createFileRoute('/api/auth/[./.]')({
  loader: async ({ request }) => {
    return await auth.handler(request)
  },
})
