import {
  type DietPlan,
  type MealSuggestion,
  type MealPreferences,
} from "@/types/patient/dietSlice"
import { usePatientDietStore } from "@/store/patient/diet-store"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { generateAIDietPlanGrok } from "@/helpers/generateAIDietPlan"
import { generateAIMealSuggestionsGrok } from "@/helpers/generateMeal"

export const useDiet = () => {
  const dietState = usePatientDietStore()
  const profile = usePatientProfileStore((store) => store.profile)

  const generateAIDietPlan = async (preferences: string): Promise<DietPlan> => {
    dietState.setLoadingPlan(true)
    const plan = await generateAIDietPlanGrok(profile, preferences)
    // Mark as AI-generated for localStorage storage
    const aiPlan = { ...plan, isAIGenerated: true }
    dietState.setLoadingPlan(false)
    return aiPlan
  }

  const generateMealSuggestions = async (
    preferences: MealPreferences,
  ): Promise<MealSuggestion[]> => {
    dietState.setLoadingMeals(true)

    let meals: MealSuggestion[] = []
    try {
      meals = await generateAIMealSuggestionsGrok(profile, preferences)
    } catch (err) {
      console.error("AI meal generation failed, falling back to mock meals:", err)
      meals = [
        {
          id: "meal_1",
          name: "Protein-Rich Breakfast Bowl",
          type: "breakfast",
          calories: 450,
          protein: "25g",
          carbs: "40g",
          fat: "18g",
          ingredients: ["Greek yogurt", "berries", "granola", "almonds"],
          cookingTime: "5 mins",
          difficulty: "easy",
          budget: preferences.budget,
          cuisine: "Mediterranean",
        },
        {
          id: "meal_2",
          name: "Quinoa Power Lunch",
          type: "lunch",
          calories: 520,
          protein: "30g",
          carbs: "55g",
          fat: "20g",
          ingredients: ["quinoa", "grilled chicken", "vegetables", "olive oil"],
          cookingTime: "25 mins",
          difficulty: "medium",
          budget: preferences.budget,
          cuisine: "Mediterranean",
        },
        {
          id: "meal_3",
          name: "Balanced Dinner Plate",
          type: "dinner",
          calories: 480,
          protein: "35g",
          carbs: "45g",
          fat: "15g",
          ingredients: ["salmon", "sweet potato", "broccoli", "herbs"],
          cookingTime: "30 mins",
          difficulty: "medium",
          budget: preferences.budget,
          cuisine: "Modern",
        },
      ]
    }

    dietState.setLoadingMeals(false)
    return meals
  }

  const getDietPlan = async () => {
    return await dietState.fetchDietPlan()
  }

  const saveDietPlan = (plan: DietPlan) => {
    dietState.setDietPlan(plan)
  }

  const removeDietPlan = () => {
    dietState.clearDietPlan()
  }

  const saveMealSuggestions = (meals: MealSuggestion[]) => {
    dietState.setMealSuggestions(meals)
  }

  const saveMealPreferences = (preferences: MealPreferences) => {
    dietState.setMealPreferences(preferences)
  }

  const deleteAIDietPlan = () => {
    // Only delete if it's an AI-generated plan
    if (dietState.currentDietPlan?.isAIGenerated) {
      dietState.clearDietPlan()
    }
  }

  return {
    ...dietState,
    generateAIDietPlan,
    generateMealSuggestions,
    getDietPlan,
    saveDietPlan,
    removeDietPlan,
    saveMealSuggestions,
    saveMealPreferences,
    deleteAIDietPlan,
  }
}
