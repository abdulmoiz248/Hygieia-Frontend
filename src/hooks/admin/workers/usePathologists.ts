import { useQuery } from "@tanstack/react-query"
import { fetchPathologists } from "@/api/admin/workers.api"

export const pathologistsQueryKey = ["workers", "pathologist"] as const

export function usePathologists() {
  return useQuery({
    queryKey: pathologistsQueryKey,
    queryFn: fetchPathologists,
    staleTime: 5 * 60 * 1000,
  })
}
