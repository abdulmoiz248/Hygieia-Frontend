import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DayStatus, FitnessState, Goal } from './fitness'

import { mockFitnessGoals as initialGoals } from "@/mocks/data"

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
  goals: initialGoals,
  activityLog: getInitial7Days(),
  caloriesConsumed: 190,
  caloriesBurned: 90,
  proteinConsumed: 0,
  fatConsumed: 0,
  carbsConsumed: 0,
}

const fitnessSlice = createSlice({
  name: "fitness",
  initialState,
  reducers: {
    setGoals(state, action: PayloadAction<Goal[]>) {
      state.goals = action.payload
    },
    updateGoalProgress(
      state,
      action: PayloadAction<{ type: string; amount: number }>
    ) {
      state.goals = state.goals.map((goal) =>
        goal.type === action.payload.type
          ? {
              ...goal,
              current: Math.min(goal.current + action.payload.amount, goal.target),
            }
          : goal
      )

      const allReached = state.goals.every((goal) => goal.current >= goal.target)

      if (allReached) {
        const todayStr = new Date().toDateString()
        state.activityLog = state.activityLog.map((day) =>
          day.date === todayStr ? { ...day, completed: true } : day
        )
      }
    },
    addCalories(state, action: PayloadAction<{ type: "consumed" | "burned"; amount: number; protein?: number; fat?: number; carbs?: number }>) {
  const { type, amount, protein, fat, carbs } = action.payload
  if (type === "consumed") {
    state.caloriesConsumed += amount
    if (protein) state.proteinConsumed += protein
    if (fat) state.fatConsumed += fat
    if (carbs) state.carbsConsumed += carbs
  } else {
    state.caloriesBurned += amount
  }
},
  },
})

export const { setGoals, updateGoalProgress, addCalories } = fitnessSlice.actions
export default fitnessSlice.reducer

