import { useQuery } from '@tanstack/react-query'
import api from "@/lib/axios"
import { Appointment, AppointmentStatus, AppointmentTypes, AppointmentMode } from "@/types/patient/appointment"
import { ProfileType } from "@/types/patient/profile"
import { Doctor } from "@/types/doctor/profile"

// ✅ Maps raw backend appointment to the Appointment interface used across the app
function mapBackendAppointment(raw: any): Appointment {
  return {
    id: raw.id,
    // ✅ Map full patient details from backend (patientDetails object)
    patient: {
      id: raw.patientId ?? raw.patient_id,
      name: raw.patientDetails?.name ?? raw.patientName ?? "Unknown Patient",
      email: raw.patientDetails?.email ?? "",
      avatar: raw.patientDetails?.avatar ?? raw.patientDetails?.profileImage ?? null,
      dateOfBirth: raw.patientDetails?.dateOfBirth ?? raw.patientDetails?.date_of_birth ?? null,
      bloodType: raw.patientDetails?.bloodType ?? raw.patientDetails?.blood_type ?? null,
      weight: raw.patientDetails?.weight ?? null,
      height: raw.patientDetails?.height ?? null,
      emergencyContact: raw.patientDetails?.emergencyContact ?? raw.patientDetails?.emergency_contact ?? null,
      conditions: raw.patientDetails?.conditions ?? raw.patientDetails?.medicalConditions ?? null,
      allergies: raw.patientDetails?.allergies ?? null,
      medications: raw.patientDetails?.medications ?? null,
      ongoingMedications: raw.patientDetails?.ongoingMedications ?? raw.patientDetails?.ongoing_medications ?? null,
    } as ProfileType,
    doctor: raw.doctorDetails
      ? (raw.doctorDetails as Doctor)
      : ({ id: raw.doctorId, name: "Unknown Doctor" } as Doctor),
    date: raw.date,
    time: raw.time,
    status: raw.status as AppointmentStatus,
    type: raw.type as AppointmentTypes,
    notes: raw.notes ?? undefined,
    report: raw.report ?? undefined,
    mode: raw.mode as AppointmentMode,
    dataShared: raw.dataShared ?? raw.data_shared ?? false,
    start_link: raw.start_link ?? undefined,
    location: raw.location ?? undefined,
    link: raw.link ?? undefined,
  }
}

export const useDoctorAppointment = (doctorId: string, status: string = 'all') => {
  return useQuery({
    queryKey: ['doctor-appointments', doctorId, status],
    queryFn: async (): Promise<Appointment[]> => {
      if (!doctorId) throw new Error('Missing doctorId')

      const url = `/appointments?doctorId=${doctorId}${status !== 'all' ? `&status=${status}` : ''}`
      const res = await api.get(url)

      const items: any[] = res.data.items ?? res.data ?? []

      return items.map(mapBackendAppointment)
    },
    enabled: !!doctorId,
  })
}
