import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { DayStatus, FitnessState, Goal } from "@/types/patient/fitness"
import api from "@/lib/axios"

type FitnessStore = FitnessState & {
  setGoals: (goals: Goal[]) => void
  updateGoalProgressLocal: (payload: { type: string; amount: number }) => void
  addCaloriesLocal: (payload: {
    type: "consumed" | "burned"
    amount: number
    protein?: number
    fat?: number
    carbs?: number
  }) => void
  fetchFitness: (userId: string) => Promise<void>
  updateGoalProgress: (payload: { type: string; amount: number }) => Promise<void>
  addCalories: (payload: {
    type: "consumed" | "burned"
    amount: number
    protein?: number
    fat?: number
    carbs?: number
  }) => Promise<void>
}

const getInitial7Days = (): DayStatus[] => {
  const today = new Date()
  const days: DayStatus[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    days.push({
      date: date.toDateString(),
      completed: false,
    })
  }
  return days
}

const initialState: FitnessState = {
  goals: [],
  activityLog: getInitial7Days(),
  caloriesConsumed: 0,
  caloriesBurned: 0,
  proteinConsumed: 0,
  fatConsumed: 0,
  carbsConsumed: 0,
  loading: false,
  error: null,
}

const getBackendUpdates = (state: FitnessState): Record<string, unknown> => ({
  steps: state.goals.find((g) => g.type === "steps")?.current || 0,
  water: state.goals.find((g) => g.type === "water")?.current || 0,
  sleep: state.goals.find((g) => g.type === "sleep")?.current || 0,
  calories_intake: state.caloriesConsumed,
  calories_burned: state.caloriesBurned,
  protein: state.proteinConsumed,
  fat: state.fatConsumed,
  carbs: state.carbsConsumed,
})

export const usePatientFitnessStore = create<FitnessStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setGoals: (goals) => set({ goals }),

      updateGoalProgressLocal: ({ type, amount }) =>
        set((state) => {
          const updatedGoals = state.goals.map((goal) =>
            goal.type === type
              ? {
                  ...goal,
                  current: Math.min(goal.current + amount, goal.target),
                }
              : goal
          )

          const allReached = updatedGoals.every((goal) => goal.current >= goal.target)
          let updatedActivityLog = state.activityLog
          if (allReached) {
            const todayStr = new Date().toDateString()
            updatedActivityLog = state.activityLog.map((day) =>
              day.date === todayStr ? { ...day, completed: true } : day
            )
          }

          return {
            ...state,
            goals: updatedGoals,
            activityLog: updatedActivityLog,
          }
        }),

      addCaloriesLocal: ({ type, amount, protein, fat, carbs }) =>
        set((state) => {
          if (type === "consumed") {
            return {
              ...state,
              caloriesConsumed: state.caloriesConsumed + amount,
              proteinConsumed: state.proteinConsumed + (protein || 0),
              fatConsumed: state.fatConsumed + (fat || 0),
              carbsConsumed: state.carbsConsumed + (carbs || 0),
            }
          }
          return {
            ...state,
            caloriesBurned: state.caloriesBurned + amount,
          }
        }),

      fetchFitness: async (userId: string) => {
        try {
          set({ loading: true, error: null })
          const res = await api.get(`/fitness?userId=${userId}`)
          const data = res.data || {}

          set({
            loading: false,
            error: null,
            goals: [
              { id: "steps", type: "steps", unit: "steps", current: data.steps || 0, target: 10000 },
              { id: "water", type: "water", unit: "liters", current: data.water || 0, target: 8 },
              { id: "sleep", type: "sleep", unit: "hours", current: data.sleep || 0, target: 8 },
            ],
            caloriesBurned: data.calories_burned || 0,
            caloriesConsumed: data.calories_intake || 0,
            proteinConsumed: data.protein || 0,
            fatConsumed: data.fat || 0,
            carbsConsumed: data.carbs || 0,
          })
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data || "Failed to fetch fitness" })
        }
      },

      updateGoalProgress: async (payload) => {
        const userId = typeof window !== "undefined" ? localStorage.getItem("id") : null
        if (!userId) {
          get().updateGoalProgressLocal(payload)
          return
        }

        get().updateGoalProgressLocal(payload)
        const state = get()
        const updates = getBackendUpdates(state)
        try {
          await api.post("/fitness", { userId, updates })
        } catch {
          // swallow backend errors, local state already updated
        }
      },

      addCalories: async (payload) => {
        const userId = typeof window !== "undefined" ? localStorage.getItem("id") : null
        if (!userId) {
          get().addCaloriesLocal(payload)
          return
        }

        get().addCaloriesLocal(payload)
        const state = get()
        const updates = getBackendUpdates(state)
        try {
          await api.post("/fitness", { userId, updates })
        } catch {
          // swallow backend errors, local state already updated
        }
      },
    }),
    { name: "patient-fitness-store" }
  )
)

