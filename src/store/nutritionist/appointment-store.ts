import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface Appointment {
  id: string
  patientName: string
  patientAvatar?: string
  time: string
  duration: string
  type: string
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  location: string
  phone: string
  notes?: string
  lastVisit?: string
  patientInfo?: {
    id:string
    age: number
    weight: string
    height: string
    medicalConditions: string[]
    allergies: string[]
    currentMedications: string[]
    emergencyContact: string
    dietaryRestrictions: string[]
  }
}

interface AppointmentStore {
  appointments: Appointment[]
  selectedAppointment: Appointment | null
  filters: {
    status: string
    date: string
    search: string
  }
  isLoading: boolean

  // Actions
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
          patientName: "Emma Wilson",
          time: "10:00 AM",
          duration: "45 min",
          type: "Weight Management Consultation",
          status: "completed",
          location: "Room 101",
          phone: "+1 (555) 123-4567",
          notes: "Follow-up on 30-day meal plan progress",
          lastVisit: "2 weeks ago",
          patientInfo: {
            age: 32,
            weight: "68 kg",
            height: "165 cm",
            medicalConditions: ["Hypothyroidism"],
            allergies: ["Nuts", "Shellfish"],
            currentMedications: ["Levothyroxine 50mcg"],
            emergencyContact: "+1 (555) 123-4568",
            dietaryRestrictions: ["Vegetarian", "Low sodium"],
          },
        },
        {
          id: "2",
          patientName: "Michael Chen",
          time: "2:30 PM",
          duration: "60 min",
          type: "Diabetes Nutrition Plan",
          status: "scheduled",
          location: "Room 102",
          phone: "+1 (555) 234-5678",
          notes: "Initial consultation for diabetes management",
          patientInfo: {
            age: 45,
            weight: "82 kg",
            height: "175 cm",
            medicalConditions: ["Type 2 Diabetes", "Hypertension"],
            allergies: ["None"],
            currentMedications: ["Metformin 500mg", "Lisinopril 10mg"],
            emergencyContact: "+1 (555) 234-5679",
            dietaryRestrictions: ["Low carb", "Low sodium"],
          },
        },
        {
          id: "3",
          patientName: "Sarah Davis",
          time: "4:00 PM",
          duration: "30 min",
          type: "Follow-up Consultation",
          status: "scheduled",
          location: "Room 101",
          phone: "+1 (555) 345-6789",
          notes: "Review progress on weight loss goals",
          lastVisit: "1 week ago",
          patientInfo: {
            age: 28,
            weight: "75 kg",
            height: "170 cm",
            medicalConditions: ["PCOS"],
            allergies: ["Dairy"],
            currentMedications: ["Metformin 1000mg"],
            emergencyContact: "+1 (555) 345-6790",
            dietaryRestrictions: ["Dairy-free", "Low glycemic"],
          },
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
            apt.id === id ? { ...apt, status: "completed" as const } : apt,
          ),
        }))

        // If diet plan is provided, add it to diet plans store
        if (dietPlan) {
          // This will be handled by the diet plan store
          console.log("[v0] Diet plan assigned:", dietPlan)
        }
      },
    }),
    { name: "appointment-store" },
  ),
)
