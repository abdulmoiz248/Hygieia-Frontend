import LabTestDetailClient from "@/components/lab-tests/LabTestDetailClient"


interface LabTestDetailPageProps {
  params: { id: string }
}

export default async function LabTestDetailPage({ params }: LabTestDetailPageProps) {
   const { id } = await params
  return <LabTestDetailClient id={id} />
}
