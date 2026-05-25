import { useQuery } from "@tanstack/react-query"
import { useAdminStore } from "@/store/admin/useAdminStore"
import api from "@/lib/axios"

export interface ProviderReport {
  id: string
  reported_provider_id: string
  reported_provider_role: "doctor" | "nutritionist"
  reason: string
  description: string
  evidence_urls: string[]
  status: "pending" | "reviewed" | "resolved"
  admin_notes: string | null
  warning_issued: boolean
  created_at: string
  updated_at: string
}

export interface ProviderReportsResponse {
  provider: {
    id: string
    email: string
    role: "doctor" | "nutritionist"
  }
  totalReports: number
  totalWarningsIssued: number
  reports: ProviderReport[]
}

async function fetchProviderReports(
  userId: string,
  reportedProviderId: string
): Promise<ProviderReportsResponse> {

  const res= await api.post("/provider-report/list", {
    userId,
    reportedProviderId,
  })
 
if (!res || !res.data) {
  console.error("[fetchProviderReports] No response or empty data received for provider ID:", reportedProviderId)
  throw new Error("No data received from server.")  
}

console.log("[fetchProviderReports] Received response for provider ID:", reportedProviderId, res.data)

return res.data as any
}

export function useProviderReports(reportedProviderId: string | null) {
  const { adminId } = useAdminStore()

  return useQuery({
    queryKey: ["provider-reports", reportedProviderId],
    queryFn: () => fetchProviderReports(adminId!, reportedProviderId!),
    enabled: !!adminId && !!reportedProviderId,
  })
}
