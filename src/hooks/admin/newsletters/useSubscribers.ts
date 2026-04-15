import { useQuery } from "@tanstack/react-query"
import { BASE_URL } from "@/lib/admin/constants"
import { useAdminStore } from "@/store/admin/useAdminStore"
import type { Subscriber } from "@/types/admin/newsletter.types"


async function fetchSubscribers(adminId: string): Promise<Subscriber[]> {
  const res = await fetch(`${BASE_URL}/subscribers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-admin-id": adminId,
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "Failed to fetch subscribers")
  return json
}

export function useSubscribers() {
  const adminId = useAdminStore((s) => s.adminId)

  return useQuery({
    queryKey: ["subscribers", adminId],
    queryFn: () => fetchSubscribers(adminId!),
    enabled: !!adminId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
