import DoctorAppointment from "@/components/doctor-portal/appointments/id/DoctorAppointment"

export default async function DoctorAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <DoctorAppointment appointmentId={id} />
}
