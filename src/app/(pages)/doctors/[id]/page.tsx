import { DoctorProfile } from "@/components/doctor-main/doctor-profile"

interface DoctorPageProps {
  params: Promise<{ id: string }>
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const { id } = await params

  return <DoctorProfile id={id} />
}
