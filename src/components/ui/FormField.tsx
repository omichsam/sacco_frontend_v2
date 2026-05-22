import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string; label: string }[]
}

const inputBase =
  'w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors ' +
  'focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20 disabled:opacity-60'

export function FormInput({ label, error, hint, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className={cn(
          inputBase,
          error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-gray-300',
          className
        )}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

export function FormSelect({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        {...props}
        className={cn(
          inputBase,
          'bg-white',
          error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-gray-300',
          className
        )}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function FormActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 pt-4 border-t border-gray-200 mt-6">
      {children}
    </div>
  )
}
