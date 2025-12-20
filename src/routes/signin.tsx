import { createFileRoute } from '@tanstack/react-router'

import { AuthPageLayout } from '@/components/auth/AuthPageLayout'
import { AuthRedirectIfAuthenticated } from '@/components/auth/AuthRedirectIfAuthenticated'
import { SignInForm } from '@/components/auth/SignInForm'

export const Route = createFileRoute('/signin')({
  component: SignInRoute,
})

function SignInRoute() {
  return (
    <AuthPageLayout>
      <AuthRedirectIfAuthenticated />
      <SignInForm />
    </AuthPageLayout>
  )
}
