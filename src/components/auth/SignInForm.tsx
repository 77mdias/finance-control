import { Link, useRouter } from '@tanstack/react-router'
import { Lock, Mail, Shield } from 'lucide-react'
import { useId, useMemo, useState } from 'react'

import { signIn } from '@/lib/auth-client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function isValidEmail(value: string) {
  return value.includes('@')
}

export function SignInForm() {
  const router = useRouter()

  const emailId = useId()
  const passwordId = useId()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    return isValidEmail(email) && password.length >= 8 && !isSubmitting
  }, [email, isSubmitting, password.length])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError(null)

    if (!isValidEmail(email)) {
      setFormError('Informe um e-mail válido.')
      return
    }

    if (password.length < 8) {
      setFormError('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await signIn.email({
        email,
        password,
      })

      if (result.data) {
        await router.navigate({ to: '/' })
        return
      }

      setFormError('Não foi possível entrar. Verifique suas credenciais.')
    } catch {
      setFormError('Não foi possível entrar. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-chart-4/40 shadow-sm">
            <span className="text-sm font-semibold">F</span>
          </div>
          <div className="text-lg font-semibold">Flux</div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            Controle financeiro,
            <br />
            <span className="bg-linear-to-r from-chart-1 to-chart-4 bg-clip-text text-transparent">
              sem ruído.
            </span>
          </h1>
          <p className="text-base text-muted-foreground">
            Seus ganhos, gastos e assinaturas em um só lugar.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={emailId}>E-mail</Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              id={emailId}
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder="seu@email.com"
              className="pl-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={passwordId}>Senha de acesso</Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <Input
              id={passwordId}
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              placeholder="••••••••"
              className="pl-12"
            />
          </div>
        </div>

        {formError ? <div className="text-sm text-destructive">{formError}</div> : null}

        <Button type="submit" size="lg" className="w-full rounded-xl" disabled={!canSubmit}>
          {isSubmitting ? 'Entrando…' : 'Entrar'}
          <span aria-hidden="true">→</span>
        </Button>

        <div className="flex items-center justify-between text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Modo visitante
          </Link>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Dados criptografados</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Não tem conta?{' '}
          <Link to="/signup" className="text-foreground underline underline-offset-4">
            Criar agora
          </Link>
        </div>
      </form>
    </div>
  )
}
