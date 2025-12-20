import { cn } from '@/lib/utils'

export function AuthBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-background" />

      {/* Orbs (tokens) */}
      <div className="absolute -right-24 top-10 h-64 w-64 rounded-full bg-chart-4/30 blur-3xl" />
      <div className="absolute right-10 top-44 h-80 w-80 rounded-full bg-chart-2/20 blur-3xl" />
      <div className="absolute right-20 top-72 h-10 w-10 rounded-full bg-chart-2/30 blur-xl" />
      <div className="absolute right-64 top-80 h-6 w-6 rounded-full bg-chart-4/30 blur-xl" />

      {/* Fade gradient from right to left */}
      <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent" />
    </div>
  )
}
