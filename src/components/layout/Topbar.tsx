import { Bell, Menu } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getInitials } from '@/lib/utils'

interface Props {
  onMenuClick?: () => void
  title?: string
}

export function Topbar({ onMenuClick, title }: Props) {
  const { user, activeRole } = useAuthStore()

  const firstName = user?.first_name || user?.username || '?'
  const lastName = user?.last_name || ''
  const initials = getInitials(firstName, lastName || firstName[1] || '')

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu size={20} />
          </button>
        )}
        {title && <h1 className="text-base font-semibold text-gray-800">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#800000] rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#800000] flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-medium text-gray-800 leading-none">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">{activeRole}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
