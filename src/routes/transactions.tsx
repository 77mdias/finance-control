import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import type { TransactionsListResponse } from '@/server/transactions.server'
import { normalizeTransactionFilters, transactionsQueryOptions } from '@/server/transactions.server'

export const Route = createFileRoute('/transactions')({
  validateSearch: (search) => normalizeTransactionFilters(search),
  loader: async ({ context, search }) => {
    const filters = normalizeTransactionFilters(search)
    await context.queryClient.ensureQueryData(transactionsQueryOptions(filters))
    return { filters }
  },
  component: TransactionsPage,
})

function TransactionsPage() {
  const { filters } = Route.useLoaderData()
  const queryClient = useQueryClient()

  const queryOptions = useMemo(() => transactionsQueryOptions(filters), [filters])

  const { data, isFetching } = useQuery({
    ...queryOptions,
    initialData: () => queryClient.getQueryData<TransactionsListResponse>(queryOptions.queryKey),
  })

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">Carregando transações...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-sm text-slate-400">
            Server Functions com cache do QueryClient (TanStack Router loader) e paginação no
            servidor.
          </p>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 shadow-xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
            <div className="text-sm text-slate-300">
              {data.total} registro{data.total === 1 ? '' : 's'} • página {data.page} (
              {data.perPage} por página)
            </div>
            <div className="text-xs text-slate-500">
              {isFetching ? 'Atualizando...' : 'Sincronizado com o servidor'}
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {data.items.length === 0 && (
              <div className="px-5 py-6 text-slate-500 text-sm">Nenhuma transação encontrada.</div>
            )}

            {data.items.map((transaction) => (
              <article
                key={transaction.id}
                className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-900 transition-colors"
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
                    <span className="text-slate-300 font-semibold truncate">
                      {transaction.description}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                    <span>{transaction.category}</span>
                    <span aria-hidden="true">•</span>
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    {transaction.cardId ? (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>Cartão: {transaction.cardId}</span>
                      </>
                    ) : null}
                    {transaction.subscriptionId ? (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>Assinatura: {transaction.subscriptionId}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${
                      transaction.type === 'CREDIT' ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(transaction.value)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Atualizado em {new Date(transaction.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
