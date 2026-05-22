import { api } from './client'
import type { User } from '@/types'

interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/users/login/', { username, password })
  return data
}

export async function logout(): Promise<void> {
  const refresh = localStorage.getItem('refresh_token')
  if (refresh) await api.post('/users/logout/', { refresh }).catch(() => {})
}
