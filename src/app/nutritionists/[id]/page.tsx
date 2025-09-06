
import { notFound } from "next/navigation"

import { NutritionistProfile } from "@/components/nutritionist-main/nutritionist-profile"
import { NutritionistProfile as NP } from "@/store/nutritionist/userStore"
import { useNutritionists } from "@/hooks/useNutritionist"






interface NutritionistPageProps {
  params: Promise<{ id: string }>
}

export default async function NutritionistPage({ params }: NutritionistPageProps) {
  const { id } = await params

  const { data: nutritionists = [], isLoading, isError } = useNutritionists()

  function getNutritionistById(id: string): NP | undefined {
  return nutritionists.find((nutritionist) => nutritionist.id === id)
}
  const nutritionist = getNutritionistById(id)

  if (!nutritionist) {
    notFound()
  }
    if (isLoading)
    <div className="text-center py-12">Loading nutritionists...</div>

  if(isError)
       <div className="text-center py-12 text-red-500">Failed to load data</div>


  return <NutritionistProfile nutritionist={nutritionist} />
}

// export async function generateStaticParams() {
//   // In a real app, you'd fetch this from your API
//   return [{ id: "1" }, { id: "2" }, { id: "3" }]
// }
