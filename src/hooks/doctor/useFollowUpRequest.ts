import { useMutation } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "sonner"

export interface FollowUpRequestPayload {
  patientId: string
  providerId: string
  providerRole: "doctor"
  reason: string
  suggestedDate: string // "YYYY-MM-DD"
}

const requestFollowUp = async (payload: FollowUpRequestPayload) => {
  const res = await api.post("/appointments/follow-up/request", payload)
  return res.data
}

export const useFollowUpRequest = () => {
  return useMutation({
    mutationFn: requestFollowUp,
    onSuccess: () => {
      toast.success("Follow-up request sent!", {
        description: "The patient will be notified of the follow-up request.",
      })
    },
    onError: (error: any) => {
      toast.error("Failed to send follow-up request.", {
        description: error?.response?.data?.message || "Please try again.",
      })
    },
  })
}