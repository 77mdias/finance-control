import { createFileRoute } from '@tanstack/react-router'
import { generateTransactionsForActiveSubscriptions } from '@/jobs/subscriptions'

export const Route = createFileRoute('/api/subscriptions/cron')({
  loader: async ({ request }) => {
    // Protege para ser chamado apenas pelo scheduler da Vercel (envia header x-vercel-cron)
    const isCron = request.headers.get('x-vercel-cron')
    if (!isCron) {
      return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 })
    }

    const result = await generateTransactionsForActiveSubscriptions()

    return new Response(JSON.stringify({ ok: true, ...result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
