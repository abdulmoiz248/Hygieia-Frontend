import api from "@/lib/axios"
import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"


export interface DietPlan {
  id?: string
  dailyCalories: string
  protein: string
  carbs: string
  fat: string
  deficiency: string
  notes: string
  caloriesBurned: string
  exercise: string
  startDate: string | Date
  endDate: string | Date
  patientId?: string
  patientName?: string
  nutritionistId?: string
}

export interface MealSuggestion {
  id: string
  name: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  calories: number
  protein: string
  carbs: string
  fat: string
  ingredients: string[]
  cookingTime: string
  difficulty: "easy" | "medium" | "hard"
  budget: "low" | "medium" | "high"
  cuisine: string
}

export interface MealPreferences {
  budget: "low" | "medium" | "high"
  cuisine: string[]
  cookingTime: "quick" | "medium" | "long"
  difficulty: "easy" | "medium" | "hard"
  dietaryRestrictions: string[]
}

interface DietState {
  currentDietPlan: DietPlan | null
  todayMealSuggestions: MealSuggestion[]
  mealPreferences: MealPreferences | null
  isLoadingPlan: boolean
  isLoadingMeals: boolean
}

const initialState: DietState = {
  currentDietPlan: null,
  todayMealSuggestions: [],
  mealPreferences: null,
  isLoadingPlan: false,
  isLoadingMeals: false,
}

const getTodaysDietPlan = (): DietPlan | null => {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem("aiDietPlan")
    if (!stored) return null
    const { plan, date } = JSON.parse(stored)
    const today = new Date().toDateString()
    if (date === today) return plan
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

initialState.currentDietPlan = getTodaysDietPlan()
initialState.todayMealSuggestions = getTodaysMeals()

export const fetchDietPlan = createAsyncThunk<DietPlan | null>(
  "diet/fetchDietPlan",
  async () => {
    try {
      const id = typeof window !== "undefined" ? localStorage.getItem("id") : null
      if (!id) return getTodaysDietPlan()

      const res = await api.get(`/diet-plans/patient/${id}`)
      const data = res.data as DietPlan | DietPlan[] | null

      // Handle possible array response
      let plan: DietPlan | null = null
      if (Array.isArray(data)) {
        plan = data.length > 0 ? data[0] : null
      } else {
        plan = data
      }

      if (plan) {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "aiDietPlan",
            JSON.stringify({ plan, date: new Date().toDateString() })
          )
        }
        return plan
      }

      // No backend plan, fallback to localStorage
      return getTodaysDietPlan()
    } catch {
      return getTodaysDietPlan()
    }
  }
)


const dietSlice = createSlice({
  name: "diet",
  initialState,
  reducers: {
    setDietPlan: (state, action: PayloadAction<DietPlan>) => {
      state.currentDietPlan = action.payload
      if (typeof window !== "undefined") {
        const dataToStore = {
          plan: action.payload,
          date: new Date().toDateString(),
        }
        localStorage.setItem("aiDietPlan", JSON.stringify(dataToStore))
      }
    },
    clearDietPlan: (state) => {
      state.currentDietPlan = null
      if (typeof window !== "undefined") {
        localStorage.removeItem("aiDietPlan")
      }
    },
    setMealSuggestions: (state, action: PayloadAction<MealSuggestion[]>) => {
      state.todayMealSuggestions = action.payload
      if (typeof window !== "undefined") {
        const dataToStore = {
          meals: action.payload,
          date: new Date().toDateString(),
        }
        localStorage.setItem("aiMeals", JSON.stringify(dataToStore))
      }
    },
    clearMealSuggestions: (state) => {
      state.todayMealSuggestions = []
      if (typeof window !== "undefined") {
        localStorage.removeItem("aiMeals")
      }
    },
    setMealPreferences: (state, action: PayloadAction<MealPreferences>) => {
      state.mealPreferences = action.payload
    },
    setLoadingPlan: (state, action: PayloadAction<boolean>) => {
      state.isLoadingPlan = action.payload
    },
    setLoadingMeals: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMeals = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDietPlan.pending, (state) => {
      state.isLoadingPlan = true
    })
    builder.addCase(fetchDietPlan.fulfilled, (state, action) => {
      state.isLoadingPlan = false
      if (action.payload) state.currentDietPlan = action.payload
    })
    builder.addCase(fetchDietPlan.rejected, (state) => {
      state.isLoadingPlan = false
    })
  },
})

export const {
  setDietPlan,
  clearDietPlan,
  setMealSuggestions,
  clearMealSuggestions,
  setMealPreferences,
  setLoadingPlan,
  setLoadingMeals,
} = dietSlice.actions

export default dietSlice.reducer
