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

type RawMetricValue = number | string | null | undefined

type RawWeeklyActivityPoint = Partial<WeeklyActivityPoint> & {
  calories_intake?: RawMetricValue
  caloriesIntake?: RawMetricValue
  calories_burned?: RawMetricValue
  caloriesBurned?: RawMetricValue
  water_intake?: RawMetricValue
  waterIntake?: RawMetricValue
  sleep_hours?: RawMetricValue
  sleepHours?: RawMetricValue
  steps?: RawMetricValue
}

type RawHealthFocusMetric = Partial<HealthFocusMetric> & {
  value?: RawMetricValue
}

type RawMedicationAdherencePoint = Partial<MedicationAdherencePoint> & {
  adherence?: RawMetricValue
  missed?: RawMetricValue
  sideEffects?: RawMetricValue
  effectiveness?: RawMetricValue
}

type RawMonthlyProgressPoint = Partial<MonthlyProgressPoint> & {
  weight?: RawMetricValue
  bmi?: RawMetricValue
  bloodPressure?: RawMetricValue
  blood_pressure?: RawMetricValue
  heartRate?: RawMetricValue
  heart_rate?: RawMetricValue
  energy?: RawMetricValue
}

type RawDashboardAnalyticsResponse = {
  weeklyActivity?: RawWeeklyActivityPoint[]
  healthFocus?: RawHealthFocusMetric[]
  medicationAdherence?: RawMedicationAdherencePoint[]
  monthlyProgress?: RawMonthlyProgressPoint[]
  recommendations?: HealthRecommendation[]
}

function toNumber(value: RawMetricValue): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0
  if (typeof value === "string") {
    const parsedValue = Number(value)
    return Number.isFinite(parsedValue) ? parsedValue : 0
  }
  return 0
}

function normalizeDashboardAnalytics(payload: RawDashboardAnalyticsResponse): DashboardAnalyticsResponse {
  return {
    weeklyActivity: payload.weeklyActivity?.map((item) => ({
      day: item.day ?? "",
      calories: toNumber(item.calories ?? item.calories_intake ?? item.caloriesIntake),
      burned: toNumber(item.burned ?? item.calories_burned ?? item.caloriesBurned),
      steps: toNumber(item.steps),
      water: toNumber(item.water ?? item.water_intake ?? item.waterIntake),
      sleep: toNumber(item.sleep ?? item.sleep_hours ?? item.sleepHours),
    })),
    healthFocus: payload.healthFocus?.map((item) => ({
      name: item.name ?? "",
      value: toNumber(item.value),
      color: item.color,
      icon: item.icon,
    })),
    medicationAdherence: payload.medicationAdherence?.map((item) => ({
      week: item.week ?? "",
      adherence: toNumber(item.adherence),
      missed: item.missed === undefined ? undefined : toNumber(item.missed),
      sideEffects: item.sideEffects === undefined ? undefined : toNumber(item.sideEffects),
      effectiveness: item.effectiveness === undefined ? undefined : toNumber(item.effectiveness),
    })),
    monthlyProgress: payload.monthlyProgress?.map((item) => ({
      month: item.month ?? "",
      weight: toNumber(item.weight),
      bmi: toNumber(item.bmi),
      bloodPressure: toNumber(item.bloodPressure ?? item.blood_pressure),
      heartRate: toNumber(item.heartRate ?? item.heart_rate),
      energy: item.energy === undefined ? undefined : toNumber(item.energy),
    })),
    recommendations: payload.recommendations?.map((item) => ({
      type: item.type,
      title: item.title,
      description: item.description,
      priority: item.priority,
      impact: item.impact,
      timeframe: item.timeframe,
    })),
  }
}

export async function getDashboardAnalytics(patientId: string): Promise<DashboardAnalyticsResponse> {
  const { data } = await api.get("/dashboard/analytics", {
    params: { patientId },
  })

  console.log("Raw Dashboard Analytics Response:", data)
  const payload = data?.data && typeof data.data === "object" ? data.data : data

  if (payload && typeof payload === "object") {
    return normalizeDashboardAnalytics(payload as RawDashboardAnalyticsResponse)
  }

  return {}
}
