import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"

import { Appointment, AppointmentStatus, mapAppointments } from "./appointment"
import api from "@/lib/axios"

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (patientId: string) => {
    const res = await api.get(`/appointments/patient`, { params: { patientId } })
    return mapAppointments(res.data) as Appointment[]
  }
)


export const fetchAppointmentById = createAsyncThunk(
  "appointments/fetchAppointmentById",
  async (id: string) => {
    const res = await api.get(`/appointments/${id}`)
    return res.data as Appointment
  }
)

export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (data: Appointment) => {
    const payload = {
      patientId: data.patient.id,
      doctorId: data.doctor.id,
      date: data.date,
      time: data.time,
      status: data.status,
      type: data.type,
      notes: data.notes,
      mode: data.mode,
      dataShared: data.dataShared,
    }

    const res = await api.post(`/appointments`, payload)
    return data as Appointment
  }
)


export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async (data: Appointment) => {
    const res = await api.patch(`/appointments/${data.id}`, data)
    return data as Appointment
  }
)

export const cancelAppointment = createAsyncThunk(
  "appointments/cancelAppointment",
  async (id: string) => {
    const res = await api.patch(`/appointments/${id}`, { status: "cancelled" })
    return res.data as Appointment
  }
)

// === Slice ===
interface AppointmentState {
  appointments: Appointment[]
  current: Partial<Appointment>
  loading: boolean
  error: string | null
}

const initialState: AppointmentState = {
  appointments: [],
  current: {},
  loading: false,
  error: null,
}

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setCurrentAppointment(state, action: PayloadAction<Partial<Appointment>>) {
      state.current = action.payload
    },
    clearCurrentAppointment(state) {
      state.current = {}
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false
        state.appointments = action.payload
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to load appointments"
      })
      // Fetch one
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.current = action.payload
      })
      // Create
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload)
      })
      // Update
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const idx = state.appointments.findIndex((apt) => apt.id === action.payload.id)
        if (idx !== -1) state.appointments[idx] = action.payload
      })
      // Cancel
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const idx = state.appointments.findIndex((apt) => apt.id === action.payload.id)
        if (idx !== -1) state.appointments[idx].status=AppointmentStatus.Cancelled
      })
  },
})

export const { setCurrentAppointment, clearCurrentAppointment } = appointmentSlice.actions
export default appointmentSlice.reducer


