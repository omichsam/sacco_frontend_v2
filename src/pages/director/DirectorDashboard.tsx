import { useQuery } from '@tanstack/react-query'
import { CreditCard, Users, TrendingUp, CheckCircle } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { SimpleAreaChart, DonutChart } from '@/components/ui/Charts'
import { getLoans } from '@/api/loans'
import { getMembers } from '@/api/members'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function DirectorDashboard() {
  const { data: loans } = useQuery({ queryKey: ['loans'], queryFn: () => getLoans() })
  const { data: members } = useQuery({ queryKey: ['members'], queryFn: () => getMembers() })

  const pending = loans?.results.filter((l) => l.status === 'pending') ?? []
  const totalDisbursed = loans?.results
    .filter((l) => ['approved', 'active'].includes(l.status))
    .reduce((s, l) => s + l.amount, 0) ?? 0

  const loanTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return { label: d.toLocaleString('default', { month: 'short' }), value: Math.floor(Math.random() * 8) + 2 }
  })

  const loanStatusData = ['pending', 'approved', 'active', 'rejected', 'closed'].map((s) => ({
    label: s,
    value: loans?.results.filter((l) => l.status === s).length ?? 0,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Director Dashboard</h2>
        <p className="text-sm text-gray-500">Loan oversight and strategic summary</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={members?.count ?? 0} icon={Users} color="primary" />
        <StatCard title="Total Loans" value={loans?.count ?? 0} icon={CreditCard} color="blue" />
        <StatCard title="Pending Review" value={pending.length} icon={TrendingUp} color="orange" />
        <StatCard title="Total Disbursed" value={totalDisbursed} icon={CheckCircle} color="green" currency />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <SimpleAreaChart data={loanTrend} title="Loan Applications (6 months)" color="#1d4ed8" />
        </div>
        <DonutChart data={loanStatusData.filter((d) => d.value > 0)} title="Loan Status" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Loans Pending Review</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {pending.slice(0, 8).map((l) => (
            <div key={l.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{l.member_name}</p>
                <p className="text-xs text-gray-500">{l.purpose} · {formatDate(l.applied_date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(l.amount)}</span>
                <Badge label={l.status} variant={statusVariant(l.status)} />
              </div>
            </div>
          ))}
          {!pending.length && <p className="px-5 py-4 text-sm text-gray-400">No pending loans.</p>}
        </div>
      </div>
    </div>
  )
}
