import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, CreditCard, PieChart, FileText,
  LogOut, ChevronLeft, ChevronRight, Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import type { Role } from '@/types'

const navItems: Record<Role, { label: string; icon: React.ElementType; to: string }[]> = {
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
    { label: 'Members', icon: Users, to: '/admin/members' },
    { label: 'Loans', icon: CreditCard, to: '/admin/loans' },
    { label: 'Shares', icon: PieChart, to: '/admin/shares' },
    { label: 'Documents', icon: FileText, to: '/admin/documents' },
  ],
  director: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/director' },
    { label: 'Reports', icon: FileText, to: '/director/reports' },
    { label: 'Loans', icon: CreditCard, to: '/director/loans' },
  ],
  chairman: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/chairman' },
    { label: 'Members', icon: Users, to: '/chairman/members' },
    { label: 'Reports', icon: FileText, to: '/chairman/reports' },
  ],
  treasury: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/treasury' },
    { label: 'Shares', icon: PieChart, to: '/treasury/shares' },
    { label: 'Loans', icon: CreditCard, to: '/treasury/loans' },
  ],
  secretary: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/secretary' },
    { label: 'Members', icon: Users, to: '/secretary/members' },
    { label: 'Documents', icon: FileText, to: '/secretary/documents' },
  ],
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { activeRole, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const items = activeRole ? navItems[activeRole] : []

  function doLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
    <aside
      className={cn(
        'flex flex-col h-screen bg-[#1a0a0a] text-[#f5e6e6] transition-all duration-300 shrink-0 relative',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-[#800000] flex items-center justify-center shrink-0">
          <Building2 size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sm leading-tight text-white">
            Ongata Academy<br />
            <span className="text-[#87ceeb] font-normal text-xs">SACCO</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {items.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length === 2}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-[#800000] text-white'
                  : 'text-[#c9a9a9] hover:bg-white/8 hover:text-white'
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && user && (
          <div className="px-1 pb-2 text-xs text-[#c9a9a9]">
            <p className="font-medium text-white truncate">{user.first_name} {user.last_name}</p>
            <p className="capitalize text-[#87ceeb]">{activeRole}</p>
          </div>
        )}
        <button
          onClick={() => setLogoutOpen(true)}
          className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm text-[#c9a9a9] hover:bg-white/8 hover:text-white transition-colors"
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#800000] text-white flex items-center justify-center shadow-md hover:bg-[#a00000] transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>

    <ConfirmModal
      open={logoutOpen}
      onClose={() => setLogoutOpen(false)}
      onConfirm={doLogout}
      title="Log Out"
      description="Are you sure you want to log out? Any unsaved work will be lost."
      confirmLabel="Yes, Log Out"
    />
    </>
  )
}
