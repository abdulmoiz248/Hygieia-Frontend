export type CVStatus = "new" | "reviewed" | "shortlisted" | "rejected"
export type SortKey = "date" | "name" | "experience" | "status"
export type AppliedRole = "doctor" | "nutritionist" | "pathologist"
export type FilterRole = "all" | AppliedRole
export type FilterStatus = "all" | CVStatus

export interface CV {
  id: string
  fullName: string
  email: string
  phone: string
  role: AppliedRole
  doctorField?: string
  cvLink: string
  experience: string
  created_at: string
  // local-only, not from API
  status: CVStatus
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}
