import { Link, useRouter } from '@tanstack/react-router'
import { Lock, Shield } from 'lucide-react'
import { useId, useMemo, useState } from 'react'

import { signUp } from '@/lib/auth-client'
import { LOCAL_AUTH_IDENTIFIER } from '@/lib/auth-constants'
import { touchUserActivity } from '@/server/auth.server'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignUpForm() {
  const router = useRouter()

  const passwordId = useId()

  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    return password.length >= 8 && !isSubmitting
  }, [isSubmitting, password.length])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError(null)

    if (password.length < 8) {
      setFormError('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await signUp.email({
        name: 'Owner',
        email: LOCAL_AUTH_IDENTIFIER,
        password,
      })

      if (result.data) {
        try {
          await touchUserActivity()
        } catch {
          // best-effort metadata update
        }
        await router.navigate({ to: '/' })
        return
      }

      const errorMessage = result.error.message
      if (errorMessage.toLowerCase().includes('unique')) {
        setFormError('A senha única já foi definida. Use "Entrar" para acessar.')
        return
      }

      setFormError('Não foi possível criar sua conta. Tente novamente.')
    } catch {
      setFormError('Não foi possível criar sua conta. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Definir senha única</h1>
        <p className="text-base text-muted-foreground">
          Não há e-mail nem nome. Guarde a senha; sem ela a conta é apagada após 60 dias sem acesso.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={passwordId}>Senha</Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <Input
              id={passwordId}
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              placeholder="Defina a senha única"
              className="pl-12"
            />
          </div>
        </div>

        {formError ? <div className="text-sm text-destructive">{formError}</div> : null}

        <Button type="submit" size="lg" className="w-full rounded-xl" disabled={!canSubmit}>
          {isSubmitting ? 'Criando…' : 'Criar conta'}
        </Button>

        <div className="flex items-center justify-between text-sm">
          <Link
            to="/signin"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Já tenho conta
          </Link>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Dados criptografados</span>
          </div>
        </div>
      </form>
    </div>
  )
}
