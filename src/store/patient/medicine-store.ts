import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { Medicine, MedicineTrackerState, Prescription } from "@/types/patient/medicine"

type MedicineStore = MedicineTrackerState & {
  toggleMedicineTaken: (id: string) => void
  setPrescriptions: (items: Prescription[]) => void
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
        const durationStr = med.duration.trim().toLowerCase()
        if (durationStr === "ongoing") return true
        const durationDays = parseInt(durationStr)
        if (Number.isNaN(durationDays)) return false
        return daysSinceStart < durationDays
      })
    })
}

const initialStatePrescription: Prescription[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    date: "2025-08-01",
    status: "active",
    url: "/temp/test.pdf",
    medications: [
      {
        id: "1",
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take with food in the morning",
        time: "08:00 AM",
        taken: false,
      },
      {
        id: "2",
        name: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily",
        duration: "Ongoing",
        instructions: "Take with food to prevent stomach upset",
        time: "08:00 PM",
        taken: false,
      },
      {
        id: "4",
        name: "fieke",
        dosage: "81mg",
        frequency: "Once daily",
        duration: "Ongoing",
        instructions: "Take with food to prevent stomach upset",
        time: "08:00 PM",
        taken: false,
      },
    ],
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "Dermatologist",
    date: "2025-08-1",
    status: "active",
    url: "/temp/test.pdf",
    medications: [
      {
        id: "3",
        name: "Tretinoin Cream",
        dosage: "0.025%",
        frequency: "Once daily",
        duration: "60 days",
        instructions: "Apply thin layer to affected areas at bedtime",
        time: "10:00 PM",
        taken: false,
      },
    ],
  },
  {
    id: "3",
    doctorName: "Dr. Emily Rodriguez",
    doctorSpecialty: "General Practitioner",
    date: "2025-08-1",
    status: "completed",
    url: "/temp/test.pdf",
    medications: [
      {
        id: "4",
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        duration: "7 days",
        instructions: "Take with meals",
        time: "08:00 AM, 02:00 PM, 08:00 PM",
        taken: false,
      },
    ],
  },
]

const initialState: MedicineTrackerState = {
  Prescription: initialStatePrescription,
  MedicineState: {
    todaysMeds: getTodaysMeds(initialStatePrescription),
  },
}

export const usePatientMedicineStore = create<MedicineStore>()(
  devtools(
    (set) => ({
      ...initialState,
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
    }),
    { name: "patient-medicine-store" }
  )
)

