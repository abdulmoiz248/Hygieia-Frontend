import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { Prescription } from "@/store/doctor/doctor-prescription-store"

export const useDoctorPrescription = (doctorId: string) => {
  return useQuery({
    queryKey: ["doctorPrescriptions", doctorId],
    queryFn: async (): Promise<Prescription[]> => {
      if (!doctorId) throw new Error("Missing doctorId")

      // GET /appointments/prescription/assigned?doctorId=...
      const { data } = await api.get("/appointments/prescriptions/assigned", {
        params: { doctorId },
      })

      const items: any[] = Array.isArray(data) ? data : data.items ?? []

      return items.map((prescription: any): Prescription => {
        // medications always come as an array from the backend
        const meds: any[] = Array.isArray(prescription.medications)
          ? prescription.medications
          : []

        // frequency & duration live inside each medication object, not at top-level
        const firstMed = meds[0]
        const frequency = prescription.frequency ?? firstMed?.frequency ?? ""
        const duration = prescription.duration ?? firstMed?.duration ?? ""
        const dosage = prescription.dosage ?? firstMed?.dosage ?? ""

        // backend may return end_date OR follow_up_date
        const rawEndDate =
          prescription.end_date ??
          prescription.follow_up_date ??
          prescription.followUpDate ??
          null

        return {
          id: prescription.id,
          diagnosis: prescription.diagnosis ?? "",
          medications: JSON.stringify(meds),
          dosage,
          frequency,
          duration,
          notes: prescription.notes ?? "",
          followUpDate: rawEndDate ? new Date(rawEndDate) : "",
          startDate: prescription.start_date
            ? new Date(prescription.start_date)
            : "",
          patientId: prescription.patient_id ?? prescription.patientId,
          patientName: prescription.patientName ?? prescription.patient?.name ?? "",
          doctorId: prescription.doctor_id ?? prescription.doctorId,
        }
      })
    },
    enabled: !!doctorId,
  })
}
