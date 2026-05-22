import { api } from './client'
import type { Member, PaginatedResponse } from '@/types'

export async function getMembers(params?: { page?: number; search?: string }): Promise<PaginatedResponse<Member>> {
  const { data } = await api.get('/members/', { params })
  return data
}

export async function getMember(id: number): Promise<Member> {
  const { data } = await api.get(`/members/${id}/`)
  return data
}

export async function createMember(payload: Partial<Member>): Promise<Member> {
  const { data } = await api.post('/members/', payload)
  return data
}

export async function updateMember(id: number, payload: Partial<Member>): Promise<Member> {
  const { data } = await api.patch(`/members/${id}/`, payload)
  return data
}

export async function deleteMember(id: number): Promise<void> {
  await api.delete(`/members/${id}/`)
}
