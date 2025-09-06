// store/dashboardStore.ts
import api from "@/lib/axios"
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

interface DashboardStore {
  patientData: PatientMonth[]
  appointmentData: AppointmentDay[]
  isLoading: boolean
  fetchAnalytics: () => Promise<void>
}

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set) => ({
      patientData: [],
      appointmentData: [],
      isLoading: false,

      fetchAnalytics: async () => {
        set({ isLoading: true })

        try {
          const doctorId = localStorage.getItem("id")
          if (!doctorId) throw new Error("Doctor ID not found in localStorage")

          const [patientsRes, appointmentsRes] = await Promise.all([
            api.get(`/analytics/patients-monthly?doctorId=${doctorId}`),
            api.get(`/analytics/appointments-weekly?doctorId=${doctorId}`),
          ])

          if (!patientsRes.data || !appointmentsRes.data) throw new Error("Failed to fetch analytics")

          const patientsData: PatientMonth[] = patientsRes.data
          const appointmentsData: AppointmentDay[] = appointmentsRes.data

          set({
            patientData: patientsData,
            appointmentData: appointmentsData,
            isLoading: false,
          })
        } catch (err) {
          console.error("Error fetching analytics:", err)
          set({ isLoading: false })
        }
      },
    }),
    { name: "dashboard-store" },
  ),
)
