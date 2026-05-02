import api from "@/lib/axios"

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
 *
 * @param appointmentId - The ID of the appointment to cancel
 * @param payload - The cancellation reason, optional notes, and doctor ID
 * @returns Promise with the cancelled appointment details
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

export interface CompleteAppointmentPayload {
  doctorId: string
  dto: {
    report?: string
    referredTestIds?: string[]
    prescription?: {
      notes: string
      startDate: string
      endDate: string
      status: "active"
      medications: {
        name: string
        dosage: string
        frequency: string
        duration: string
        instructions?: string
        time?: string
      }[]
    }
  }
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
 * Mark a doctor appointment as completed and optionally assign a prescription.
 *
 * @param appointmentId - The ID of the appointment to complete
 * @param payload - doctorId + dto (report, referredTestIds, prescription)
 */
export const completeAppointment = async (
  appointmentId: string,
  payload: CompleteAppointmentPayload
): Promise<CompleteAppointmentResponse> => {
  const response = await api.post<CompleteAppointmentResponse>(
    `/appointments/${appointmentId}/complete-doctor`,
    payload
  )
  return response.data
}
