import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, Navigate, createFileRoute, redirect } from '@tanstack/react-router'

import { useMemo } from 'react'
import type { TransactionsFilters, TransactionsListResponse } from '@/server/transactions.server'
import { transactionsQueryOptions } from '@/server/transactions.server'

import { useSession } from '@/lib/auth-client'

function getDefaultDashboardFilters(): TransactionsFilters {
  const now = new Date()
  return {
    month: now.getUTCMonth() + 1,
    year: now.getUTCFullYear(),
    page: 1,
    perPage: 5,
  }
}

function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const filters = getDefaultDashboardFilters()
    try {
      await context.queryClient.ensureQueryData(transactionsQueryOptions(filters))
    } catch (error) {
      if (error instanceof Response && error.status === 401) {
        throw redirect({ to: '/signin' })
      }
      throw error
    }
    return { filters }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { filters } = Route.useLoaderData()
  const queryClient = useQueryClient()

  const { data: session, isPending: isSessionPending } = useSession()

  const queryOptions = useMemo(() => transactionsQueryOptions(filters), [filters])

  const { data, error, isFetching } = useQuery({
    ...queryOptions,
    initialData: () => queryClient.getQueryData<TransactionsListResponse>(queryOptions.queryKey),
  })

  if (isSessionPending) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">Carregando sessão...</p>
      </div>
    )
  }

  if (!session || (error instanceof Response && error.status === 401)) {
    return <Navigate to="/signin" />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Olá, <span className="text-slate-200">{session.user.name}</span>. Aqui vai um resumo
            rápido do mês.
          </p>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 shadow-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-slate-100">Transações recentes</h2>
              <p className="text-xs text-slate-500">
                {filters.month}/{filters.year} • {isFetching ? 'Atualizando...' : 'Sincronizado'}
              </p>
            </div>
            <Link
              to="/transactions"
              className="text-sm text-slate-200 hover:text-white underline underline-offset-4"
            >
              Ver todas
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {!data || data.items.length === 0 ? (
              <div className="px-5 py-6 text-slate-500 text-sm">
                Nenhuma transação encontrada para o período.
              </div>
            ) : (
              data.items.map((transaction) => (
                <article
                  key={transaction.id}
                  className="px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          transaction.type === 'CREDIT'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {transaction.type === 'CREDIT' ? 'Crédito' : 'Débito'}
                      </span>
                      <span className="text-slate-200 font-semibold truncate">
                        {transaction.description}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                      <span>{transaction.category}</span>
                      <span aria-hidden="true">•</span>
                      <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-base font-semibold ${
                        transaction.type === 'CREDIT' ? 'text-emerald-300' : 'text-rose-300'
                      }`}
                    >
                      {formatCurrencyBRL(transaction.value)}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
