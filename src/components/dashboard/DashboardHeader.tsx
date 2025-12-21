type DashboardHeaderProps = {
  userName: string
  monthLabel: string
  lastUpdatedLabel: string
}

export function DashboardHeader({ userName, monthLabel, lastUpdatedLabel }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-3xl font-semibold text-white [font-family:var(--dashboard-display-font)]">
          <span>Olá, {userName}</span>
          <span aria-hidden="true">👋</span>
        </div>
        <p className="max-w-xl text-sm text-slate-400">
          Aqui está o resumo financeiro de {monthLabel}.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 shadow-lg shadow-slate-950/30">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">
            Última atualização
          </p>
          <p className="mt-1 text-sm font-semibold">{lastUpdatedLabel}</p>
        </div>
      </div>
    </div>
  )
}
