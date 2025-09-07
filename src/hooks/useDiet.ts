import { useSelector, useDispatch } from "react-redux"
import {
  setDietPlan,
  clearDietPlan,
  setMealSuggestions,
  setMealPreferences,
  setLoadingPlan,
  setLoadingMeals,
  type DietPlan,
  type MealSuggestion,
  type MealPreferences,
  fetchDietPlan,
} from "@/types/patient/dietSlice"
import { RootState, AppDispatch } from "@/store/patient/store"
import { generateAIDietPlanGrok } from "@/helpers/generateAIDietPlan"
import { generateAIMealSuggestionsGrok } from "@/helpers/generateMeal"

export const useDiet = () => {
  const dispatch = useDispatch<AppDispatch>()
  const dietState = useSelector((state: RootState) => state.diet)
  const profile = useSelector((store: RootState) => store.profile)

  const generateAIDietPlan = async (preferences: string): Promise<DietPlan> => {
    dispatch(setLoadingPlan(true))
    const plan = await generateAIDietPlanGrok(profile, preferences)
    dispatch(setLoadingPlan(false))
    return plan
  }

  const generateMealSuggestions = async (
    preferences: MealPreferences,
  ): Promise<MealSuggestion[]> => {
    dispatch(setLoadingMeals(true))

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

    dispatch(setLoadingMeals(false))
    return meals
  }

  const getDietPlan = async () => {
    return await dispatch(fetchDietPlan()).unwrap()
  }

  const saveDietPlan = (plan: DietPlan) => {
    dispatch(setDietPlan(plan))
  }

  const removeDietPlan = () => {
    dispatch(clearDietPlan())
  }

  const saveMealSuggestions = (meals: MealSuggestion[]) => {
    dispatch(setMealSuggestions(meals))
  }

  const saveMealPreferences = (preferences: MealPreferences) => {
    dispatch(setMealPreferences(preferences))
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
  }
}
