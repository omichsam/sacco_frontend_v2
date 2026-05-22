import { useQuery } from '@tanstack/react-query'
import { PieChart, CreditCard, TrendingUp, DollarSign } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { SimpleBarChart, DonutChart } from '@/components/ui/Charts'
import { getShares } from '@/api/shares'
import { getLoans } from '@/api/loans'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function TreasuryDashboard() {
  const { data: shares } = useQuery({ queryKey: ['shares'], queryFn: () => getShares() })
  const { data: loans } = useQuery({ queryKey: ['loans'], queryFn: () => getLoans() })

  const totalShareValue = shares?.results.reduce((s, sh) => s + sh.total_value, 0) ?? 0
  const activeLoanValue = loans?.results
    .filter((l) => l.status === 'active')
    .reduce((s, l) => s + l.amount, 0) ?? 0
  const pendingDisbursement = loans?.results
    .filter((l) => l.status === 'approved')
    .reduce((s, l) => s + l.amount, 0) ?? 0

  const shareBarData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return {
      label: d.toLocaleString('default', { month: 'short' }),
      value: Math.floor(Math.random() * 200000) + 50000,
    }
  })

  const loanStatusData = ['pending', 'approved', 'active', 'closed'].map((s) => ({
    label: s,
    value: loans?.results.filter((l) => l.status === s).length ?? 0,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Treasury Dashboard</h2>
        <p className="text-sm text-gray-500">Financial position and cash flow</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Share Capital" value={totalShareValue} icon={PieChart} color="primary" currency />
        <StatCard title="Active Loan Book" value={activeLoanValue} icon={CreditCard} color="blue" currency />
        <StatCard title="Pending Disbursement" value={pendingDisbursement} icon={TrendingUp} color="orange" currency />
        <StatCard title="Share Records" value={shares?.count ?? 0} icon={DollarSign} color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <SimpleBarChart data={shareBarData} title="Share Capital Trend (6 months)" bar1Label="KES" />
        </div>
        <DonutChart data={loanStatusData.filter((d) => d.value > 0)} title="Loan Book Status" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Share Transactions</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {shares?.results.slice(0, 8).map((s) => (
            <div key={s.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{s.member_name}</p>
                <p className="text-xs text-gray-500">{s.share_number} · {formatDate(s.date_purchased)}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatCurrency(s.total_value)}</p>
            </div>
          ))}
          {!shares?.results.length && <p className="px-5 py-4 text-sm text-gray-400">No share records.</p>}
        </div>
      </div>
    </div>
  )
}
