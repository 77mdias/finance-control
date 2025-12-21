import { Link } from '@tanstack/react-router'

import type { TransactionDto } from '@/server/transactions.server'

type TransactionsListProps = {
  items: Array<TransactionDto>
  isFetching?: boolean
  month: number
  year: number
}

function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function TransactionsList({ items, isFetching, month, year }: TransactionsListProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-slate-950/40">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Transações recentes</h2>
          <p className="text-xs text-slate-500">
            {month}/{year} • {isFetching ? 'Atualizando...' : 'Sincronizado'}
          </p>
        </div>
        <Link
          to="/transactions"
          className="text-sm text-slate-200 underline underline-offset-4 transition hover:text-white"
        >
          Ver todas
        </Link>
      </div>

      <div className="divide-y divide-slate-800">
        {items.length === 0 ? (
          <div className="px-5 py-6 text-sm text-slate-500">
            Nenhuma transação encontrada para o período.
          </div>
        ) : (
          items.map((transaction) => (
            <article
              key={transaction.id}
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-900/60"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-1 text-xs ${
                      transaction.type === 'CREDIT'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                    }`}
                  >
                    {transaction.type === 'CREDIT' ? 'Crédito' : 'Débito'}
                  </span>
                  <span className="truncate text-sm font-semibold text-slate-200">
                    {transaction.description}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
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
  )
}
