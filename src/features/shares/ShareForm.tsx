import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Drawer } from '@/components/ui/Drawer'
import { FormInput, FormSelect, FormActions } from '@/components/ui/FormField'
import { createShare } from '@/api/shares'
import { getMembers } from '@/api/members'

const schema = z.object({
  member: z.string().min(1, 'Select a member'),
  quantity: z.string().refine((v) => Number(v) >= 1, 'Minimum 1 share'),
  value_per_share: z.string().refine((v) => Number(v) >= 1, 'Enter share value'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
}

export function ShareForm({ open, onClose }: Props) {
  const qc = useQueryClient()
  const { data: members } = useQuery({ queryKey: ['members'], queryFn: () => getMembers() })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { member: '', quantity: '', value_per_share: '' },
  })

  const qty = Number(watch('quantity') || 0)
  const val = Number(watch('value_per_share') || 0)
  const totalPreview = qty * val

  const create = useMutation({
    mutationFn: (data: FormValues) =>
      createShare({
        member: Number(data.member),
        quantity: Number(data.quantity),
        value_per_share: Number(data.value_per_share),
        total_value: Number(data.quantity) * Number(data.value_per_share),
        date_purchased: new Date().toISOString().split('T')[0],
        status: 'active',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shares'] })
      toast.success('Share purchase recorded successfully')
      reset()
      onClose()
    },
    onError: () => {
      toast.error('Failed to record share purchase')
    },
  })

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Record Share Purchase"
      description="Issue new shares to a member"
    >
      <form onSubmit={handleSubmit((d) => create.mutateAsync(d))} className="space-y-4">
        <FormSelect
          label="Member"
          error={errors.member?.message}
          options={
            members?.results.map((m) => ({
              value: String(m.id),
              label: `${m.first_name} ${m.last_name} — ${m.member_number}`,
            })) ?? []
          }
          {...register('member')}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Number of Shares"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 10"
            error={errors.quantity?.message}
            {...register('quantity')}
          />
          <FormInput
            label="Value per Share (KES)"
            type="number"
            min={1}
            step={50}
            placeholder="e.g. 1000"
            error={errors.value_per_share?.message}
            {...register('value_per_share')}
          />
        </div>

        {totalPreview > 0 && (
          <div className="bg-[#800000]/5 border border-[#800000]/20 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Total Purchase Value</p>
            <p className="text-2xl font-bold text-[#800000]">
              KES {totalPreview.toLocaleString('en-KE')}
            </p>
            <p className="text-xs text-gray-400 mt-1">{qty} shares × KES {val.toLocaleString('en-KE')}</p>
          </div>
        )}

        <FormActions>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-[#800000] hover:bg-[#a00000] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            Record Purchase
          </button>
        </FormActions>
      </form>
    </Drawer>
  )
}
