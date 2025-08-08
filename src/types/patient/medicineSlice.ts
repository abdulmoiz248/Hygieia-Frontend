import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Medicine,MedicineState,Prescription ,MedicineTrackerState} from "./medicine"

const initialStatePrescription: Prescription[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    date: "2025-08-01",
    status: "active",
    url:"/temp/test.pdf",
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
    url:"/temp/test.pdf",
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
    url:"/temp/test.pdf",
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

const initialStateMedicineState: MedicineState = {
  todaysMeds: getTodaysMeds(initialStatePrescription),
}


function getTodaysMeds(prescriptions: Prescription[]): Medicine[] {
  const today = new Date()

  return prescriptions
    .filter(p => p.status === "active")
    .flatMap(prescription => {
      const prescriptionDate = new Date(prescription.date)
      const daysSinceStart = Math.floor((today.getTime() - prescriptionDate.getTime()) / (1000 * 60 * 60 * 24))

      return prescription.medications.filter(med => {
        const durationStr = med.duration.trim().toLowerCase()
        if (durationStr === "ongoing") return true
        const durationDays = parseInt(durationStr)
        if (isNaN(durationDays)) return false
        return daysSinceStart < durationDays
      })
    })
}


const initialState:MedicineTrackerState={
  Prescription:initialStatePrescription,
  MedicineState:initialStateMedicineState
}


const medicineSlice = createSlice({
  name: "medicineTracker",
  initialState,
  reducers: {
    toggleMedicineTaken(state, action: PayloadAction<string>) {
      const med = state.MedicineState.todaysMeds.find(m => m.id === action.payload)
      if (med) {
        med.taken = !med.taken
      }
    },
  },
})

export const { toggleMedicineTaken } = medicineSlice.actions
export default medicineSlice.reducer





