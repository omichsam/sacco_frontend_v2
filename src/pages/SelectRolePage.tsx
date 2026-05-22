import { useNavigate } from 'react-router-dom'
import { ShieldCheck, TrendingUp, Gavel, Wallet, ClipboardList, Building2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { toRole } from '@/types'
import type { Role } from '@/types'

const roleConfig: {
  role: Role
  label: string
  description: string
  icon: React.ElementType
  route: string
  iconBg: string
  iconColor: string
  border: string
}[] = [
  {
    role: 'admin',
    label: 'Administrator',
    description: 'Members, loans, shares & documents',
    icon: ShieldCheck,
    route: '/admin',
    iconBg: 'bg-[#800000]/10',
    iconColor: 'text-[#800000]',
    border: 'hover:border-[#800000]/30',
  },
  {
    role: 'director',
    label: 'Director',
    description: 'Strategic oversight & loan approvals',
    icon: TrendingUp,
    route: '/director',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    border: 'hover:border-sky-200',
  },
  {
    role: 'chairman',
    label: 'Chairman',
    description: 'Board governance & member oversight',
    icon: Gavel,
    route: '/chairman',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    border: 'hover:border-amber-200',
  },
  {
    role: 'treasury',
    label: 'Treasury',
    description: 'Shares portfolio & loan disbursements',
    icon: Wallet,
    route: '/treasury',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    border: 'hover:border-emerald-200',
  },
  {
    role: 'secretary',
    label: 'Secretary',
    description: 'Member records & document management',
    icon: ClipboardList,
    route: '/secretary',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    border: 'hover:border-purple-200',
  },
]

export default function SelectRolePage() {
  const { user, setActiveRole, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  if (!isAuthenticated()) {
    navigate('/login')
    return null
  }

  const assignedRole = user?.active_role ? toRole(user.active_role) : null
  const firstName = user?.first_name || user?.username || 'there'

  function handleSelect(role: Role, route: string) {
    setActiveRole(role)
    navigate(route)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

      {/* Header */}
      <div className="w-full max-w-lg mb-6 text-center">
        <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center mx-auto mb-3">
          <Building2 size={18} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Hello, {firstName}</h1>
        <p className="text-sm text-gray-500 mt-1">Choose the portal you want to access</p>
      </div>

      {/* Role cards */}
      <div className="w-full max-w-lg space-y-2">
        {roleConfig.map(({ role, label, description, icon: Icon, route, iconBg, iconColor, border }) => {
          const isAssigned = role === assignedRole
          return (
            <button
              key={role}
              onClick={() => handleSelect(role, route)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 bg-white rounded-xl border transition-all text-left ${
                isAssigned
                  ? 'border-[#800000]/25 ring-1 ring-[#800000]/15'
                  : `border-gray-200 ${border}`
              } hover:shadow-sm`}
            >
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              </div>
              {isAssigned && (
                <span className="text-[10px] font-semibold text-[#800000] bg-[#800000]/8 px-2 py-0.5 rounded-full shrink-0">
                  Your role
                </span>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 mt-6">© 2025 Ongata Academy SACCO</p>
    </div>
  )
}
