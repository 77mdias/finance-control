import { motion } from 'framer-motion'
import { CreditCard, Music2, TrendingUp, Wallet } from 'lucide-react'

import { cn } from '@/lib/utils'

function floatTransition(delay: number) {
  return {
    duration: 6,
    ease: 'easeInOut' as const,
    repeat: Infinity,
    repeatType: 'mirror' as const,
    delay,
  }
}

export function AuthCardShowcase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative h-full w-full overflow-visible flex flex-col items-center gap-5 px-2 pt-2 lg:block lg:h-full lg:w-full lg:min-h-[540px] xl:min-h-[640px]',
        className,
      )}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 hidden lg:block" />

      {/* Summary card */}
      <motion.div
        className="relative w-full max-w-sm rounded-2xl border border-border/20 bg-card/80 p-4 shadow-xl backdrop-blur lg:absolute lg:right-10 lg:top-12 lg:w-65 lg:border-border/30 lg:bg-card/70"
        animate={{ y: [0, -6, 0] }}
        transition={floatTransition(0)}
      >
        <div className="flex items-start justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/30">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="text-xs text-muted-foreground">Ativos Totais</span>
        </div>
        <div className="mt-3 text-lg font-semibold">R$ 187.920,00</div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <div className="inline-flex items-center gap-1 text-chart-2">
            <TrendingUp className="h-3 w-3" />
            <span>+9.1% este mês</span>
          </div>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-muted">
          <div className="h-2 w-[75%] rounded-full bg-chart-2" />
        </div>
      </motion.div>

      {/* Credit card */}
      <motion.div
        className="relative w-full max-w-sm rounded-2xl border border-border/30 bg-chart-4/70 p-5 shadow-2xl backdrop-blur lg:absolute lg:right-56 lg:top-56 lg:w-[320px]"
        animate={{ y: [0, 10, 0] }}
        transition={floatTransition(0.2)}
      >
        <div className="flex items-start justify-between">
          <div className="h-4 w-10 rounded bg-background/20" />
          <div className="text-xs font-medium tracking-[0.2em] text-foreground/80">NOISE</div>
        </div>
        <div className="mt-4 font-mono text-base tracking-[0.22em] text-foreground/90">
          **** **** **** 8842
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-[0.15em] text-foreground/70">
              Titular
            </div>
            <div className="text-sm font-medium">ALEXANDRE SILVA</div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-[10px] uppercase tracking-[0.15em] text-foreground/70">
              Validade
            </div>
            <div className="text-sm font-medium">09/28</div>
          </div>
          <CreditCard className="h-6 w-6 text-foreground/80" />
        </div>
      </motion.div>

      {/* Subscription card */}
      <motion.div
        className="relative w-full max-w-sm rounded-2xl border border-border/20 bg-card/80 p-4 shadow-xl backdrop-blur lg:absolute lg:right-72 lg:top-130 lg:w-75"
        animate={{ y: [0, -6, 0] }}
        transition={floatTransition(0.4)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-2/20 text-chart-2">
              <Music2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium">Spotify Premium</div>
              <div className="text-xs text-muted-foreground">Assinatura Mensal</div>
            </div>
          </div>
          <div className="text-sm font-semibold">- R$ 21,90</div>
        </div>
      </motion.div>
    </div>
  )
}
