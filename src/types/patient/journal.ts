export type JournalCategory =
  | "medication"
  | "symptom"
  | "food"
  | "mood"
  | "exercise"
  | "vitals"
  | "general"
  | "alert"

export type AlertLevel = "low" | "medium" | "high" | "critical"

export interface JournalEntry {
  _id: string
  patientId: string
  message: string
  categories: JournalCategory[]
  tags: string[]
  alertLevel: AlertLevel
  entryDate: string
  attachmentUrl?: string
  flaggedForDoctor?: boolean
  doctorComment?: string
  doctorId?: string
  doctorReviewedAt?: string
  isPrivate?: boolean
  createdAt: string
  updatedAt: string
}

export interface JournalEntriesResponse {
  entries: JournalEntry[]
  total: number
  pages: number
}

export interface JournalStatistics {
  totalEntries: number
  entriesByCategory: Record<string, number>
  entriesByAlertLevel: Record<string, number>
  lastEntryDate: string
}

export interface CreateJournalEntryPayload {
  patientId: string
  message: string
  categories: JournalCategory[]
  tags?: string[]
  alertLevel?: AlertLevel
  entryDate?: string
  attachmentUrl?: string
}

export interface UpdateJournalEntryPayload {
  message?: string
  categories?: JournalCategory[]
  tags?: string[]
  alertLevel?: AlertLevel
}
