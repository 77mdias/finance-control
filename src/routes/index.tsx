import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Navigate, createFileRoute, redirect } from '@tanstack/react-router'
import { motion } from 'framer-motion'

import { useMemo } from 'react'
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'
import type {
  TransactionsFilters,
  TransactionsListResponse,
  TransactionsSummary,
  TransactionsSummaryFilters,
} from '@/server/transactions.server'
import {
  transactionsQueryOptions,
  transactionsSummaryQueryOptions,
} from '@/server/transactions.server'

import {
  DashboardHeader,
  DashboardShell,
  DashboardSidebar,
  MetricCard,
  TransactionsList,
} from '@/components/dashboard'
import { useSession } from '@/lib/auth-client'

type DashboardSummaryConfig = {
  summaryFilters: TransactionsSummaryFilters
  previousSummaryFilters: TransactionsSummaryFilters
  recentFilters: TransactionsFilters
}

function getDefaultSummaryFilters(): TransactionsSummaryFilters {
  const now = new Date()
  return {
    month: now.getUTCMonth() + 1,
    year: now.getUTCFullYear(),
  }
}

function getPreviousSummaryFilters(
  filters: TransactionsSummaryFilters,
): TransactionsSummaryFilters {
  if (filters.month === 1) {
    return {
      month: 12,
      year: filters.year - 1,
    }
  }

  return {
    month: filters.month - 1,
    year: filters.year,
  }
}

function getRecentTransactionsFilters(filters: TransactionsSummaryFilters): TransactionsFilters {
  return {
    month: filters.month,
    year: filters.year,
    page: 1,
    perPage: 6,
  }
}

function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatMonthLabel(month: number, year: number) {
  const label = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function formatLastUpdatedLabel() {
  const time = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
  return `Hoje às ${time}`
}

function getPercentageDelta(current: number, previous: number) {
  if (previous <= 0) return null
  const delta = ((current - previous) / previous) * 100
  if (!Number.isFinite(delta)) return null
  return {
    value: `${Math.abs(delta).toFixed(0)}%`,
    trend: delta >= 0 ? ('up' as const) : ('down' as const),
  }
}

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const summaryFilters = getDefaultSummaryFilters()
    const previousSummaryFilters = getPreviousSummaryFilters(summaryFilters)
    const recentFilters = getRecentTransactionsFilters(summaryFilters)
    try {
      await Promise.all([
        context.queryClient.ensureQueryData(transactionsSummaryQueryOptions(summaryFilters)),
        context.queryClient.ensureQueryData(
          transactionsSummaryQueryOptions(previousSummaryFilters),
        ),
        context.queryClient.ensureQueryData(transactionsQueryOptions(recentFilters)),
      ])
    } catch (error) {
      if (error instanceof Response && error.status === 401) {
        throw redirect({ to: '/signin' })
      }
      throw error
    }
    const config: DashboardSummaryConfig = {
      summaryFilters,
      previousSummaryFilters,
      recentFilters,
    }
    return config
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { summaryFilters, previousSummaryFilters, recentFilters } = Route.useLoaderData()
  const queryClient = useQueryClient()

  const { data: session, isPending: isSessionPending } = useSession()

  const summaryQueryOptions = useMemo(
    () => transactionsSummaryQueryOptions(summaryFilters),
    [summaryFilters],
  )

  const previousSummaryQueryOptions = useMemo(
    () => transactionsSummaryQueryOptions(previousSummaryFilters),
    [previousSummaryFilters],
  )

  const recentQueryOptions = useMemo(() => transactionsQueryOptions(recentFilters), [recentFilters])

  const summaryQuery = useQuery({
    ...summaryQueryOptions,
    initialData: () => queryClient.getQueryData<TransactionsSummary>(summaryQueryOptions.queryKey),
  })

  const previousSummaryQuery = useQuery({
    ...previousSummaryQueryOptions,
    initialData: () =>
      queryClient.getQueryData<TransactionsSummary>(previousSummaryQueryOptions.queryKey),
  })

  const recentQuery = useQuery({
    ...recentQueryOptions,
    initialData: () =>
      queryClient.getQueryData<TransactionsListResponse>(recentQueryOptions.queryKey),
  })

  if (isSessionPending) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">Carregando sessão...</p>
      </div>
    )
  }

  const hasUnauthorizedError = [summaryQuery.error, previousSummaryQuery.error, recentQuery.error]
    .filter(Boolean)
    .some((error) => error instanceof Response && error.status === 401)

  if (!session || hasUnauthorizedError) {
    return <Navigate to="/signin" />
  }

  const summary = summaryQuery.data ?? {
    income: 0,
    expenses: 0,
    balance: 0,
    month: summaryFilters.month,
    year: summaryFilters.year,
  }

  const previousSummary = previousSummaryQuery.data
  const incomeDelta = previousSummary
    ? getPercentageDelta(summary.income, previousSummary.income)
    : null
  const expenseDelta = previousSummary
    ? getPercentageDelta(summary.expenses, previousSummary.expenses)
    : null

  const monthLabel = formatMonthLabel(summary.month, summary.year)
  const lastUpdatedLabel = formatLastUpdatedLabel()
  const displayName = session.user.name || session.user.email.split('@')[0]

  const animationContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  }

  const animationItem = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <DashboardShell>
      <DashboardSidebar />
      <motion.main
        className="flex-1 space-y-8 px-6 py-8 md:px-10"
        variants={animationContainer}
        initial="hidden"
        animate="show"
      >
        <motion.section variants={animationItem}>
          <DashboardHeader
            userName={displayName}
            monthLabel={monthLabel}
            lastUpdatedLabel={lastUpdatedLabel}
          />
        </motion.section>

        <motion.section variants={animationItem}>
          <div className="grid gap-4 lg:grid-cols-3">
            <MetricCard
              label="Saldo Atual"
              value={formatCurrencyBRL(summary.balance)}
              icon={<Wallet className="h-5 w-5" />}
              variant="balance"
            />
            <MetricCard
              label="Ganhos do Mês"
              value={formatCurrencyBRL(summary.income)}
              icon={<ArrowUpRight className="h-5 w-5" />}
              variant="income"
              delta={incomeDelta ?? undefined}
              showEmptyDelta
            />
            <MetricCard
              label="Gastos do Mês"
              value={formatCurrencyBRL(summary.expenses)}
              icon={<ArrowDownRight className="h-5 w-5" />}
              variant="expense"
              delta={expenseDelta ?? undefined}
              showEmptyDelta
            />
          </div>
        </motion.section>

        <motion.section variants={animationItem}>
          <TransactionsList
            items={recentQuery.data?.items ?? []}
            isFetching={recentQuery.isFetching}
            month={summary.month}
            year={summary.year}
          />
        </motion.section>
      </motion.main>
    </DashboardShell>
  )
}
