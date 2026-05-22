export type Role = 'admin' | 'director' | 'chairman' | 'treasury' | 'secretary'

// Backend returns uppercase role strings
export type ApiRole = 'ADMIN' | 'DIRECTOR' | 'CHAIRMAN' | 'TREASURY' | 'SECRETARY'

export function toRole(apiRole: ApiRole): Role {
  return apiRole.toLowerCase() as Role
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  active_role: ApiRole
  active_branch?: { id: number; name: string }
}

export interface Branch {
  id: number
  name: string
}

export interface Member {
  id: number
  member_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  national_id: string
  date_joined: string
  status: 'active' | 'inactive' | 'suspended'
  branch: number
  profile_photo?: string
}

export interface Loan {
  id: number
  member: number
  member_name: string
  amount: number
  interest_rate: number
  duration_months: number
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'closed'
  purpose: string
  applied_date: string
  approved_date?: string
}

export interface Share {
  id: number
  member: number
  member_name: string
  share_number: string
  quantity: number
  value_per_share: number
  total_value: number
  date_purchased: string
  status: 'active' | 'transferred' | 'redeemed'
}

export interface Document {
  id: number
  member: number
  document_type: string
  file: string
  uploaded_at: string
  verified: boolean
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
