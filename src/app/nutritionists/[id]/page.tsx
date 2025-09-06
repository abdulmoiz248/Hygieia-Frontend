import { NutritionistProfile } from "@/components/nutritionist-main/nutritionist-profile"







interface NutritionistPageProps {
  params: Promise<{ id: string }>
}

export default async function NutritionistPage({ params }: NutritionistPageProps) {
  const { id } = await params

  

  return <NutritionistProfile id={id} />
}

// export async function generateStaticParams() {
//   // In a real app, you'd fetch this from your API
//   return [{ id: "1" }, { id: "2" }, { id: "3" }]
// }
