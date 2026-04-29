import { create } from "zustand"
import { devtools } from "zustand/middleware"
import api from "@/lib/axios"

export interface Prescription {
  id?: string
  diagnosis: string
  medications: string
  dosage: string
  frequency: string
  duration: string
  notes: string
  followUpDate: string | Date
  startDate: string | Date
  patientId?: string
  patientName?: string
  doctorId?: string
}

interface DoctorPrescriptionStore {
  prescriptions: Prescription[]
  selectedPrescription: Prescription | null
  filters: {
    status: string
    search: string
  }
  isLoading: boolean

  setPrescriptionsData: (prescriptions: Prescription[]) => void
  setPrescriptions: (prescriptions: Prescription[]) => void
  setSelectedPrescription: (prescription: Prescription | null) => void
  addPrescription: (prescription: Prescription) => void
  updatePrescription: (id: string, updates: Partial<Prescription>) => void
  updatePrescriptionBackend: (
    prescriptionId: string,
    updates: Partial<Prescription>,
    doctorId: string
  ) => Promise<void>
  setFilters: (filters: Partial<DoctorPrescriptionStore["filters"]>) => void
  setLoading: (loading: boolean) => void
}

export const useDoctorPrescriptionStore = create<DoctorPrescriptionStore>()(
  devtools(
    (set, get) => ({
      prescriptions: [],
      selectedPrescription: null,
      filters: { status: "all", search: "" },
      isLoading: true,

      setPrescriptions: (prescriptions) => set({ prescriptions }),
      setPrescriptionsData: (prescriptions) => set({ prescriptions }),
      setSelectedPrescription: (prescription) =>
        set({ selectedPrescription: prescription }),

      addPrescription: (prescription) =>
        set((state) => ({
          prescriptions: [...state.prescriptions, prescription],
        })),

      updatePrescription: (id, updates) =>
        set((state) => ({
          prescriptions: state.prescriptions.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),

      setLoading: (loading) => set({ isLoading: loading }),

      updatePrescriptionBackend: async (prescriptionId, updates, doctorId) => {
        set({ isLoading: true })
        try {
          const payload = toSnakeCase({ ...updates, doctorId })
          const { data } = await api.patch(
            `/prescriptions/${prescriptionId}`,
            payload
          )

          const updatedPrescription: Prescription = {
            id: data.id,
            diagnosis: data.diagnosis,
            medications: data.medications,
            dosage: data.dosage,
            frequency: data.frequency,
            duration: data.duration,
            notes: data.notes,
            followUpDate: data.follow_up_date,
            startDate: data.start_date,
            patientId: data.patient_id,
            patientName: data.patientName,
            doctorId: data.doctor_id,
          }

          get().updatePrescription(prescriptionId, updatedPrescription)
        } catch (err: any) {
          console.error("Failed to update prescription:", err.message || err)
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    { name: "doctor-prescription-store" }
  )
)

const toSnakeCase = (prescription: Partial<Prescription>) => ({
  diagnosis: prescription.diagnosis,
  medications: prescription.medications,
  dosage: prescription.dosage,
  frequency: prescription.frequency,
  duration: prescription.duration,
  notes: prescription.notes,
  follow_up_date: prescription.followUpDate,
  start_date: prescription.startDate,
  patient_id: prescription.patientId,
  doctor_id: prescription.doctorId,
})
