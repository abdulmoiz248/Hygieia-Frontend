import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Appointment, AppointmentStatus } from "./appointment"


const extendedAppointments: Appointment[] = [
  {
    id: "1",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    type: "Checkup",
    status: "upcoming",
    doctor: {
      name: "Dr. Ayesha Karim",
      specialty: "Cardiologist",
      avatar: "",
       id: '1',
     rating: 5,
  location: 'lahore',
  experience: 4,
  consultationFee: 400
    },
  },
  {
    id: "2",
    date: new Date().toISOString().split("T")[0],
    time: "2:30 PM",
    type: "Consultation",
    status: "completed",
    doctor: {
      name: "Dr. Imran Qureshi",
      specialty: "General Physician",
      avatar: "",
          id: '2',
     rating: 5,
  location: 'lahore',
  experience: 4,
  consultationFee: 400
    },
    meetingRemarks: {
      diagnosis: "Patient shows good progress with current treatment plan.",
      symptoms: "Blood pressure has stabilized, no side effects reported.",
      recommendations: "Continue current medication, schedule follow-up in 3 months.",
      nextSteps: "Monitor blood pressure daily, maintain low-sodium diet.",
      prescriptions: "Renewed Lisinopril 10mg daily for 90 days.",
      doctorNotes: "Patient is responding well to treatment. Encourage continued lifestyle modifications.",
    },
  },
  {
    id: "3",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "11:15 AM",
    type: "Follow-up",
    status: "cancelled",
    doctor: {
      name: "Dr. Sarah Zaman",
      specialty: "Dermatologist",
      avatar: "",
          id: '3',
     rating: 5,
  location: 'lahore',
  experience: 4,
  consultationFee: 400
    },
  },
]


interface AppointmentsState {
  appointments: Appointment[]
  selectedStatus: AppointmentStatus | "all"
  selectedDate: Date | null
  selectedAppointment: Appointment | null
}

const initialState: AppointmentsState = {
  appointments: extendedAppointments,
  selectedStatus: "all",
  selectedDate: new Date(),
  selectedAppointment: null,
}

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<AppointmentStatus | "all">) {
      state.selectedStatus = action.payload
    },
    setSelectedDate(state, action: PayloadAction<Date | null>) {
      state.selectedDate = action.payload
    },
    setSelectedAppointment(state, action: PayloadAction<Appointment | null>) {
      state.selectedAppointment = action.payload
    },
  },
})

export const { setStatusFilter, setSelectedDate, setSelectedAppointment } = appointmentsSlice.actions
export default appointmentsSlice.reducer
