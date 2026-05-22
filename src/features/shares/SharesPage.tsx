import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { getShares } from '@/api/shares'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ShareForm } from './ShareForm'

export default function SharesPage() {
  const [formOpen, setFormOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['shares'],
    queryFn: () => getShares(),
  })

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Shares</h2>
            <p className="text-sm text-gray-500">{data?.count ?? 0} share records</p>
          </div>
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#800000] hover:bg-[#a00000] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={15} />
            Record Purchase
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Member</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Share No.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Qty</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Value</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))}
                {!isLoading && data?.results.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.member_name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.share_number}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{s.quantity}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{formatCurrency(s.total_value)}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{formatDate(s.date_purchased)}</td>
                    <td className="px-4 py-3"><Badge label={s.status} variant={statusVariant(s.status)} /></td>
                  </tr>
                ))}
                {!isLoading && !data?.results.length && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No shares found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ShareForm open={formOpen} onClose={() => setFormOpen(false)} />
    </>
  )
}
