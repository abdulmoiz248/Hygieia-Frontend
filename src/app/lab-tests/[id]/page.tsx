import LabTestDetailClient from "@/components/lab-tests/LabTestDetailClient"


interface LabTestDetailPageProps {
  params: { id: string }
}

export default function LabTestDetailPage({ params }: LabTestDetailPageProps) {
  return <LabTestDetailClient id={params.id} />
}
