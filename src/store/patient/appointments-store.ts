import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { Appointment } from "@/types/patient/appointment"
import { AppointmentStatus, mapAppointments } from "@/types/patient/appointment"
import api from "@/lib/axios"

type AppointmentState = {
  appointments: Appointment[]
  current: Partial<Appointment>
  loading: boolean
  error: string | null
  setCurrentAppointment: (apt: Partial<Appointment>) => void
  clearCurrentAppointment: () => void
  fetchAppointments: (patientId: string) => Promise<void>
  fetchAppointmentById: (id: string) => Promise<Appointment | null>
  createAppointment: (data: Appointment) => Promise<Appointment>
  updateAppointment: (data: Appointment) => Promise<Appointment>
  cancelAppointment: (id: string) => Promise<Appointment | null>
}

export const usePatientAppointmentsStore = create<AppointmentState>()(
  devtools(
    (set) => ({
      appointments: [],
      current: {},
      loading: false,
      error: null,

      setCurrentAppointment: (apt) => set({ current: apt }),
      clearCurrentAppointment: () => set({ current: {} }),

      fetchAppointments: async (patientId: string) => {
        set({ loading: true, error: null })
        try {
          const res = await api.get(`/appointments/patient`, { params: { patientId } })
          const mapped = mapAppointments(res.data) as Appointment[]
          set({ appointments: mapped, loading: false })
        } catch (err: any) {
          set({
            loading: false,
            error: err?.message || "Failed to load appointments",
          })
        }
      },

      fetchAppointmentById: async (id: string) => {
        try {
          const res = await api.get(`/appointments/${id}`)
          const apt = res.data as Appointment
          set({ current: apt })
          return apt
        } catch {
          return null
        }
      },

      createAppointment: async (data: Appointment) => {
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

        await api.post(`/appointments`, payload)
        set((state) => ({ appointments: [...state.appointments, data] }))
        return data
      },

      updateAppointment: async (data: Appointment) => {
        await api.patch(`/appointments/${data.id}`, data)
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === data.id ? data : apt
          ),
        }))
        return data
      },

      cancelAppointment: async (id: string) => {
        try {
          const res = await api.patch(`/appointments/${id}`, { status: "cancelled" })
          const updated = res.data as Appointment

          set((state) => ({
            appointments: state.appointments.map((apt) =>
              apt.id === updated.id
                ? { ...apt, status: AppointmentStatus.Cancelled }
                : apt
            ),
          }))

          return updated
        } catch {
          return null
        }
      },
    }),
    { name: "patient-appointments-store" }
  )
)

