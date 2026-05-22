import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { cn } from '@/lib/utils'

function getTitleFromPath(pathname: string): string {
  const segment = pathname.split('/').pop() ?? ''
  if (!segment || segment === 'admin' || segment === 'director' || segment === 'chairman' || segment === 'treasury' || segment === 'secretary') return 'Dashboard'
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

export function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const title = getTitleFromPath(pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onMenuClick={() => setMobileSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
