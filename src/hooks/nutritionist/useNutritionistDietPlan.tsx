import { useQuery } from '@tanstack/react-query'
import api from "@/lib/axios"

export const useNutritionistDietPlan = (nutritionistId: string) => {
  return useQuery({
    queryKey: ['dietPlans', nutritionistId],
    queryFn: async () => {
      if (!nutritionistId) throw new Error('Missing nutritionistId')
      const { data } = await api.get(`/diet-plans/assigned?nutritionistId=${nutritionistId}`)
      return data.map((plan: any) => ({
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
        patientName: plan.patientName,
        nutritionistId: plan.nutritionist_id,
      }))
    },
    enabled: !!nutritionistId,
  })
}
