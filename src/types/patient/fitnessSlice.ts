import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { DayStatus, FitnessState, Goal } from './fitness'
import api from "@/lib/axios"

// ✅ Fetch fitness data from backend
export const fetchFitness = createAsyncThunk(
  "fitness/fetchFitness",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/fitness?userId=${userId}`)
      console.log(res)
      return res.data[0]
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch fitness")
    }
  }
)

// ✅ Update fitness data in backend
export const updateFitness = createAsyncThunk(
  "fitness/updateFitness",
  async ({ userId, updates }: { userId: string; updates: Partial<FitnessState> }, { rejectWithValue }) => {
    try {
      const res = await api.post('/fitness', { userId, updates })
    
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to update fitness")
    }
  }
)

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

const fitnessSlice = createSlice({
  name: "fitness",
  initialState,
  reducers: {
    setGoals(state, action: PayloadAction<Goal[]>) {
      state.goals = action.payload
    },
    updateGoalProgressLocal(
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
    addCaloriesLocal(
      state,
      action: PayloadAction<{
        type: "consumed" | "burned"
        amount: number
        protein?: number
        fat?: number
        carbs?: number
      }>
    ) {
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchFitness.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFitness.fulfilled, (state, action) => {
        state.loading = false
        state.error = null

        const data = action.payload || {}
        
        state.goals = [
          { id: "steps", type: "steps", unit: "steps", current: data.steps || 0, target: 10000 },
          { id: "water", type: "water", unit: "liters", current: data.water || 0, target: 8 },
          { id: "sleep", type: "sleep", unit: "hours", current: data.sleep || 0, target: 8 },
        ]
        state.caloriesBurned = data.calories_burned || 0
        state.caloriesConsumed = data.calories_intake || 0
        state.proteinConsumed = data.protein || 0
        state.fatConsumed = data.fat || 0
        state.carbsConsumed = data.carbs || 0
      })
      .addCase(fetchFitness.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateFitness.fulfilled, (state, action) => {
        const data = action.payload || {}
        state.caloriesBurned = data.calories_burned ?? state.caloriesBurned
        state.caloriesConsumed = data.calories_intake ?? state.caloriesConsumed
        state.proteinConsumed = data.protein ?? state.proteinConsumed
        state.fatConsumed = data.fat ?? state.fatConsumed
        state.carbsConsumed = data.carbs ?? state.carbsConsumed
      })
  },
})

export const { setGoals, updateGoalProgressLocal, addCaloriesLocal } = fitnessSlice.actions

// ✅ Thunk wrappers (auto use localStorage userId)

// helper to strip out frontend-only keys
const getBackendUpdates = (state: FitnessState):Partial<FitnessState | unknown> => ({
  steps: state.goals.find(g => g.type === "steps")?.current || 0,
  water: state.goals.find(g => g.type === "water")?.current || 0,
  sleep: state.goals.find(g => g.type === "sleep")?.current || 0,
  calories_intake: state.caloriesConsumed,
  calories_burned: state.caloriesBurned,
  protein: state.proteinConsumed,
  fat: state.fatConsumed,
  carbs: state.carbsConsumed,
})


export const updateGoalProgress = (payload: { type: string; amount: number }) =>
  (dispatch: any, getState: any) => {
    dispatch(updateGoalProgressLocal(payload))
    const userId = localStorage.getItem("id")
    if (!userId) return
    const state = getState().fitness as FitnessState
    dispatch(updateFitness({ userId, updates: getBackendUpdates(state) }))
  }

export const addCalories = (
  payload: { type: "consumed" | "burned"; amount: number; protein?: number; fat?: number; carbs?: number }
) =>
  (dispatch: any, getState: any) => {
    dispatch(addCaloriesLocal(payload))
    const userId = localStorage.getItem("id")
    if (!userId) return
    const state = getState().fitness as FitnessState
    dispatch(updateFitness({ userId, updates: getBackendUpdates(state) }))
  }


export default fitnessSlice.reducer
