import { create } from "zustand"
import { devtools } from "zustand/middleware"

import {
  getActivePrescriptionsByPatient,
  markMedicationTaken,
  mapApiPrescriptionToStorePrescription,
} from "@/api/patient/medicineApi"
import type { Medicine, MedicineTrackerState, Prescription } from "@/types/patient/medicine"

type MedicineStore = MedicineTrackerState & {
  loading: boolean
  error: string | null
  syncingMedicineIds: string[]
  toggleMedicineTaken: (id: string, patientId: string) => Promise<boolean>
  setPrescriptions: (items: Prescription[]) => void
  fetchPrescriptions: (patientId: string) => Promise<void>
}

const updateMedicineTakenInPrescriptions = (
  prescriptions: Prescription[],
  medicineId: string,
  taken: boolean
): Prescription[] =>
  prescriptions.map((prescription) => ({
    ...prescription,
    medications: prescription.medications.map((medication) =>
      medication.id === medicineId ? { ...medication, taken } : medication
    ),
  }))

const isLikelyUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  )

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
    (set, get) => ({
      ...initialState,
      loading: false,
      error: null,
      syncingMedicineIds: [],
      toggleMedicineTaken: async (id, patientId) => {
        const state = get()
        const medicine = state.MedicineState.todaysMeds.find((item) => item.id === id)
        const prescription = state.Prescription.find((item) =>
          item.medications.some((medication) => medication.id === id)
        )

        if (
          !medicine ||
          !prescription ||
          !patientId ||
          medicine.taken ||
          state.syncingMedicineIds.includes(id)
        ) {
          return false
        }

        const medicationId = medicine.backendMedicationId || medicine.name

        if (!isLikelyUuid(patientId) || !isLikelyUuid(prescription.id)) {
          set({
            error:
              "Cannot mark medicine as taken because patient or prescription ID is invalid.",
          })
          return false
        }

        if (!medicationId) {
          set({
            error:
              "Cannot mark this medicine as taken because medication ID is missing in prescription data.",
          })
          return false
        }

        const nextTaken = true

        set((currentState) => ({
          error: null,
          syncingMedicineIds: currentState.syncingMedicineIds.includes(id)
            ? currentState.syncingMedicineIds
            : [...currentState.syncingMedicineIds, id],
          Prescription: updateMedicineTakenInPrescriptions(
            currentState.Prescription,
            id,
            nextTaken
          ),
          MedicineState: {
            ...currentState.MedicineState,
            todaysMeds: currentState.MedicineState.todaysMeds.map((medication) =>
              medication.id === id
                ? { ...medication, taken: nextTaken }
                : medication
            ),
          },
        }))

        try {
          await markMedicationTaken({
            patientId,
            prescriptionId: prescription.id,
            medicationId,
            taken: nextTaken,
            takenAt: new Date().toISOString(),
            scheduledTime: medicine.time,
            source: "patient-web",
          })
          return true
        } catch (err: any) {
          set((currentState) => ({
            error: err?.message || "Failed to sync medicine status",
            Prescription: updateMedicineTakenInPrescriptions(
              currentState.Prescription,
              id,
              false
            ),
            MedicineState: {
              ...currentState.MedicineState,
              todaysMeds: currentState.MedicineState.todaysMeds.map((medication) =>
                medication.id === id ? { ...medication, taken: false } : medication
              ),
            },
          }))
          return false
        } finally {
          set((currentState) => ({
            syncingMedicineIds: currentState.syncingMedicineIds.filter(
              (medicineId) => medicineId !== id
            ),
          }))
        }
      },
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
          const mappedPrescriptions = apiItems.map(mapApiPrescriptionToStorePrescription)
          set({
            loading: false,
            error: null,
            Prescription: mappedPrescriptions,
            MedicineState: { todaysMeds: getTodaysMeds(mappedPrescriptions) },
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

