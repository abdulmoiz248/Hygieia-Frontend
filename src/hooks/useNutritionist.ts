"use client"

import { useQuery } from "@tanstack/react-query"
import { NutritionistProfile } from "@/store/nutritionist/userStore"
import api from "@/lib/axios"

async function fetchNutritionists(): Promise<NutritionistProfile[]> {
  const res = await api.get('/nutritionists')

  if (!res.data) throw new Error("Failed to fetch nutritionists")

    console.log("data",res.data)
  const mapped: NutritionistProfile[] = res.data.map((n: any) => ({
    id: n.id || n._id,
    name: n.name,
    email: n.email || "", // backend not sending, so fallback
    phone: n.phone,
    gender: n.gender,
    dateofbirth: n.dateofbirth,
    img: n.img,
    specialization: n.specialization,
    experienceYears: n.experienceYears,
    certifications: n.certifications || [],
    education: n.education || [],
    languages: n.languages || [],
    bio: n.bio,
    consultationFee: n.consultationFee,
    workingHours: n.workingHours || [],
    rating: n.rating,
  }))

  console.log("mapped",mapped)

  return mapped
}

export function useNutritionists() {
  return useQuery<NutritionistProfile[]>({
    queryKey: ["nutritionists"],
    queryFn: fetchNutritionists,
   
  })
}
