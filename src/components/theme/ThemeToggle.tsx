import { Moon, Sun } from 'lucide-react'

import { useTheme } from './ThemeProvider'

import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Alternar tema"
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/50 text-foreground backdrop-blur',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  )
}
