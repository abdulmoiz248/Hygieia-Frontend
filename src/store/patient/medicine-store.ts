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
  toggleMedicineTaken: (id: string, patientId: string) => Promise<void>
  setPrescriptions: (items: Prescription[]) => void
  fetchPrescriptions: (patientId: string) => Promise<void>
}

type LocalTakenState = Record<string, boolean>

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

const extractMedicationId = (medicineId: string): string => {
  const parts = medicineId.split(":")
  if (parts.length < 2) {
    return medicineId
  }
  return parts.slice(1).join(":")
}

const getTodayKey = () => new Date().toISOString().slice(0, 10)

const getLocalTakenKey = (patientId: string) =>
  `patient-medicine-taken:${patientId}:${getTodayKey()}`

const getLocalTakenState = (patientId: string): LocalTakenState => {
  if (typeof window === "undefined" || !patientId) {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(getLocalTakenKey(patientId))
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw) as LocalTakenState
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

const saveLocalTakenState = (patientId: string, state: LocalTakenState) => {
  if (typeof window === "undefined" || !patientId) {
    return
  }

  window.localStorage.setItem(getLocalTakenKey(patientId), JSON.stringify(state))
}

const mergeTakenFromLocal = (
  prescriptions: Prescription[],
  localTakenState: LocalTakenState
): Prescription[] =>
  prescriptions.map((prescription) => ({
    ...prescription,
    medications: prescription.medications.map((medication) => {
      if (Object.prototype.hasOwnProperty.call(localTakenState, medication.id)) {
        return { ...medication, taken: localTakenState[medication.id] }
      }
      return medication
    }),
  }))

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

        if (!medicine || !prescription || !patientId) {
          return
        }

        const nextTaken = !medicine.taken

        set((currentState) => ({
          error: null,
          syncingMedicineIds: [...currentState.syncingMedicineIds, id],
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

        const localTakenState = getLocalTakenState(patientId)
        saveLocalTakenState(patientId, {
          ...localTakenState,
          [id]: nextTaken,
        })

        try {
          await markMedicationTaken({
            patientId,
            prescriptionId: prescription.id,
            medicationId: extractMedicationId(id),
            taken: nextTaken,
            takenAt: new Date().toISOString(),
            scheduledTime: medicine.time,
            source: "patient-web",
          })
        } catch (err: any) {
          set({
            error:
              err?.message ||
              "Medicine status saved locally. Sync will complete when backend endpoint is available.",
          })
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
          const localTakenState = getLocalTakenState(patientId)
          const prescriptions = mergeTakenFromLocal(
            mappedPrescriptions,
            localTakenState
          )
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

