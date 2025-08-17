
import {Appointment, AppointmentMode, AppointmentStatus, AppointmentTypes} from './appointment'
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { mockDoctors } from '@/mocks/data'
interface AppointmentState {
  appointments: Appointment[]
  current: Partial<Appointment>
}

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctor: mockDoctors[0],
    date: "2025-07-26",
    time: "10:00 AM",
    status: AppointmentStatus.Cancelled,
    type: AppointmentTypes.Consultation,
  mode:AppointmentMode.Online,
  
  },
  {
    id: "2",
    doctor: mockDoctors[1],
    date: "2025-07-28",
    time: "2:30 PM",
    status: AppointmentStatus.Completed,
    type: AppointmentTypes.Emergency
    ,report:'/temp/test.pdf',
      mode:AppointmentMode.Online,
  },
   {
    id: "3",
     mode:AppointmentMode.Online,
    doctor: mockDoctors[0],
    date: "2025-08-26",
    time: "10:00 AM",
    status: AppointmentStatus.Upcoming,
    type: AppointmentTypes.FollowUp
  },
]

const extendedAppointments = mockAppointments.map((apt) => ({
  ...apt,
  
}))


const initialState: AppointmentState = {
  appointments: extendedAppointments,
  current: {},
}

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments(state, action: PayloadAction<Appointment[]>) {
      state.appointments = action.payload
    },
    addAppointment(state, action: PayloadAction<Appointment>) {
      state.appointments.push(action.payload)
    },
    updateAppointment(state, action: PayloadAction<Appointment>) {
      const index = state.appointments.findIndex((apt) => apt.id === action.payload.id)
      if (index !== -1) state.appointments[index] = action.payload
    },
    cancelAppointment(state, action: PayloadAction<string>) {
      const index = state.appointments.findIndex((apt) => apt.id === action.payload)
      if (index !== -1) state.appointments[index].status = AppointmentStatus.Cancelled
    },
    setCurrentAppointment(state, action: PayloadAction<Partial<Appointment>>) {
      state.current = action.payload
    },
    clearCurrentAppointment(state) {
      state.current = {}
    },
  },
})

export const {
  setAppointments,
  addAppointment,
  updateAppointment,
  cancelAppointment,
  setCurrentAppointment,
  clearCurrentAppointment,
} = appointmentSlice.actions

export default appointmentSlice.reducer




