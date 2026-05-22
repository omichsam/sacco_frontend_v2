import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { getMembers } from '@/api/members'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { formatDate, getInitials } from '@/lib/utils'
import { MemberForm } from './MemberForm'
import { MemberDetail } from './MemberDetail'
import type { Member } from '@/types'

export default function MembersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editMember, setEditMember] = useState<Member | null>(null)
  const [detailId, setDetailId] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['members', page, search],
    queryFn: () => getMembers({ page, search }),
  })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  function openAdd() {
    setEditMember(null)
    setFormOpen(true)
  }

  function openEdit(member: Member) {
    setDetailId(null)
    setEditMember(member)
    setFormOpen(true)
  }

  function openDetail(id: number) {
    setDetailId(id)
  }

  const pageSize = 10
  const totalPages = data ? Math.ceil(data.count / pageSize) : 1

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Members</h2>
            <p className="text-sm text-gray-500">{data?.count ?? 0} total members</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#800000] hover:bg-[#a00000] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Member
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search members…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20"
          />
        </form>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Member</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Number</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))}
                {!isLoading &&
                  data?.results.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => openDetail(m.id)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#800000]/10 text-[#800000] flex items-center justify-center text-xs font-bold shrink-0">
                            {getInitials(m.first_name, m.last_name)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{m.first_name} {m.last_name}</p>
                            <p className="text-xs text-gray-400">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{m.member_number}</td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{m.phone}</td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{formatDate(m.date_joined)}</td>
                      <td className="px-4 py-3">
                        <Badge label={m.status} variant={statusVariant(m.status)} />
                      </td>
                    </tr>
                  ))}
                {!isLoading && !data?.results.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Member detail drawer */}
      <MemberDetail
        memberId={detailId}
        onClose={() => setDetailId(null)}
        onEdit={() => {
          const m = data?.results.find((r) => r.id === detailId)
          if (m) openEdit(m)
        }}
      />

      {/* Add / edit form drawer */}
      <MemberForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditMember(null) }}
        member={editMember}
      />
    </>
  )
}
