import { createFileRoute } from '@tanstack/react-router'

import { AuthPageLayout } from '@/components/auth/AuthPageLayout'
import { AuthRedirectIfAuthenticated } from '@/components/auth/AuthRedirectIfAuthenticated'
import { SignUpForm } from '@/components/auth/SignUpForm'

export const Route = createFileRoute('/signup')({
  component: SignUpRoute,
})

function SignUpRoute() {
  return (
    <AuthPageLayout>
      <AuthRedirectIfAuthenticated />
      <SignUpForm />
    </AuthPageLayout>
  )
}
