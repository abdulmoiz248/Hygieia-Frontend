import { useQuery } from "@tanstack/react-query"
import { useAdminStore } from "@/store/admin/useAdminStore"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

export interface AdminProfile {
  id: string
  email: string
  role: string
  name: string
  success: boolean
}

async function fetchAdminProfile(
  adminId: string,
  token: string
): Promise<AdminProfile> {
  const res = await fetch(
    `${API}/auth/user?id=${adminId}&role=admin`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch admin profile")
  }

  return json.data as AdminProfile
}

export function useAdminProfile() {
  const token   = useAdminStore((s) => s.token)
  const adminId = useAdminStore((s) => s.adminId)

  return useQuery<AdminProfile>({
    queryKey: ["admin", "profile", adminId],
    queryFn:  () => fetchAdminProfile(adminId!, token!),
    enabled:  !!token && !!adminId,
    staleTime: 1000 * 60 * 10, // 10 min — profile rarely changes
    retry: 1,
    // Silently fall back — the rest of the UI still works without a name
    throwOnError: false,
  })
}
