import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type {
  DietPlan,
  MealPreferences,
  MealSuggestion,
} from "@/types/patient/dietSlice"
import api from "@/lib/axios"

type DietState = {
  currentDietPlan: DietPlan | null
  todayMealSuggestions: MealSuggestion[]
  mealPreferences: MealPreferences | null
  isLoadingPlan: boolean
  isLoadingMeals: boolean
  setDietPlan: (plan: DietPlan) => void
  clearDietPlan: () => void
  setMealSuggestions: (meals: MealSuggestion[]) => void
  clearMealSuggestions: () => void
  setMealPreferences: (prefs: MealPreferences) => void
  setLoadingPlan: (loading: boolean) => void
  setLoadingMeals: (loading: boolean) => void
  fetchDietPlan: () => Promise<DietPlan | null>
}

const getAIDietPlanFromStorage = (): DietPlan | null => {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem("aiDietPlan")
    if (!stored) return null
    const { plan, timestamp } = JSON.parse(stored)
    const now = new Date().getTime()
    const twentyFourHours = 24 * 60 * 60 * 1000

    if (now - timestamp < twentyFourHours) {
      return { ...plan, isAIGenerated: true }
    }

    localStorage.removeItem("aiDietPlan")
    return null
  } catch {
    return null
  }
}

const getTodaysMeals = (): MealSuggestion[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("aiMeals")
    if (!stored) return []
    const { meals, date } = JSON.parse(stored)
    const today = new Date().toDateString()
    if (date === today) return meals
    localStorage.removeItem("aiMeals")
    return []
  } catch {
    return []
  }
}

const initialState: Omit<
  DietState,
  | "setDietPlan"
  | "clearDietPlan"
  | "setMealSuggestions"
  | "clearMealSuggestions"
  | "setMealPreferences"
  | "setLoadingPlan"
  | "setLoadingMeals"
  | "fetchDietPlan"
> = {
  currentDietPlan: null,
  todayMealSuggestions: getTodaysMeals(),
  mealPreferences: null,
  isLoadingPlan: false,
  isLoadingMeals: false,
}

export const usePatientDietStore = create<DietState>()(
  devtools(
    (set) => ({
      ...initialState,

      setDietPlan: (plan) => {
        set({ currentDietPlan: plan })
        if (typeof window !== "undefined" && plan.isAIGenerated) {
          const dataToStore = {
            plan,
            timestamp: new Date().getTime(),
          }
          localStorage.setItem("aiDietPlan", JSON.stringify(dataToStore))
        }
      },

      clearDietPlan: () => {
        set({ currentDietPlan: null })
        if (typeof window !== "undefined") {
          localStorage.removeItem("aiDietPlan")
        }
      },

      setMealSuggestions: (meals) => {
        set({ todayMealSuggestions: meals })
        if (typeof window !== "undefined") {
          const dataToStore = {
            meals,
            date: new Date().toDateString(),
          }
          localStorage.setItem("aiMeals", JSON.stringify(dataToStore))
        }
      },

      clearMealSuggestions: () => {
        set({ todayMealSuggestions: [] })
        if (typeof window !== "undefined") {
          localStorage.removeItem("aiMeals")
        }
      },

      setMealPreferences: (prefs) => set({ mealPreferences: prefs }),
      setLoadingPlan: (loading) => set({ isLoadingPlan: loading }),
      setLoadingMeals: (loading) => set({ isLoadingMeals: loading }),

      fetchDietPlan: async () => {
        try {
          set({ isLoadingPlan: true })
          const id = typeof window !== "undefined" ? localStorage.getItem("id") : null
          if (!id) {
            const local = getAIDietPlanFromStorage()
            set({ currentDietPlan: local, isLoadingPlan: false })
            return local
          }

          const res = await api.get(`/diet-plans/patient/${id}`)
          const data = res.data as DietPlan | DietPlan[] | null

          let plan: DietPlan | null = null
          if (Array.isArray(data)) {
            plan = data.length > 0 ? data[0] : null
          } else {
            plan = data
          }

          if (plan) {
            const normalized = { ...plan, isAIGenerated: false }
            set({ currentDietPlan: normalized, isLoadingPlan: false })
            return normalized
          }

          const local = getAIDietPlanFromStorage()
          set({ currentDietPlan: local, isLoadingPlan: false })
          return local
        } catch {
          const local = getAIDietPlanFromStorage()
          set({ currentDietPlan: local, isLoadingPlan: false })
          return local
        }
      },
    }),
    { name: "patient-diet-store" }
  )
)

