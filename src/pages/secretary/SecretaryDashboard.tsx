import { useQuery } from '@tanstack/react-query'
import { Users, FileText, UserCheck, Clock } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { getMembers } from '@/api/members'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { formatDate, getInitials } from '@/lib/utils'

export default function SecretaryDashboard() {
  const { data: members } = useQuery({ queryKey: ['members'], queryFn: () => getMembers() })

  const activeMembers = members?.results.filter((m) => m.status === 'active').length ?? 0
  const recentMembers = members?.results.slice(0, 5) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Secretary Dashboard</h2>
        <p className="text-sm text-gray-500">Member registry and document management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={members?.count ?? 0} icon={Users} color="primary" />
        <StatCard title="Active Members" value={activeMembers} icon={UserCheck} color="green" />
        <StatCard title="Documents Pending" value={0} icon={FileText} color="orange" />
        <StatCard title="New This Month" value={0} icon={Clock} color="blue" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Member Registry</h3>
          <a href="/secretary/members" className="text-sm text-[#800000] hover:underline">View all</a>
        </div>
        <div className="divide-y divide-gray-100">
          {recentMembers.map((m) => (
            <div key={m.id} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#800000]/10 text-[#800000] flex items-center justify-center text-xs font-bold">
                  {getInitials(m.first_name, m.last_name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{m.first_name} {m.last_name}</p>
                  <p className="text-xs text-gray-500">{m.national_id} · {formatDate(m.date_joined)}</p>
                </div>
              </div>
              <Badge label={m.status} variant={statusVariant(m.status)} />
            </div>
          ))}
          {!recentMembers.length && <p className="px-5 py-4 text-sm text-gray-400">No members yet.</p>}
        </div>
      </div>
    </div>
  )
}
