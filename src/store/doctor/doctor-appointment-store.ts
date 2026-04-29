import { create } from "zustand"
import { devtools } from "zustand/middleware"

// Adjust import path to your doctor appointment types
export enum AppointmentStatus {
  Upcoming = "upcoming",
  Completed = "completed",
  Cancelled = "cancelled",
  Pending = "pending",
}

export interface DoctorAppointment {
  id: string
  patientId: string
  patientName: string
  patientAvatar?: string
  date: string
  time: string
  type: string
  status: AppointmentStatus
  notes?: string
}

interface DoctorAppointmentStore {
  appointments: DoctorAppointment[]
  selectedAppointment: DoctorAppointment | null
  filters: {
    status: AppointmentStatus | "all"
    date: string
    search: string
  }
  isLoading: boolean

  setAppointments: (appointments: DoctorAppointment[]) => void
  setSelectedAppointment: (appointment: DoctorAppointment | null) => void
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void
  setFilters: (filters: Partial<DoctorAppointmentStore["filters"]>) => void
  setLoading: (loading: boolean) => void
  markAppointmentDone: (id: string) => void
}

export const useDoctorAppointmentStore = create<DoctorAppointmentStore>()(
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

      setSelectedAppointment: (appointment) =>
        set({ selectedAppointment: appointment }),

      updateAppointmentStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id ? { ...apt, status } : apt
          ),
        })),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      markAppointmentDone: (id) =>
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id
              ? { ...apt, status: AppointmentStatus.Completed }
              : apt
          ),
        })),
    }),
    { name: "doctor-appointment-store" }
  )
)
