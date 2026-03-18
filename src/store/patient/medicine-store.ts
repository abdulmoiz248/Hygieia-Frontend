import { create } from "zustand"
import { devtools } from "zustand/middleware"

import {
  getActivePrescriptionsByPatient,
  mapApiPrescriptionToStorePrescription,
} from "@/api/patient/medicineApi"
import type { Medicine, MedicineTrackerState, Prescription } from "@/types/patient/medicine"

type MedicineStore = MedicineTrackerState & {
  loading: boolean
  error: string | null
  toggleMedicineTaken: (id: string) => void
  setPrescriptions: (items: Prescription[]) => void
  fetchPrescriptions: (patientId: string) => Promise<void>
}

const getTodaysMeds = (prescriptions: Prescription[]): Medicine[] => {
  const today = new Date()

  return prescriptions
    .filter((p) => p.status === "active")
    .flatMap((prescription) => {
      const prescriptionDate = new Date(prescription.date)
      const daysSinceStart = Math.floor(
        (today.getTime() - prescriptionDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      return prescription.medications.filter((med) => {
        if (Number.isNaN(prescriptionDate.getTime()) || daysSinceStart < 0) {
          return false
        }

        const durationStr = med.duration.trim().toLowerCase()
        if (durationStr === "ongoing") return true
        const durationDays = parseInt(durationStr)
        if (Number.isNaN(durationDays)) return false
        return daysSinceStart < durationDays
      })
    })
}

const initialState: MedicineTrackerState = {
  Prescription: [],
  MedicineState: {
    todaysMeds: [],
  },
}

export const usePatientMedicineStore = create<MedicineStore>()(
  devtools(
    (set) => ({
      ...initialState,
      loading: false,
      error: null,
      toggleMedicineTaken: (id) =>
        set((state) => ({
          ...state,
          MedicineState: {
            ...state.MedicineState,
            todaysMeds: state.MedicineState.todaysMeds.map((m) =>
              m.id === id ? { ...m, taken: !m.taken } : m
            ),
          },
        })),
      setPrescriptions: (items) =>
        set({
          Prescription: items,
          MedicineState: { todaysMeds: getTodaysMeds(items) },
        }),
      fetchPrescriptions: async (patientId) => {
        if (!patientId) {
          set({
            loading: false,
            error: "Patient ID is required",
            Prescription: [],
            MedicineState: { todaysMeds: [] },
          })
          return
        }

        set({ loading: true, error: null })

        try {
          const apiItems = await getActivePrescriptionsByPatient(patientId)
          const prescriptions = apiItems.map(mapApiPrescriptionToStorePrescription)
          set({
            loading: false,
            error: null,
            Prescription: prescriptions,
            MedicineState: { todaysMeds: getTodaysMeds(prescriptions) },
          })
        } catch (err: any) {
          set({
            loading: false,
            error: err?.response?.data?.message || err?.message || "Failed to fetch prescriptions",
            Prescription: [],
            MedicineState: { todaysMeds: [] },
          })
        }
      },
    }),
    { name: "patient-medicine-store" }
  )
)

