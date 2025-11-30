import api from "@/lib/axios"

export interface CancelAppointmentPayload {
  reason: string
  notes?: string
  nutritionistId: string
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
 * Cancel an appointment by the nutritionist
 * 
 * @param appointmentId - The ID of the appointment to cancel
 * @param payload - The cancellation reason, optional notes, and nutritionist ID
 * @returns Promise with the cancelled appointment details
 */
export const cancelAppointment = async (
  appointmentId: string,
  payload: Omit<CancelAppointmentPayload, 'nutritionistId'> & { nutritionistId?: string }
): Promise<CancelAppointmentResponse> => {
  const nutritionistId = payload.nutritionistId || localStorage.getItem('id')
  
  if (!nutritionistId) {
    throw new Error('Nutritionist ID is required. Please log in again.')
  }

  const response = await api.patch<CancelAppointmentResponse>(
    `/appointments/${appointmentId}/cancel`,
    {
      reason: payload.reason,
      notes: payload.notes,
      cancelledBy: "doctor",
      nutritionistId,
    }
  )
  return response.data
}
