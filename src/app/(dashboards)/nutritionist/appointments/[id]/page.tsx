import Appointment from "@/components/nutritionist/appointments/id/Appointment"

export default async function AppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <Appointment appointmentId={id} />
}
