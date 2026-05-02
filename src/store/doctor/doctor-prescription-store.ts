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
          let medicationsArray: object[] = []
          if (updates.medications) {
            try {
              medicationsArray = JSON.parse(updates.medications as string)
            } catch {
              medicationsArray = [{ name: updates.medications }]
            }
          }

          // PATCH /appointments/prescriptions/{id}
          const { data } = await api.patch(
            `/appointments/prescriptions/${prescriptionId}`,
            {
              doctorId,
              dto: {
                notes: updates.notes,
                startDate: updates.startDate,
                endDate: updates.followUpDate,
                status: "active",
                medications: medicationsArray,
              },
            }
          )

          const updatedPrescription: Prescription = {
            id: data.id ?? prescriptionId,
            diagnosis: data.diagnosis ?? updates.diagnosis ?? "",
            medications: Array.isArray(data.medications)
              ? JSON.stringify(data.medications)
              : data.medications ?? updates.medications ?? "",
            dosage: data.dosage ?? updates.dosage ?? "",
            frequency: data.frequency ?? updates.frequency ?? "",
            duration: data.duration ?? updates.duration ?? "",
            notes: data.notes ?? updates.notes ?? "",
            followUpDate: data.end_date ?? data.follow_up_date ?? updates.followUpDate ?? "",
            startDate: data.start_date ?? updates.startDate ?? "",
            patientId: data.patient_id ?? updates.patientId ?? "",
            patientName: data.patientName ?? updates.patientName ?? "",
            doctorId: data.doctor_id ?? doctorId,
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