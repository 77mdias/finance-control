import { Link } from '@tanstack/react-router'
import { ArrowLeftRight, LayoutDashboard } from 'lucide-react'

import { cn } from '@/lib/utils'

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/transactions',
    label: 'Transações',
    icon: ArrowLeftRight,
  },
]

export function DashboardSidebar() {
  return (
    <aside className="w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20">
            F
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Flux</p>
            <p className="text-xs text-slate-500">Finance Control</p>
          </div>
        </div>
        <div className="md:hidden rounded-full border border-slate-800 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">
          MVP
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 px-4 pb-6 md:flex-col md:px-5">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm text-slate-300 transition hover:border-slate-800 hover:bg-slate-900/60 hover:text-white',
                'md:w-full',
              )}
              activeProps={{
                className:
                  'flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.15)] md:w-full',
              }}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="hidden md:mt-auto md:block md:px-6 md:pb-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-400">
          MVP financeiro com foco em fluxo de caixa mensal.
        </div>
      </div>
    </aside>
  )
}
