import api from "@/lib/axios"
import type {
  JournalEntry,
  JournalEntriesResponse,
  JournalStatistics,
  CreateJournalEntryPayload,
  UpdateJournalEntryPayload,
  JournalCategory,
} from "@/types/patient/journal"

const BASE = "/patient-journal"

export async function createEntry(
  payload: CreateJournalEntryPayload
): Promise<JournalEntry> {
  const { data } = await api.post<JournalEntry>(`${BASE}/entries`, payload)
  return data
}

export async function getEntries(
  patientId: string,
  params?: { page?: number; limit?: number }
): Promise<JournalEntriesResponse> {
  const { data } = await api.get<JournalEntriesResponse>(
    `${BASE}/entries/${patientId}`,
    { params: params ?? {} }
  )
  return data
}

export async function getEntriesByCategory(
  patientId: string,
  category: JournalCategory,
  params?: { page?: number; limit?: number }
): Promise<JournalEntriesResponse> {
  const { data } = await api.get<JournalEntriesResponse>(
    `${BASE}/entries/${patientId}/category/${category}`,
    { params: params ?? {} }
  )
  return data
}

export async function getEntry(
  patientId: string,
  entryId: string
): Promise<JournalEntry> {
  const { data } = await api.get<JournalEntry>(
    `${BASE}/entries/${patientId}/entry/${entryId}`
  )
  return data
}

export async function updateEntry(
  id: string,
  payload: UpdateJournalEntryPayload
): Promise<JournalEntry> {
  const { data } = await api.put<JournalEntry>(`${BASE}/entries/${id}`, payload)
  return data
}

export async function deleteEntry(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`${BASE}/entries/${id}`)
  return data
}

export async function flagEntry(id: string): Promise<JournalEntry> {
  const { data } = await api.put<JournalEntry>(`${BASE}/entries/${id}/flag`)
  return data
}

export async function getStatistics(
  patientId: string
): Promise<JournalStatistics> {
  const { data } = await api.get<JournalStatistics>(
    `${BASE}/entries/${patientId}/statistics`
  )
  return data
}
