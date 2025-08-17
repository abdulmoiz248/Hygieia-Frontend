import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface DietPlan {
  id: string
  patientId: string
  patientName: string
  patientAvatar?: string
  planName: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "paused" | "expired"
  compliance: number
  lastUpdate: string
  goals: string[]
  restrictions: string[]
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  meals: {
    breakfast: string[]
    lunch: string[]
    dinner: string[]
    snacks: string[]
  }
  progress: {
    week: number
    weight: string
    notes: string
    compliance: number
  }[]
  sessionNotes: string
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
      dietPlans: [
        {
          id: "1",
          patientId: "1",
          patientName: "Emma Wilson",
          planName: "Weight Management Plan",
          startDate: "2024-01-15",
          endDate: "2024-04-15",
          status: "active",
          compliance: 92,
          lastUpdate: "2 days ago",
          goals: ["Lose 10 kg", "Improve energy levels", "Better sleep"],
          restrictions: ["Vegetarian", "Low sodium", "No nuts"],
          calories: 1800,
          macros: { protein: 25, carbs: 45, fat: 30 },
          meals: {
            breakfast: ["Oatmeal with berries", "Greek yogurt", "Green tea"],
            lunch: ["Quinoa salad", "Grilled vegetables", "Hummus"],
            dinner: ["Lentil curry", "Brown rice", "Steamed broccoli"],
            snacks: ["Apple slices", "Almonds", "Herbal tea"],
          },
          progress: [
            { week: 1, weight: "68 kg", notes: "Good start, feeling motivated", compliance: 95 },
            { week: 2, weight: "67.5 kg", notes: "Slight weight loss, energy improving", compliance: 90 },
          ],
          sessionNotes: "Patient is responding well to the plan. Recommend continuing current approach.",
        },
        {
          id: "2",
          patientId: "2",
          patientName: "Michael Chen",
          planName: "Diabetes Management Plan",
          startDate: "2024-02-01",
          endDate: "2024-08-01",
          status: "active",
          compliance: 78,
          lastUpdate: "1 day ago",
          goals: ["Control blood sugar", "Lose 5 kg", "Reduce medication dependency"],
          restrictions: ["Low carb", "Low sodium", "No sugar"],
          calories: 2000,
          macros: { protein: 30, carbs: 35, fat: 35 },
          meals: {
            breakfast: ["Scrambled eggs", "Avocado", "Whole grain toast"],
            lunch: ["Grilled chicken salad", "Olive oil dressing"],
            dinner: ["Baked salmon", "Roasted vegetables", "Cauliflower rice"],
            snacks: ["Nuts", "Cheese", "Cucumber slices"],
          },
          progress: [
            { week: 1, weight: "82 kg", notes: "Adjusting to new diet", compliance: 80 },
            { week: 2, weight: "81.5 kg", notes: "Blood sugar levels improving", compliance: 75 },
          ],
          sessionNotes: "Need to work on compliance. Patient struggling with carb restrictions.",
        },
      ],
      selectedDietPlan: null,
      filters: {
        status: "all",
        compliance: "all",
        search: "",
      },
      isLoading: false,

      setDietPlans: (plans) => set({ dietPlans: plans }),

      setSelectedDietPlan: (plan) => set({ selectedDietPlan: plan }),

      addDietPlan: (plan) =>
        set((state) => ({
          dietPlans: [...state.dietPlans, plan],
        })),

      updateDietPlan: (id, updates) =>
        set((state) => ({
          dietPlans: state.dietPlans.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan)),
        })),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: "diet-plan-store" },
  ),
)
