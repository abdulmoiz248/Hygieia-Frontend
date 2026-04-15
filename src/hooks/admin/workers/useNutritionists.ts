import { useQuery } from "@tanstack/react-query"
import { fetchNutritionists } from "@/api/admin/workers.api"

export const nutritionistsQueryKey = ["workers", "nutritionist"] as const

export function useNutritionists() {
  return useQuery({
    queryKey: nutritionistsQueryKey,
    queryFn: fetchNutritionists,
    staleTime: 5 * 60 * 1000,
  })
}
