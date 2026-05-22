import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { FormInput, FormSelect, FormActions } from '@/components/ui/FormField'
import { api } from '@/api/client'
import { getMembers } from '@/api/members'
import type { Loan } from '@/types'

// All fields as strings to match HTML input value types
const schema = z.object({
  member: z.string().min(1, 'Select a member'),
  amount: z.string().refine((v) => Number(v) >= 1000, 'Minimum loan amount is KES 1,000'),
  interest_rate: z.string().refine((v) => Number(v) >= 0 && Number(v) <= 100, 'Rate must be 0–100%'),
  duration_months: z.string().refine((v) => Number(v) >= 1 && Number(v) <= 120, 'Duration: 1–120 months'),
  purpose: z.string().min(10, 'Describe the purpose (min 10 characters)'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
}

export function LoanForm({ open, onClose }: Props) {
  const qc = useQueryClient()
  const { data: members } = useQuery({ queryKey: ['members'], queryFn: () => getMembers() })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { member: '', amount: '', interest_rate: '12', duration_months: '12', purpose: '' },
  })

  const create = useMutation<Loan, Error, FormValues>({
    mutationFn: (data) =>
      api.post<Loan>('/loans/', {
        member: Number(data.member),
        amount: Number(data.amount),
        interest_rate: Number(data.interest_rate),
        duration_months: Number(data.duration_months),
        purpose: data.purpose,
      }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans'] })
      reset()
      onClose()
    },
  })

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="New Loan Application"
      description="Record a new member loan request"
    >
      <form onSubmit={handleSubmit((d) => create.mutateAsync(d))} className="space-y-4">
        {create.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {create.error.message}
          </div>
        )}

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
            label="Loan Amount (KES)"
            type="number"
            min={1000}
            step={500}
            error={errors.amount?.message}
            {...register('amount')}
          />
          <FormInput
            label="Interest Rate (%)"
            type="number"
            min={0}
            max={100}
            step={0.5}
            error={errors.interest_rate?.message}
            {...register('interest_rate')}
          />
        </div>

        <FormInput
          label="Duration (months)"
          type="number"
          min={1}
          max={120}
          error={errors.duration_months?.message}
          {...register('duration_months')}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Purpose</label>
          <textarea
            placeholder="Describe the purpose of the loan…"
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20 resize-none transition-colors"
            {...register('purpose')}
          />
          {errors.purpose && <p className="text-xs text-red-600">{errors.purpose.message}</p>}
        </div>

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
            Submit Application
          </button>
        </FormActions>
      </form>
    </Drawer>
  )
}
