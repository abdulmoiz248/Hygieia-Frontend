
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { Appointment, AppointmentStatus, AppointmentTypes, AppointmentMode } from "@/types/patient/appointment"

interface AppointmentStore {
  appointments: Appointment[]
  selectedAppointment: Appointment | null
  filters: {
    status: AppointmentStatus | "all"
    date: string
    search: string
  }
  isLoading: boolean

  setAppointments: (appointments: Appointment[]) => void
  setSelectedAppointment: (appointment: Appointment | null) => void
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void
  setFilters: (filters: Partial<AppointmentStore["filters"]>) => void
  setLoading: (loading: boolean) => void
  markAppointmentDone: (id: string, dietPlan?: any) => void
}

export const useAppointmentStore = create<AppointmentStore>()(
  devtools(
    (set, get) => ({
      appointments: [
        {
          id: "1",
          patient: {
            id: "p1",
            name: "Emma Wilson",
            age: 32,
            gender: "female",
          },
          doctor: {
            id: "d1",
            name: "Dr. James Carter",
            specialization: "Nutritionist",
          },
          date: "2025-08-20",
          time: "10:00 AM",
          status: AppointmentStatus.Completed,
          type: AppointmentTypes.Consultation,
          notes: "Follow-up on 30-day meal plan progress",
          report: "Patient responded well, continue current diet.",
          mode: AppointmentMode.Physical,
        },
        {
          id: "2",
          patient: {
            id: "p2",
            name: "Michael Chen",
            age: 45,
            gender: "male",
          },
          doctor: {
            id: "d2",
            name: "Dr. Laura Smith",
            specialization: "Endocrinologist",
          },
          date: "2025-08-21",
          time: "2:30 PM",
          status: AppointmentStatus.Upcoming,
          type: AppointmentTypes.Consultation,
          notes: "Initial consultation for diabetes management",
          mode: AppointmentMode.Physical,
        },
        {
          id: "3",
          patient: {
            id: "p3",
            name: "Sarah Davis",
            age: 28,
            gender: "female",
          },
          doctor: {
            id: "d1",
            name: "Dr. James Carter",
            specialization: "Nutritionist",
          },
          date: "2025-08-22",
          time: "4:00 PM",
          status: AppointmentStatus.Upcoming,
          type: AppointmentTypes.FollowUp,
          notes: "Review progress on weight loss goals",
          mode: AppointmentMode.Online,
        },
      ],
      selectedAppointment: null,
      filters: {
        status: "all",
        date: "today",
        search: "",
      },
      isLoading: false,

      setAppointments: (appointments) => set({ appointments }),

      setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),

      updateAppointmentStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt)),
        })),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      markAppointmentDone: (id, dietPlan) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id ? { ...apt, status: AppointmentStatus.Completed as const } : apt,
          ),
        }))

        if (dietPlan) {
          console.log("[v0] Diet plan assigned:", dietPlan)
        }
      },
    }),
    { name: "appointment-store" },
  ),
)
