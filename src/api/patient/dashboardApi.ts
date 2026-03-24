import api from "@/lib/axios"

export type WeeklyActivityPoint = {
  day: string
  calories: number
  burned: number
  steps: number
  water: number
  sleep: number
}

export type HealthFocusMetric = {
  name: string
  value: number
  color?: string
  icon?: string
}

export type MedicationAdherencePoint = {
  week: string
  adherence: number
  missed?: number
  sideEffects?: number
  effectiveness?: number
}

export type MonthlyProgressPoint = {
  month: string
  weight: number
  bmi: number
  bloodPressure: number
  heartRate: number
  energy?: number
}

export type HealthRecommendation = {
  type: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  impact?: string
  timeframe?: string
}

export type DashboardAnalyticsResponse = {
  weeklyActivity?: WeeklyActivityPoint[]
  healthFocus?: HealthFocusMetric[]
  medicationAdherence?: MedicationAdherencePoint[]
  monthlyProgress?: MonthlyProgressPoint[]
  recommendations?: HealthRecommendation[]
}

export async function getDashboardAnalytics(patientId: string): Promise<DashboardAnalyticsResponse> {
  const { data } = await api.get("/dashboard/analytics", {
    params: { patientId },
  })

  if (data?.data && typeof data.data === "object") {
    return data.data as DashboardAnalyticsResponse
  }

  if (typeof data === "object" && data !== null) {
    return data as DashboardAnalyticsResponse
  }

  return {}
}
