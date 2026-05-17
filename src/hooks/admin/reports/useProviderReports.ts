import { useQuery } from "@tanstack/react-query"
import { useAdminStore } from "@/store/admin/useAdminStore"

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
  const res = await fetch("/provider-report/list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, reportedProviderId }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message?.[0] ?? "Failed to fetch provider reports.")
  }

  const json = await res.json()
  return json.data
}

export function useProviderReports(reportedProviderId: string | null) {
  const { adminId } = useAdminStore()

  return useQuery({
    queryKey: ["provider-reports", reportedProviderId],
    queryFn: () => fetchProviderReports(adminId!, reportedProviderId!),
    enabled: !!adminId && !!reportedProviderId,
  })
}
