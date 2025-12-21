import type { ReactNode } from 'react'

type DashboardShellProps = {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 [font-family:var(--dashboard-font)]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute top-64 right-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative flex min-h-screen flex-col md:flex-row">{children}</div>
      </div>
    </div>
  )
}
