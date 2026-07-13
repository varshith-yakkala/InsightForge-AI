import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'primary' | 'secondary'

const variantStyles: Record<Variant, string> = {
  default: 'bg-white/5 text-text-light border-border-light',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  primary: 'bg-primary/10 text-[#a5b4fc] border-primary/30',
  secondary: 'bg-secondary/10 text-secondary border-secondary/30',
}

export function Badge({
  children,
  variant = 'default',
  className,
  dot,
}: {
  children: ReactNode
  variant?: Variant
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none',
        variantStyles[variant],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', variant === 'default' ? 'bg-text-muted' : 'bg-current')} />}
      {children}
    </span>
  )
}
