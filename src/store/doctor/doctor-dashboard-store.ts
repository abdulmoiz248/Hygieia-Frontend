import { create } from "zustand"
import { devtools } from "zustand/middleware"

type PatientMonth = {
  month: string
  newPatients: number
  totalPatients: number
}

type AppointmentDay = {
  day: string
  scheduled: number
  completed: number
  cancelled: number
}

interface DoctorDashboardStore {
  patientData: PatientMonth[]
  appointmentData: AppointmentDay[]
  isLoading: boolean
  setDashboardData: (
    patientData: PatientMonth[],
    appointmentData: AppointmentDay[]
  ) => void
}

export const useDoctorDashboardStore = create<DoctorDashboardStore>()(
  devtools(
    (set) => ({
      patientData: [],
      appointmentData: [],
      isLoading: false,
      setDashboardData: (patientData, appointmentData) =>
        set({ patientData, appointmentData }),
    }),
    { name: "doctor-dashboard-store" }
  )
)
