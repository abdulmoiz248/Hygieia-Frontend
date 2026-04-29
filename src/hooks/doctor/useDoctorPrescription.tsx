import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

export const useDoctorPrescription = (doctorId: string) => {
  return useQuery({
    queryKey: ["doctorPrescriptions", doctorId],
    queryFn: async () => {
      if (!doctorId) throw new Error("Missing doctorId")
      const { data } = await api.get(
        `/prescriptions/assigned?doctorId=${doctorId}`
      )
      return data.map((prescription: any) => ({
        id: prescription.id,
        diagnosis: prescription.diagnosis,
        medications: prescription.medications,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        duration: prescription.duration,
        notes: prescription.notes,
        followUpDate: new Date(prescription.follow_up_date),
        startDate: new Date(prescription.start_date),
        patientId: prescription.patient_id,
        patientName: prescription.patientName,
        doctorId: prescription.doctor_id,
      }))
    },
    enabled: !!doctorId,
    retry: false, // Don't retry — endpoint doesn't exist yet
  })
}
