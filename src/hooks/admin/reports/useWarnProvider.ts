import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAdminStore } from "@/store/admin/useAdminStore"

interface WarnProviderPayload {
  reportedProviderId: string
  reportId: string
  adminNotes: string
}

interface WarnProviderResponse {
  success: boolean
  message: string
  totalWarnings: number
  reportId: string
  reportedProviderId: string
}

async function warnProvider(
  userId: string,
  payload: WarnProviderPayload
): Promise<WarnProviderResponse> {
  const res = await fetch("/provider-report/warn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...payload }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message?.[0] ?? "Failed to issue warning.")
  }

  const json = await res.json()
  return json.data
}

export function useWarnWorker() {
  const { adminId } = useAdminStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: WarnProviderPayload) => warnProvider(adminId!, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["provider-reports", variables.reportedProviderId],
      })
    },
  })
}
