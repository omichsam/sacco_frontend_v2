import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Mail, Phone, CreditCard, Calendar, Hash, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Drawer } from '@/components/ui/Drawer'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { formatDate, getInitials } from '@/lib/utils'
import { getMember, deleteMember } from '@/api/members'

interface Props {
  memberId: number | null
  onClose: () => void
  onEdit: () => void
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-gray-500" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export function MemberDetail({ memberId, onClose, onEdit }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const qc = useQueryClient()

  const { data: member, isLoading } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => getMember(memberId!),
    enabled: !!memberId,
  })

  const remove = useMutation({
    mutationFn: () => deleteMember(memberId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members'] })
      toast.success('Member deleted')
      onClose()
    },
    onError: () => toast.error('Failed to delete member'),
  })

  return (
    <>
      <Drawer open={!!memberId} onClose={onClose} title="Member Profile" width="md">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {member && (
          <div className="space-y-5">
            {/* Avatar + name */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="w-16 h-16 rounded-2xl bg-[#800000] flex items-center justify-center text-white text-xl font-bold shrink-0">
                {getInitials(member.first_name, member.last_name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {member.first_name} {member.last_name}
                </h3>
                <p className="text-sm text-gray-500">{member.member_number}</p>
                <div className="mt-1.5">
                  <Badge label={member.status} variant={statusVariant(member.status)} />
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <InfoRow icon={Mail} label="Email Address" value={member.email} />
              <InfoRow icon={Phone} label="Phone Number" value={member.phone} />
              <InfoRow icon={CreditCard} label="National ID" value={member.national_id} />
              <InfoRow icon={Hash} label="Member Number" value={member.member_number} />
              <InfoRow icon={Calendar} label="Date Joined" value={formatDate(member.date_joined)} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => remove.mutateAsync()}
        title="Delete Member"
        description={`This will permanently remove ${member?.first_name} ${member?.last_name} and all their records. This action cannot be undone.`}
        confirmLabel="Delete Member"
        confirmWord="DELETE"
        danger
      />
    </>
  )
}
