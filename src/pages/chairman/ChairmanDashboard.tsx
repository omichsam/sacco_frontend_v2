import { useQuery } from '@tanstack/react-query'
import { Users, CreditCard, PieChart, Activity } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { getMembers } from '@/api/members'
import { getLoans } from '@/api/loans'
import { getShares } from '@/api/shares'

export default function ChairmanDashboard() {
  const { data: members } = useQuery({ queryKey: ['members'], queryFn: () => getMembers() })
  const { data: loans } = useQuery({ queryKey: ['loans'], queryFn: () => getLoans() })
  const { data: shares } = useQuery({ queryKey: ['shares'], queryFn: () => getShares() })

  const activeMembers = members?.results.filter((m) => m.status === 'active').length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Chairman Dashboard</h2>
        <p className="text-sm text-gray-500">SACCO health and membership overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={members?.count ?? 0} icon={Users} color="primary" />
        <StatCard title="Active Members" value={activeMembers} icon={Activity} color="green" />
        <StatCard title="Total Loans" value={loans?.count ?? 0} icon={CreditCard} color="blue" />
        <StatCard title="Share Records" value={shares?.count ?? 0} icon={PieChart} color="orange" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Membership Status</h3>
          <div className="space-y-2">
            {['active', 'inactive', 'suspended'].map((s) => {
              const count = members?.results.filter((m) => m.status === s).length ?? 0
              const total = members?.count ?? 1
              return (
                <div key={s}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="capitalize">{s}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className={`h-2 rounded-full ${s === 'active' ? 'bg-green-500' : s === 'suspended' ? 'bg-red-400' : 'bg-gray-300'}`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Loan Status Summary</h3>
          <div className="space-y-2">
            {['pending', 'approved', 'active', 'closed'].map((s) => {
              const count = loans?.results.filter((l) => l.status === s).length ?? 0
              return (
                <div key={s} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600 capitalize">{s}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
