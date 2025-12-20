import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

import { useSession } from '@/lib/auth-client'

export function AuthRedirectIfAuthenticated() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && session) {
      void router.navigate({ to: '/' })
    }
  }, [isPending, router, session])

  return null
}
