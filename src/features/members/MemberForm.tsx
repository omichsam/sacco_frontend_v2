import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Drawer } from '@/components/ui/Drawer'
import { FormInput, FormSelect, FormActions } from '@/components/ui/FormField'
import { createMember, updateMember } from '@/api/members'
import type { Member } from '@/types'

const schema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  national_id: z.string().min(5, 'Enter a valid national ID'),
  status: z.enum(['active', 'inactive', 'suspended']),
})

type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  member?: Member | null
}

export function MemberForm({ open, onClose, member }: Props) {
  const qc = useQueryClient()
  const isEdit = !!member

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      national_id: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (member) {
      reset({
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        phone: member.phone,
        national_id: member.national_id,
        status: member.status,
      })
    } else {
      reset({ first_name: '', last_name: '', email: '', phone: '', national_id: '', status: 'active' })
    }
  }, [member, reset])

  const create = useMutation({
    mutationFn: (data: FormData) => createMember(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members'] })
      toast.success('Member added successfully')
      onClose()
    },
    onError: () => toast.error('Failed to add member'),
  })

  const update = useMutation({
    mutationFn: (data: FormData) => updateMember(member!.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members'] })
      toast.success('Member updated successfully')
      onClose()
    },
    onError: () => toast.error('Failed to update member'),
  })

  async function onSubmit(data: FormData) {
    if (isEdit) await update.mutateAsync(data)
    else await create.mutateAsync(data)
  }

  const error = create.error?.message || update.error?.message

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Member' : 'Add New Member'}
      description={isEdit ? `Editing ${member?.first_name} ${member?.last_name}` : 'Fill in the member details below'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            placeholder="Jane"
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <FormInput
            label="Last Name"
            placeholder="Doe"
            error={errors.last_name?.message}
            {...register('last_name')}
          />
        </div>

        <FormInput
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormInput
          label="Phone Number"
          type="tel"
          placeholder="+254 700 000000"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <FormInput
          label="National ID"
          placeholder="12345678"
          error={errors.national_id?.message}
          {...register('national_id')}
        />

        <FormSelect
          label="Status"
          error={errors.status?.message}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'suspended', label: 'Suspended' },
          ]}
          {...register('status')}
        />

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
            {isEdit ? 'Save Changes' : 'Add Member'}
          </button>
        </FormActions>
      </form>
    </Drawer>
  )
}
