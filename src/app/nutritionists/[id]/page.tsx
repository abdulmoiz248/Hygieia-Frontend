
import { notFound } from "next/navigation"

import { NutritionistProfile } from "@/components/nutritionist-main/nutritionist-profile"
import { NutritionistProfile as NP } from "@/store/nutritionist/userStore"

export const mockNutritionists: NP[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@nutrition.com",
    phone: "+1 (555) 123-4567",
    gender: "Female",
    dateofbirth: "1985-03-15",
    img: "/placeholder.svg?height=300&width=300",
    specialization: "Sports Nutrition",
    experienceYears: 8,
    certifications: ["Certified Sports Nutritionist", "Registered Dietitian"],
    education: ["MS in Nutrition Science - Stanford University", "BS in Dietetics - UC Berkeley"],
    languages: ["English", "Mandarin", "Spanish"],
    bio: "Specialized in optimizing athletic performance through personalized nutrition strategies. Worked with Olympic athletes and professional sports teams.",
    consultationFee: 150,
    workingHours: [
      { day: "Monday", start: "09:00", end: "17:00" },
      { day: "Tuesday", start: "09:00", end: "17:00" },
      { day: "Wednesday", start: "09:00", end: "17:00" },
      { day: "Thursday", start: "09:00", end: "17:00" },
      { day: "Friday", start: "09:00", end: "15:00" },
    ],
    rating: 4.9,
  },
  {
    id: "2",
    name: "Dr. Michael Rodriguez",
    email: "michael.rodriguez@wellness.com",
    phone: "+1 (555) 234-5678",
    gender: "Male",
    dateofbirth: "1982-07-22",
    img: "/placeholder.svg?height=300&width=300",
    specialization: "Clinical Nutrition",
    experienceYears: 12,
    certifications: ["Registered Dietitian Nutritionist", "Certified Diabetes Educator"],
    education: ["PhD in Clinical Nutrition - Harvard University", "MS in Nutrition - NYU"],
    languages: ["English", "Spanish", "Portuguese"],
    bio: "Expert in managing chronic diseases through evidence-based nutrition interventions. Specializes in diabetes, heart disease, and metabolic disorders.",
    consultationFee: 180,
    workingHours: [
      { day: "Monday", start: "08:00", end: "16:00" },
      { day: "Tuesday", start: "08:00", end: "16:00" },
      { day: "Wednesday", start: "10:00", end: "18:00" },
      { day: "Thursday", start: "08:00", end: "16:00" },
      { day: "Friday", start: "08:00", end: "14:00" },
    ],
    rating: 4.8,
  },
  {
    id: "3",
    name: "Dr. Emily Johnson",
    email: "emily.johnson@plantbased.com",
    phone: "+1 (555) 345-6789",
    gender: "Female",
    dateofbirth: "1990-11-08",
    img: "/placeholder.svg?height=300&width=300",
    specialization: "Plant-Based Nutrition",
    experienceYears: 6,
    certifications: ["Plant-Based Nutrition Certificate", "Registered Dietitian"],
    education: ["MS in Nutrition - Cornell University", "BS in Food Science - UC Davis"],
    languages: ["English", "French"],
    bio: "Passionate about sustainable nutrition and plant-based lifestyles. Helps clients transition to healthier, environmentally conscious eating patterns.",
    consultationFee: 120,
    workingHours: [
      { day: "Monday", start: "10:00", end: "18:00" },
      { day: "Tuesday", start: "10:00", end: "18:00" },
      { day: "Wednesday", start: "09:00", end: "17:00" },
      { day: "Thursday", start: "10:00", end: "18:00" },
      { day: "Saturday", start: "09:00", end: "13:00" },
    ],
    rating: 4.7,
  },
]

export function getNutritionistById(id: string): NP | undefined {
  return mockNutritionists.find((nutritionist) => nutritionist.id === id)
}


interface NutritionistPageProps {
  params: Promise<{ id: string }>
}

export default async function NutritionistPage({ params }: NutritionistPageProps) {
  const { id } = await params
  const nutritionist = getNutritionistById(id)

  if (!nutritionist) {
    notFound()
  }

  return <NutritionistProfile nutritionist={nutritionist} />
}

// export async function generateStaticParams() {
//   // In a real app, you'd fetch this from your API
//   return [{ id: "1" }, { id: "2" }, { id: "3" }]
// }
