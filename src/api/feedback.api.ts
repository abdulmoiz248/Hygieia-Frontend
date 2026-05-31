import api from "@/lib/axios"

export const BASE_FEEDBACK_URL = "http://localhost:4000/feedback-forms"

export type QuestionType = "rating" | "multiple_choice" | "text"

export interface FeedbackQuestion {
  id: string
  type: QuestionType
  text: string
  options?: string[] // only for multiple_choice
}

export interface CreateFeedbackFormPayload {
  userId: string
  title: string
  description: string
  percentageOfUsers: number
  durationHours: number
  questions: FeedbackQuestion[]
}

export interface FeedbackForm {
  _id: string
  title: string
  description: string
  percentageOfUsers?: number
  durationHours: number
  questions: FeedbackQuestion[]
  createdBy: string
  createdAt: string
  expiresAt: string
}

export interface FeedbackSubmission {
  userEmail: string
  answers: Record<string, any>
  hygieiaReview: string
}

export interface FeedbackResult {
  _id: string
  formId: string
  userEmail: string
  answers: Record<string, any>
  hygieiaReview: string
  submittedAt: string
}

// Mappers to handle backend snake_case and id variations
function mapFeedbackForm(f: any): FeedbackForm {
  return {
    ...f,
    _id: f._id || f.id,
    createdAt: f.createdAt || f.created_at,
    expiresAt: f.expiresAt || f.expiry_date,
    createdBy: f.createdBy || f.created_by,
    percentageOfUsers: f.percentageOfUsers ?? f.percentage_of_users,
    durationHours: f.durationHours ?? f.duration_hours,
  }
}

function mapFeedbackResult(r: any): FeedbackResult {
  return {
    ...r,
    _id: r._id || r.id,
    formId: r.formId || r.form_id,
    userEmail: r.userEmail || r.user_email,
    hygieiaReview: r.hygieiaReview || r.hygieia_review,
    submittedAt: r.submittedAt || r.submitted_at,
  }
}

// Admin Endpoints
export async function createFeedbackForm(payload: CreateFeedbackFormPayload): Promise<FeedbackForm> {
  const { data } = await api.post(`${BASE_FEEDBACK_URL}/admin/create`, payload)
  const form = data.data || data.form || data
  return mapFeedbackForm(form)
}

export async function listFeedbackForms(userId: string): Promise<FeedbackForm[]> {
  const { data } = await api.post(`${BASE_FEEDBACK_URL}/admin/list`, { userId })
  const arr = Array.isArray(data) ? data : data.data || data.forms || []
  return arr.map(mapFeedbackForm)
}

export async function getFeedbackResults(formId: string, userId: string): Promise<FeedbackResult[]> {
  const { data } = await api.post(`${BASE_FEEDBACK_URL}/admin/${formId}/results`, { userId })
  const arr = Array.isArray(data) ? data : data.data || data.results || []
  return arr.map(mapFeedbackResult)
}

// Public Endpoints
export async function getFeedbackForm(formId: string): Promise<FeedbackForm> {
  const res = await fetch(`${BASE_FEEDBACK_URL}/${formId}`)
  if (!res.ok) throw new Error("Failed to get feedback form. It may have expired or not exist.")
  const data = await res.json()
  const form = data.data || data.form || data
  return mapFeedbackForm(form)
}

export async function submitFeedbackForm(formId: string, payload: FeedbackSubmission): Promise<any> {
  const res = await fetch(`${BASE_FEEDBACK_URL}/${formId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.message || "Failed to submit feedback form")
  }
  return res.json()
}
