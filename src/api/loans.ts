import { api } from './client'
import type { Loan, PaginatedResponse } from '@/types'

export async function getLoans(params?: { page?: number; status?: string }): Promise<PaginatedResponse<Loan>> {
  const { data } = await api.get('/loans/', { params })
  return data
}

export async function getLoan(id: number): Promise<Loan> {
  const { data } = await api.get(`/loans/${id}/`)
  return data
}

export async function approveLoan(id: number): Promise<Loan> {
  const { data } = await api.post(`/loans/${id}/approve/`)
  return data
}

export async function rejectLoan(id: number, reason: string): Promise<Loan> {
  const { data } = await api.post(`/loans/${id}/reject/`, { reason })
  return data
}
