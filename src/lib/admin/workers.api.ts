import { Worker, Role } from "@/types/admin/workers"

export async function fetchDoctors(): Promise<Worker[]> {
  const res = await fetch("http://localhost:4000/doctors")
  if (!res.ok) throw new Error("Failed to fetch doctors")
  const data = await res.json()
  return (Array.isArray(data) ? data : data.doctors ?? []).map((d: any) => ({
    ...d,
    role: "doctor" as Role,
  }))
}

export async function fetchNutritionists(): Promise<Worker[]> {
  const res = await fetch("http://localhost:4000/nutritionists")
  if (!res.ok) throw new Error("Failed to fetch nutritionists")
  const data = await res.json()
  return (Array.isArray(data) ? data : data.nutritionists ?? []).map((n: any) => ({
    ...n,
    role: "nutritionist" as Role,
  }))
}

// Endpoint: http://localhost:4000/pathologists (not yet available)
export async function fetchPathologists(): Promise<Worker[]> {
  return []
}
