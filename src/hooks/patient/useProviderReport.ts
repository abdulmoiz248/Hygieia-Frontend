"use client"

import { useMutation } from "@tanstack/react-query"
import api from "@/lib/axios"
import axios from "axios"
import { patientError } from "@/toasts/PatientToast"

export type ReportProviderRole = "doctor" | "nutritionist"

export type ProviderReportPayload = {
  patientId: string
  reportedProviderId: string
  reportedProviderRole: ReportProviderRole
  reason: string
  description?: string
  images?: string[] // base64 data URIs, max 3
}

export type ProviderReportResponse = {
  statusCode: 201
  message: string
  success: true
  data: {
    success: true
    message: string
    reportId: string
  }
}

async function submitProviderReport(payload: ProviderReportPayload): Promise<ProviderReportResponse> {
  try {
    console.log("[submitProviderReport] Sending payload:", {
      patientId: payload.patientId,
      reportedProviderId: payload.reportedProviderId,
      reportedProviderRole: payload.reportedProviderRole,
      reason: payload.reason,
      hasDescription: !!payload.description,
      descriptionLength: payload.description?.length ?? 0,
      imageCount: payload.images?.length ?? 0,
      imageSizes: payload.images?.map(img => `${img.length} chars`) ?? [],
    })
    const res = await api.post<ProviderReportResponse>("/provider-report", payload)
    console.log("[submitProviderReport] Success:", res.data)
    return res.data
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      const statusText = err.response?.statusText
      const data = err.response?.data
      
      console.error("[submitProviderReport] AxiosError - Status:", status, statusText)
      console.error("[submitProviderReport] AxiosError - Headers:", err.response?.headers)
      console.error("[submitProviderReport] AxiosError - Response body (raw):", err.response?.data)
      console.error("[submitProviderReport] AxiosError - Response body (stringified):", JSON.stringify(data, null, 2))
      
      // Log all possible message paths
      console.error("[submitProviderReport] Trying to extract message from:", {
        "data.message": data?.message,
        "data.error.message": data?.error?.message,
        "data.error": data?.error,
        "data": typeof data === 'string' ? data : JSON.stringify(data),
      })
      
      let backendMessage = 
        data?.message ||                         // Standard message field
        data?.error?.message ||                  // Nested error.message
        data?.error ||                           // Just error field
        (typeof data === 'string' ? data : null) || // Raw string response
        err.message ||                           // Axios message
        statusText ||                            // Status text (e.g., "Internal Server Error")
        `Request failed with status ${status}`   // Fallback
      
      console.error("[submitProviderReport] FINAL MESSAGE TO USER:", backendMessage)
      throw new Error(String(backendMessage))
    }

    console.error("[submitProviderReport] Non-Axios error:", err)
    throw err
  }
}

export function useProviderReport() {
  return useMutation({
    mutationFn: submitProviderReport,
    onError: (err: any) => {
      const message = err?.message ?? (typeof err === "string" ? err : "Failed to submit report")
      console.error("[useProviderReport] Error in mutation:", { originalError: err, displayMessage: message })
      
      try {
        // show user-friendly toast
        patientError(String(message))
      } catch (toastErr) {
        console.error("[useProviderReport] Failed to show toast:", toastErr)
      }

      try {
        console.error("[useProviderReport] Full error object:", err)
      } catch {}
    },
  })
}
