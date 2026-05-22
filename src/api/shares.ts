import { api } from './client'
import type { Share, PaginatedResponse } from '@/types'

export async function getShares(params?: { page?: number; member?: number }): Promise<PaginatedResponse<Share>> {
  const { data } = await api.get('/shares/', { params })
  return data
}

export async function getShare(id: number): Promise<Share> {
  const { data } = await api.get(`/shares/${id}/`)
  return data
}

export async function createShare(payload: Partial<Share>): Promise<Share> {
  const { data } = await api.post('/shares/', payload)
  return data
}
