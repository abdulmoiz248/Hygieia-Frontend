
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
    (set) => ({
    appointments: [
  {
    id: "1",
    patient: {
      id: "p1",
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1993-06-15",
      address: "123 Maple Street, NY",
      emergencyContact: "+1 (555) 123-4568",
      bloodType: "O+",
      allergies: "Nuts, Shellfish",
      conditions: "Hypothyroidism",
      medications: "Levothyroxine 50mcg",
      avatar: "/king.png",
      gender: "female",
      weight: 68,
      height: 165,
      vaccines: "COVID-19, Tdap",
      ongoingMedications: "Levothyroxine",
      surgeryHistory: "Appendectomy (2015)",
      implants: "None",
      pregnancyStatus: "N/A",
      menstrualCycle: "Regular",
      mentalHealth: "Stable",
      familyHistory: "Diabetes",
      organDonor: "Yes",
      disabilities: "None",
      lifestyle: "Vegetarian, Low sodium",
      healthscore: 85,
      adherence: "High",
      missed_doses: 0,
      doses_taken: 30,
      limit: { daily: 2000, weekly: 14000 },
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
      email: "michael.chen@example.com",
      phone: "+1 (555) 234-5678",
      dateOfBirth: "1980-09-22",
      address: "456 Oak Avenue, CA",
      emergencyContact: "+1 (555) 234-5679",
      bloodType: "A+",
      allergies: "None",
      conditions: "Type 2 Diabetes, Hypertension",
      medications: "Metformin 500mg, Lisinopril 10mg",
      avatar: "/king2.jpg",
      gender: "male",
      weight: 82,
      height: 175,
      vaccines: "Flu Shot, COVID-19",
      ongoingMedications: "Metformin, Lisinopril",
      surgeryHistory: "None",
      implants: "None",
      pregnancyStatus: "N/A",
      menstrualCycle: "N/A",
      mentalHealth: "Mild stress",
      familyHistory: "Heart disease",
      organDonor: "No",
      disabilities: "None",
      lifestyle: "Low carb, Low sodium",
      healthscore: 78,
      adherence: "Medium",
      missed_doses: 2,
      doses_taken: 25,
      limit: { daily: 1800, weekly: 12600 },
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
      email: "sarah.davis@example.com",
      phone: "+1 (555) 345-6789",
      dateOfBirth: "1997-01-12",
      address: "789 Pine Road, TX",
      emergencyContact: "+1 (555) 345-6790",
      bloodType: "B-",
      allergies: "Dairy",
      conditions: "PCOS",
      medications: "Metformin 1000mg",
      avatar: "/doctor.png",
      gender: "female",
      weight: 75,
      height: 170,
      vaccines: "HPV, COVID-19",
      ongoingMedications: "Metformin",
      surgeryHistory: "None",
      implants: "None",
      pregnancyStatus: "N/A",
      menstrualCycle: "Irregular",
      mentalHealth: "Stable",
      familyHistory: "Obesity",
      organDonor: "Yes",
      disabilities: "None",
      lifestyle: "Dairy-free, Low glycemic",
      healthscore: 82,
      adherence: "High",
      missed_doses: 1,
      doses_taken: 28,
      limit: { daily: 1900, weekly: 13300 },
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
]
,
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
