import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { Appointment, AppointmentStatus } from "@/types/patient/appointment"
import api from "@/lib/axios"

interface AppointmentStore {
  appointments: Appointment[]
  selectedAppointment: Appointment | null
  filters: {
    status: AppointmentStatus | "all"
    date: string
    search: string
  }
  isLoading: boolean

  fetchAppointments: (status?: AppointmentStatus | "all") => Promise<void>
  setSelectedAppointment: (appointment: Appointment | null) => void
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void
  setFilters: (filters: Partial<AppointmentStore["filters"]>) => void
  setLoading: (loading: boolean) => void
  markAppointmentDone: (id: string, dietPlan?: any) => void
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

     fetchAppointments: async (status = "all") => {
  const doctorId = localStorage.getItem("id")
  if (!doctorId) return
  set({ isLoading: true })
  try {
    const url = `/appointments?doctorId=${doctorId}${
      status !== "all" ? `&status=${status}` : ""
    }`
    console.log(url)
    const res = await api.get(url)
    console.log(res.data.items)

    const data: Appointment[] = res.data.items ?? []
    set({ appointments: data })
    
  } catch (err) {
    console.error("Failed to fetch appointments:", err)
  } finally {
    set({ isLoading: false })
  }
},


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
