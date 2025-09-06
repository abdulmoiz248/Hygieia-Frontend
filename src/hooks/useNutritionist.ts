"use client"

import { useQuery } from "@tanstack/react-query"
import { NutritionistProfile } from "@/store/nutritionist/userStore"

async function fetchNutritionists(): Promise<NutritionistProfile[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/nutritionists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!res.ok) throw new Error("Failed to fetch nutritionists")
  return res.json()
}

export function useNutritionists() {
  return useQuery<NutritionistProfile[]>({
    queryKey: ["nutritionists"],
    queryFn: fetchNutritionists,
    staleTime: 1000 * 60 * 5,
  })
}
