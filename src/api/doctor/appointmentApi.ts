import api from "@/lib/axios"

// ─────────────────────────────────────────────
// Cancel Appointment
// ─────────────────────────────────────────────

export interface CancelAppointmentPayload {
  reason: string
  notes?: string
  doctorId: string
}

export interface CancelAppointmentResponse {
  success: boolean
  message: string
  appointment: {
    id: string
    status: string
    cancellationReason: string
    cancellationNotes?: string
    cancelledAt: string
    cancelledBy: "doctor" | "patient"
  }
}

/**
 * Cancel an appointment by the doctor
 * PATCH /appointments/{id}/cancel
 */
export const cancelAppointment = async (
  appointmentId: string,
  payload: Omit<CancelAppointmentPayload, "doctorId"> & { doctorId?: string }
): Promise<CancelAppointmentResponse> => {
  const doctorId = payload.doctorId || localStorage.getItem("id")

  if (!doctorId) {
    throw new Error("Doctor ID is required. Please log in again.")
  }

  const response = await api.patch<CancelAppointmentResponse>(
    `/appointments/${appointmentId}/cancel`,
    {
      reason: payload.reason,
      notes: payload.notes,
      cancelledBy: "doctor",
      doctorId, 
    }
  )
  return response.data
}

// ─────────────────────────────────────────────
// Complete Appointment (Doctor)
// ─────────────────────────────────────────────

export interface MedicationPayload {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  time?: string
}

export interface PrescriptionPayload {
  notes?: string
  startDate: string        // e.g. "2026-04-30"
  endDate: string          // e.g. "2026-05-30"
  status: "active"
  medications: MedicationPayload[]
}

export interface CompleteAppointmentPayload {
  report?: string
  referredTestIds?: string[]
  prescription?: PrescriptionPayload
}

export interface CompleteAppointmentResponse {
  success: boolean
  message: string
  appointment: {
    id: string
    status: string
  }
}

/**
 * Mark a doctor appointment as complete, with optional prescription
 * POST /appointments/{id}/complete-doctor
 */
export const completeAppointment = async (
  appointmentId: string,
  dto: CompleteAppointmentPayload
): Promise<CompleteAppointmentResponse> => {
  const doctorId = localStorage.getItem("id")

  if (!doctorId) {
    throw new Error("Doctor ID is required. Please log in again.")
  }

  const response = await api.post<CompleteAppointmentResponse>(
    `/appointments/${appointmentId}/complete-doctor`,
    {
      doctorId,
      dto,
    }
  )
  return response.data
}
