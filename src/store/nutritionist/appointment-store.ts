import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { Appointment, AppointmentStatus } from "@/types/patient/appointment"


interface AppointmentStore {
  appointments: Appointment[]
  selectedAppointment: Appointment | null
  filters: {
    status: AppointmentStatus | "all"
    date: string
    search: string
  }
  isLoading: boolean


  setSelectedAppointment: (appointment: Appointment | null) => void
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void
  setFilters: (filters: Partial<AppointmentStore["filters"]>) => void
  setLoading: (loading: boolean) => void
  markAppointmentDone: (id: string, dietPlan?: any) => void
  setAppointments: (appointments: Appointment[]) => void
}

export const useAppointmentStore = create<AppointmentStore>()(
  devtools(
    (set) => ({
      appointments: [],
      selectedAppointment: null,
      filters: {
        status: "all",
        date: "today",
        search: "",
      },
      isLoading: true,

      setAppointments: (appointments) => set({ appointments }),

      setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),

      updateAppointmentStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id ? { ...apt, status } : apt,
          ),
        })),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      markAppointmentDone: (id) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id ? { ...apt, status: AppointmentStatus.Completed as const } : apt,
          ),
        }))

       
      },
    }),
    { name: "appointment-store" },
  ),
)
