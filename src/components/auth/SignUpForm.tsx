import { Link, useRouter } from '@tanstack/react-router'
import { Mail, Shield, User } from 'lucide-react'
import { useId, useMemo, useState } from 'react'

import { signUp } from '@/lib/auth-client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function isValidEmail(value: string) {
  return value.includes('@')
}

export function SignUpForm() {
  const router = useRouter()

  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && isValidEmail(email) && password.length >= 8 && !isSubmitting
  }, [email, isSubmitting, name, password.length])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError(null)

    if (name.trim().length < 2) {
      setFormError('Informe seu nome.')
      return
    }

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
      const result = await signUp.email({
        name: name.trim(),
        email,
        password,
      })

      if (result.data) {
        await router.navigate({ to: '/' })
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
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Criar conta</h1>
        <p className="text-base text-muted-foreground">Leva menos de um minuto.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={nameId}>Nome</Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
            <Input
              id={nameId}
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Seu nome"
              className="pl-12"
            />
          </div>
        </div>

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
          <Label htmlFor={passwordId}>Senha</Label>
          <Input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            placeholder="••••••••"
          />
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
