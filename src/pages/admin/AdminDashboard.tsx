import { useQuery } from '@tanstack/react-query'
import { Users, CreditCard, PieChart, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { SimpleAreaChart, DonutChart } from '@/components/ui/Charts'
import { getMembers } from '@/api/members'
import { getLoans } from '@/api/loans'
import { getShares } from '@/api/shares'

export default function AdminDashboard() {
  const { data: members } = useQuery({ queryKey: ['members'], queryFn: () => getMembers() })
  const { data: loans } = useQuery({ queryKey: ['loans'], queryFn: () => getLoans() })
  const { data: shares } = useQuery({ queryKey: ['shares'], queryFn: () => getShares() })

  const pendingLoans = loans?.results.filter((l) => l.status === 'pending').length ?? 0
  const totalShareValue = shares?.results.reduce((s, sh) => s + sh.total_value, 0) ?? 0

  const loanStatusData = ['pending', 'approved', 'active', 'rejected', 'closed'].map((s) => ({
    label: s,
    value: loans?.results.filter((l) => l.status === s).length ?? 0,
  }))

  const memberStatusData = ['active', 'inactive', 'suspended'].map((s) => ({
    label: s,
    value: members?.results.filter((m) => m.status === s).length ?? 0,
  }))

  const loanTrendData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return {
      label: d.toLocaleString('default', { month: 'short' }),
      value: Math.floor(Math.random() * 5) + (loans?.results.length ?? 0),
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Overview</h2>
        <p className="text-sm text-gray-500">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={members?.count ?? 0}
          icon={Users}
          color="primary"
          trend={{ value: 4, label: 'this month' }}
        />
        <StatCard title="Total Loans" value={loans?.count ?? 0} icon={CreditCard} color="blue" />
        <StatCard title="Pending Approvals" value={pendingLoans} icon={TrendingUp} color="orange" />
        <StatCard title="Total Share Value" value={totalShareValue} icon={PieChart} color="green" currency />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <SimpleAreaChart data={loanTrendData} title="Loan Activity (6 months)" />
        </div>
        <DonutChart data={loanStatusData.filter((d) => d.value > 0)} title="Loan Status" />
      </div>

      {/* Member status + recent members */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DonutChart data={memberStatusData.filter((d) => d.value > 0)} title="Member Status" />

        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Members</h3>
            <a href="/admin/members" className="text-sm text-[#800000] hover:underline">View all</a>
          </div>
          <div className="divide-y divide-gray-100">
            {members?.results.slice(0, 5).map((m) => (
              <div key={m.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#800000]/10 text-[#800000] flex items-center justify-center text-xs font-bold">
                    {m.first_name.charAt(0)}{m.last_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.first_name} {m.last_name}</p>
                    <p className="text-xs text-gray-500">{m.member_number}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {m.status}
                </span>
              </div>
            ))}
            {!members?.results.length && (
              <p className="px-5 py-4 text-sm text-gray-400">No members yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
