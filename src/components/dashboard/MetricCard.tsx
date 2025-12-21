import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type MetricDelta = {
  value: string
  trend: 'up' | 'down'
  label?: string
}

type MetricCardProps = {
  label: string
  value: string
  icon: ReactNode
  variant?: 'balance' | 'income' | 'expense'
  delta?: MetricDelta
  showEmptyDelta?: boolean
}

const variantStyles: Record<NonNullable<MetricCardProps['variant']>, string> = {
  balance: 'border-slate-800 bg-slate-900/70 text-slate-100',
  income: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-50',
  expense: 'border-rose-500/30 bg-rose-500/10 text-rose-50',
}

const iconStyles: Record<NonNullable<MetricCardProps['variant']>, string> = {
  balance: 'bg-slate-800/70 text-slate-200',
  income: 'bg-emerald-500/15 text-emerald-200',
  expense: 'bg-rose-500/15 text-rose-200',
}

export function MetricCard({
  label,
  value,
  icon,
  variant = 'balance',
  delta,
  showEmptyDelta = false,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl border px-5 py-5 shadow-lg shadow-slate-950/30',
        variantStyles[variant],
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <p className="text-2xl font-semibold text-white [font-family:var(--dashboard-display-font)]">
            {value}
          </p>
        </div>
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-2xl',
            iconStyles[variant],
          )}
        >
          {icon}
        </div>
      </div>

      {delta ? (
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[0.7rem] font-semibold',
              delta.trend === 'up'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                : 'border-rose-500/40 bg-rose-500/10 text-rose-200',
            )}
          >
            {delta.trend === 'up' ? '↑' : '↓'} {delta.value}
          </span>
          <span>{delta.label ?? 'vs mês anterior'}</span>
        </div>
      ) : null}
      {!delta && showEmptyDelta ? (
        <p className="text-xs text-slate-500">Sem comparativo disponível</p>
      ) : null}
    </div>
  )
}
