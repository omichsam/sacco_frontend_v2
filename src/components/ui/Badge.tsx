import { cn } from '@/lib/utils'

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'default'

const variants: Record<Variant, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  default: 'bg-gray-100 text-gray-700',
}

interface Props {
  label: string
  variant?: Variant
  className?: string
}

export function Badge({ label, variant = 'default', className }: Props) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {label}
    </span>
  )
}

export function statusVariant(status: string): Variant {
  const map: Record<string, Variant> = {
    active: 'success',
    approved: 'success',
    pending: 'warning',
    rejected: 'danger',
    inactive: 'default',
    suspended: 'danger',
    closed: 'default',
  }
  return map[status] ?? 'default'
}
