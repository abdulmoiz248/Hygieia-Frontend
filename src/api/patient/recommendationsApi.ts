import api from "@/lib/axios"

export type PatientRecommendation = {
  type: "fitness" | "sleep" | "nutrition" | "medication" | "doctor" | "disease_risk" | "lab_test" | string
  title: string
  description: string
  priority: "low" | "medium" | "high" | string
  timeframe?: string | null
  doctorId?: string | null
  specialization?: string | null
  conditions?: string[] | null
}

export type PatientRecommendationsRecord = {
  id: string
  patient_id: string
  recommendations: PatientRecommendation[]
  generated_at: string
  source: string
}

type RecommendationsResponse = {
  statusCode?: number
  message?: string
  data?: PatientRecommendationsRecord
  success?: boolean
}

const BASE = "/recommendations"

const extractRecommendationsRecord = (
  payload: unknown
): PatientRecommendationsRecord | null => {
  if (!payload || typeof payload !== "object") {
    return null
  }

  const data = payload as RecommendationsResponse

  if (data.data && typeof data.data === "object") {
    return data.data
  }

  return payload as PatientRecommendationsRecord
}

export async function getLatestPatientRecommendations(
  patientId: string
): Promise<PatientRecommendationsRecord> {
  const { data } = await api.get<RecommendationsResponse | PatientRecommendationsRecord>(
    `${BASE}/${patientId}`
  )

  const record = extractRecommendationsRecord(data)

  if (!record) {
    throw new Error("Failed to fetch recommendations")
  }

  return record
}

export async function refreshPatientRecommendations(
  patientId: string
): Promise<void> {
  await api.post(`${BASE}/${patientId}/refresh`)
}
