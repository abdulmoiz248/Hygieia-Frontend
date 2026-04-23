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

export type ModelType = "acne" | "dental"

export type PredictionModelStatus = {
  status?: string
  loaded?: boolean
  path?: string
  metadata_path?: string
  source_url?: string
  class_names?: string[]
  img_size?: number
}

export type PredictionData = {
  predicted_class: string
  confidence: number
  probabilities?: Record<string, number>
  model_status?: PredictionModelStatus
}

type PredictionResponse = {
  statusCode?: number
  message?: string
  data?: PredictionData
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

const extractPredictionData = (payload: unknown): PredictionData | null => {
  if (!payload || typeof payload !== "object") {
    return null
  }

  const data = payload as PredictionResponse

  const normalizePrediction = (value: unknown): PredictionData | null => {
    if (!value || typeof value !== "object") {
      return null
    }

    const source = value as Record<string, unknown>
    const predictedClass =
      typeof source.predicted_class === "string"
        ? source.predicted_class
        : typeof source.predictedClass === "string"
          ? source.predictedClass
          : typeof source.class === "string"
            ? source.class
            : typeof source.label === "string"
              ? source.label
              : null

    const confidenceValue =
      typeof source.confidence === "number"
        ? source.confidence
        : typeof source.score === "number"
          ? source.score
          : null

    const probabilities =
      source.probabilities && typeof source.probabilities === "object"
        ? (source.probabilities as Record<string, number>)
        : undefined

    const modelStatus =
      source.model_status && typeof source.model_status === "object"
        ? (source.model_status as PredictionModelStatus)
        : source.modelStatus && typeof source.modelStatus === "object"
          ? (source.modelStatus as PredictionModelStatus)
          : undefined

    const resolvedPredictedClass =
      predictedClass ??
      (probabilities
        ? Object.entries(probabilities).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Unknown"
        : "Unknown")

    const resolvedConfidence =
      confidenceValue ??
      (probabilities
        ? Object.entries(probabilities).sort((a, b) => b[1] - a[1])[0]?.[1] ?? 0
        : 0)

    if (typeof resolvedPredictedClass !== "string" || typeof resolvedConfidence !== "number") {
      return null
    }

    return {
      predicted_class: resolvedPredictedClass,
      confidence: resolvedConfidence,
      probabilities,
      model_status: modelStatus,
    }
  }

  if (data.data && typeof data.data === "object") {
    const normalized = normalizePrediction(data.data)
    if (normalized) {
      return normalized
    }

    const nestedPrediction = (data.data as Record<string, unknown>).prediction
    const normalizedNested = normalizePrediction(nestedPrediction)
    if (normalizedNested) {
      return normalizedNested
    }
  }

  const directNormalized = normalizePrediction(payload)
  if (directNormalized) {
    return directNormalized
  }

  return null
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

export async function predictModel(
  type: ModelType,
  file: File
): Promise<PredictionData> {
  const formData = new FormData()
  formData.append("image", file)

  const endpoint =
    type === "acne"
      ? `${BASE}/predict-acne`
      : `${BASE}/predict-dental`

  const { data } = await api.post<PredictionResponse | PredictionData>(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  const prediction = extractPredictionData(data)

  if (!prediction) {
    throw new Error("Prediction failed")
  }

  return prediction
}
