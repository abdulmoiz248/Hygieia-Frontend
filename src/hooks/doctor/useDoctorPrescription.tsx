import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { Prescription } from "@/store/doctor/doctor-prescription-store"

export const useDoctorPrescription = (doctorId: string) => {
  return useQuery({
    queryKey: ["doctorPrescriptions", doctorId],
    queryFn: async (): Promise<Prescription[]> => {
      if (!doctorId) throw new Error("Missing doctorId")

      const { data } = await api.get("/appointments/prescriptions/assigned", {
        params: { doctorId },
      })

      const items: any[] = Array.isArray(data) ? data : data.items ?? []

      return items.map((prescription: any): Prescription => ({
        id: prescription.id,
        diagnosis: prescription.diagnosis ?? "",
        medications: Array.isArray(prescription.medications)
          ? JSON.stringify(prescription.medications)
          : prescription.medications ?? "",
        dosage: prescription.dosage ?? "",
        frequency: prescription.frequency ?? "",
        duration: prescription.duration ?? "",
        notes: prescription.notes ?? "",
        followUpDate: prescription.follow_up_date
          ? new Date(prescription.follow_up_date)
          : "",
        startDate: prescription.start_date
          ? new Date(prescription.start_date)
          : "",
        patientId: prescription.patient_id ?? prescription.patientId,
        patientName: prescription.patientName ?? prescription.patient?.name ?? "",
        doctorId: prescription.doctor_id ?? prescription.doctorId,
      }))
    },
    enabled: !!doctorId,
  })
}
