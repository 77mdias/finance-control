import { AuthBackground } from './AuthBackground'
import { AuthCardShowcase } from './AuthCardShowcase'

import { ThemeToggle } from '@/components/theme/ThemeToggle'

import { cn } from '@/lib/utils'

export function AuthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <AuthBackground />

      <div className="relative grid min-h-dvh w-full items-center grid-cols-1 grid-rows-[auto_1fr] gap-10 px-2 sm:px-4 lg:grid-cols-[1fr_1.5fr] lg:grid-rows-1 lg:gap-0 lg:px-0">
        <div className="relative order-first px-4 pt-12 sm:px-8 lg:order-none lg:px-0 lg:pt-0">
          <AuthCardShowcase className="h-[420px] w-full lg:h-full" />
        </div>

        <div className="relative order-last px-4 pb-12 pt-4 sm:px-8 sm:pt-8 lg:order-none lg:pb-10 lg:pt-16">
          <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6 lg:right-8 lg:top-8">
            <ThemeToggle />
          </div>

          <div className={cn('mx-auto w-full max-w-md')}>{children}</div>

          <div className="mt-16 text-xs text-muted-foreground text-center">
            © 2024 Flux Finance. Privacidade em primeiro lugar.
          </div>
        </div>
      </div>
    </div>
  )
}
