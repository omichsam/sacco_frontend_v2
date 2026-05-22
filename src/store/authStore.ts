import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Role } from '@/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  activeRole: Role | null
  branchId: string | null
  setAuth: (user: User, access: string, refresh: string) => void
  setActiveRole: (role: Role) => void
  setBranch: (id: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      activeRole: null,
      branchId: null,

      setAuth: (user, access, refresh) => {
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
        set({ user, accessToken: access, refreshToken: refresh })
      },

      setActiveRole: (role) => set({ activeRole: role }),

      setBranch: (id) => {
        localStorage.setItem('branch_id', id)
        set({ branchId: id })
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('branch_id')
        set({ user: null, accessToken: null, refreshToken: null, activeRole: null, branchId: null })
      },

      isAuthenticated: () => !!get().accessToken && !!get().user,
    }),
    { name: 'sacco-auth' }
  )
)
