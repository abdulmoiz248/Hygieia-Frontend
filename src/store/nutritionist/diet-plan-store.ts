import { create } from "zustand"
import { devtools } from "zustand/middleware"
import axios from "axios"
import api from "@/lib/axios"

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
  nutritionistId?:string
}

interface DietPlanStore {
  dietPlans: DietPlan[]
  selectedDietPlan: DietPlan | null
  filters: {
    status: string
    compliance: string
    search: string
  }
  isLoading: boolean

  // Actions
  fetchDietPlans: (nutritionistId: string) => Promise<void>
  updateDietPlanBackend: (dietPlanId: string, updates: Partial<DietPlan>, nutritionistId: string) => Promise<void>
  setDietPlans: (plans: DietPlan[]) => void
  setSelectedDietPlan: (plan: DietPlan | null) => void
  addDietPlan: (plan: DietPlan) => void
  updateDietPlan: (id: string, updates: Partial<DietPlan>) => void
  setFilters: (filters: Partial<DietPlanStore["filters"]>) => void
  setLoading: (loading: boolean) => void
}

export const useDietPlanStore = create<DietPlanStore>()(
  devtools(
    (set, get) => ({
      dietPlans: [],
      selectedDietPlan: null,
      filters: { status: "all", compliance: "all", search: "" },
      isLoading: false,

      setDietPlans: (plans) => set({ dietPlans: plans }),
      setSelectedDietPlan: (plan) => set({ selectedDietPlan: plan }),
      addDietPlan: (plan) => set((state) => ({ dietPlans: [...state.dietPlans, plan] })),
      updateDietPlan: (id, updates) =>
        set((state) => ({ dietPlans: state.dietPlans.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan)) })),
      setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      setLoading: (loading) => set({ isLoading: loading }),

      // fetch diet plans assigned to the nutritionist from backend
    fetchDietPlans: async (nutritionistId) => {
  set({ isLoading: true })
  try {
    const { data } = await api.get(`/diet-plans/assigned?nutritionistId=${nutritionistId}`)
 
   const camelData:DietPlan[] = data.map((plan: any) => ({
  id: plan.id,
  dailyCalories: plan.daily_calories,
  protein: plan.protein,
  carbs: plan.carbs,
  fat: plan.fat,
  deficiency: plan.deficiency,
  notes: plan.notes,
  caloriesBurned: plan.calories_burned,
  exercise: plan.exercise,
  startDate: new Date(plan.start_date),
  endDate: new Date(plan.end_date),
  patientId: plan.patient_id,
  patientName: plan.patient_name,
  nutritionistId: plan.nutritionist_id,
}))

   
    set({ dietPlans: camelData })
  } catch (err: any) {
    console.error("Failed to fetch diet plans:", err.message || err)
  } finally {
    set({ isLoading: false })
  }
}
,

      // update diet plan both in store and backend
    updateDietPlanBackend: async (dietPlanId, updates, nutritionistId) => {
  set({ isLoading: true })
  try {
    const payload = toSnakeCase({ ...updates, nutritionistId }) // map camelCase -> snake_case
    const { data } = await api.patch(`/diet-plans/${dietPlanId}`, payload)
    
    // convert backend response to camelCase before updating store
    const updatedPlan: DietPlan = {
      id: data.id,
      dailyCalories: data.daily_calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      deficiency: data.deficiency,
      notes: data.notes,
      caloriesBurned: data.calories_burned,
      exercise: data.exercise,
      startDate: data.start_date,
      endDate: data.end_date,
      patientId: data.patient_id,
      patientName: data.patient_name,
      nutritionistId: data.nutritionist_id,
    }

    get().updateDietPlan(dietPlanId, updatedPlan)
  } catch (err: any) {
    console.error("Failed to update diet plan:", err.message || err)
  } finally {
    set({ isLoading: false })
  }
}

    }),
    { name: "diet-plan-store" }
  )
)

const toSnakeCase = (plan: Partial<DietPlan>) => ({
  daily_calories: plan.dailyCalories,
  protein: plan.protein,
  carbs: plan.carbs,
  fat: plan.fat,
  deficiency: plan.deficiency,
  notes: plan.notes,
  calories_burned: plan.caloriesBurned,
  exercise: plan.exercise,
  start_date: plan.startDate,
  end_date: plan.endDate,
  patient_id: plan.patientId,
  nutritionist_id: plan.nutritionistId,
})

