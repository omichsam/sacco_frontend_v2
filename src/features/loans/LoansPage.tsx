import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLoans, approveLoan, rejectLoan } from '@/api/loans'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CheckCircle, XCircle, Plus, Loader2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { LoanForm } from './LoanForm'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Modal } from '@/components/ui/Modal'

type LoanAction = { id: number; member_name: string; amount: number }

export default function LoansPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [approvingLoan, setApprovingLoan] = useState<LoanAction | null>(null)
  const [rejectingLoan, setRejectingLoan] = useState<LoanAction | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['loans', statusFilter],
    queryFn: () => getLoans({ status: statusFilter || undefined }),
  })

  const approve = useMutation({
    mutationFn: approveLoan,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans'] })
      toast.success('Loan approved successfully')
      setApprovingLoan(null)
    },
    onError: () => toast.error('Failed to approve loan'),
  })

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => rejectLoan(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans'] })
      toast.success('Loan rejected')
      setRejectingLoan(null)
      setRejectReason('')
    },
    onError: () => toast.error('Failed to reject loan'),
  })

  const statuses = ['', 'pending', 'approved', 'active', 'rejected', 'closed']

  function openApprove(loan: LoanAction) { setApprovingLoan(loan) }
  function openReject(loan: LoanAction) { setRejectingLoan(loan); setRejectReason('') }
  function closeReject() { setRejectingLoan(null); setRejectReason('') }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Loans</h2>
            <p className="text-sm text-gray-500">{data?.count ?? 0} total loans</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#800000] hover:bg-[#a00000] text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={15} />
              New Loan
            </button>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-[#800000] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s || 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Member</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Purpose</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Applied</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))}
                {!isLoading && data?.results.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{loan.member_name}</td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(loan.amount)}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-[180px] truncate">{loan.purpose}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{formatDate(loan.applied_date)}</td>
                    <td className="px-4 py-3"><Badge label={loan.status} variant={statusVariant(loan.status)} /></td>
                    <td className="px-4 py-3">
                      {loan.status === 'pending' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => openApprove({ id: loan.id, member_name: loan.member_name, amount: loan.amount })}
                            className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                            title="Approve loan"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={() => openReject({ id: loan.id, member_name: loan.member_name, amount: loan.amount })}
                            className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                            title="Reject loan"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {!isLoading && !data?.results.length && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No loans found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <LoanForm open={formOpen} onClose={() => setFormOpen(false)} />

      {/* Approve confirmation */}
      <ConfirmModal
        open={!!approvingLoan}
        onClose={() => setApprovingLoan(null)}
        onConfirm={() => approve.mutateAsync(approvingLoan!.id)}
        title="Approve Loan"
        description={`Approve a loan of ${formatCurrency(approvingLoan?.amount ?? 0)} for ${approvingLoan?.member_name}? This action will mark the loan as approved.`}
        confirmLabel="Yes, Approve"
      />

      {/* Reject modal with reason */}
      <Modal
        open={!!rejectingLoan}
        onClose={closeReject}
        title="Reject Loan"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Reject the loan application for{' '}
              <span className="font-semibold text-gray-800">{rejectingLoan?.member_name}</span>{' '}
              ({formatCurrency(rejectingLoan?.amount ?? 0)})? This cannot be undone.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Reason <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Insufficient collateral, income does not meet requirements…"
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 resize-none transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={closeReject}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => reject.mutate({ id: rejectingLoan!.id, reason: rejectReason || 'Rejected by admin' })}
              disabled={reject.isPending}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {reject.isPending && <Loader2 size={14} className="animate-spin" />}
              Yes, Reject
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
