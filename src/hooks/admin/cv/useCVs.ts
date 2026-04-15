import { useQuery } from "@tanstack/react-query"
import { useAdminStore } from "@/store/admin/useAdminStore"
import type { CV } from "@/types/admin/cv"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

export function useCVs() {
  const token = useAdminStore((s) => s.token)

  return useQuery<CV[]>({
    queryKey: ["cvs"],
    queryFn:  async () => {
      const res = await fetch(`${API}/cv`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch CVs.")
      // Status now comes from the server — no local default needed
      return res.json() as Promise<CV[]>
    },
    enabled:   !!token,
    staleTime: 30_000,
  })
}
