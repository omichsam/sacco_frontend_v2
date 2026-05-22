import { cn, formatCurrency } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  value: number | string
  icon: LucideIcon
  trend?: { value: number; label: string }
  currency?: boolean
  color?: 'primary' | 'blue' | 'green' | 'orange'
}

const colorMap = {
  primary: 'bg-[#800000]/10 text-[#800000]',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
}

export function StatCard({ title, value, icon: Icon, trend, currency, color = 'primary' }: Props) {
  const displayValue = currency && typeof value === 'number' ? formatCurrency(value) : value

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{displayValue}</p>
          {trend && (
            <p className={cn('text-xs mt-1', trend.value >= 0 ? 'text-green-600' : 'text-red-500')}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colorMap[color])}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}
