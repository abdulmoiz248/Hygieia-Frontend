import { useQuery } from "@tanstack/react-query"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminError } from "@/toasts/AdminToasts"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

export interface RoleCount {
  role: string
  count: number
}

export interface MonthlyTrend {
  month: string  // e.g. "2026-03"
  label: string  // e.g. "Mar 2026"
  count: number
}

export interface RoleTrend {
  role: string
  total: number
  monthlyTrends: MonthlyTrend[]
}

export interface UserRoleCountsData {
  totalUsers: number
  roleCounts: RoleCount[]
  roleTrends: RoleTrend[]
}

async function fetchUserRoleCounts(
  adminId: string,
  token: string
): Promise<UserRoleCountsData> {
  const res = await fetch(
    `${API}/auth/user-role-counts?userId=${adminId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch user role counts")
  }

  return json.data as UserRoleCountsData
}

export function useUserRoleCounts() {
  const token   = useAdminStore((s) => s.token)
  const adminId = useAdminStore((s) => s.adminId)

  return useQuery<UserRoleCountsData>({
    queryKey: ["admin", "user-role-counts", adminId],
    queryFn:  () => fetchUserRoleCounts(adminId!, token!),
    enabled:  !!token && !!adminId,
    staleTime: 1000 * 60 * 5,
    throwOnError: false,
    meta: {
      onError: (err: Error) =>
        adminError(err.message || "Failed to load user stats."),
    },
  })
}

/** Convenience: get count for a specific role */
export function useRoleCount(role: string): number {
  const { data } = useUserRoleCounts()
  return (
    data?.roleCounts.find((r) => r.role === role)?.count ?? 0
  )
}
