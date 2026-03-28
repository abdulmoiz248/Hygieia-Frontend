import { create } from "zustand"
import { devtools } from "zustand/middleware"

import {
  getDashboardAnalytics,
  type DashboardAnalyticsResponse,
  type HealthFocusMetric,
  type HealthRecommendation,
  type MedicationAdherencePoint,
  type MonthlyProgressPoint,
  type WeeklyActivityPoint,
} from "@/api/patient/dashboardApi"

type DashboardAnalyticsState = {
  weeklyActivity: WeeklyActivityPoint[]
  healthFocus: HealthFocusMetric[]
  medicationAdherence: MedicationAdherencePoint[]
  monthlyProgress: MonthlyProgressPoint[]
  recommendations: HealthRecommendation[]
  loading: boolean
  error: string | null
  fetchDashboardAnalytics: (patientId: string) => Promise<void>
  setDashboardAnalytics: (payload: DashboardAnalyticsResponse) => void
}

export const usePatientDashboardAnalyticsStore = create<DashboardAnalyticsState>()(
  devtools(
    (set) => ({
      weeklyActivity: [],
      healthFocus: [],
      medicationAdherence: [],
      monthlyProgress: [],
      recommendations: [],
      loading: false,
      error: null,

      setDashboardAnalytics: (payload) =>
        set({
          weeklyActivity: payload.weeklyActivity ?? [],
          healthFocus: payload.healthFocus ?? [],
          medicationAdherence: payload.medicationAdherence ?? [],
          monthlyProgress: payload.monthlyProgress ?? [],
          recommendations: payload.recommendations ?? [],
        }),

      fetchDashboardAnalytics: async (patientId) => {
        if (!patientId) {
          set({
            weeklyActivity: [],
            healthFocus: [],
            medicationAdherence: [],
            monthlyProgress: [],
            recommendations: [],
            loading: false,
            error: "Patient ID is required",
          })
          return
        }

        set({ loading: true, error: null })

        try {
          const analytics = await getDashboardAnalytics(patientId)
          set({
            weeklyActivity: analytics.weeklyActivity ?? [],
            healthFocus: analytics.healthFocus ?? [],
            medicationAdherence: analytics.medicationAdherence ?? [],
            monthlyProgress: analytics.monthlyProgress ?? [],
            recommendations: analytics.recommendations ?? [],
            loading: false,
            error: null,
          })
        } catch (err: any) {
          set({
            loading: false,
            error: err?.response?.data?.message || err?.message || "Failed to fetch dashboard analytics",
            weeklyActivity: [],
            healthFocus: [],
            medicationAdherence: [],
            monthlyProgress: [],
            recommendations: [],
          })
        }
      },
    }),
    { name: "patient-dashboard-analytics-store" }
  )
)
