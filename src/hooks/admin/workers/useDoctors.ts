import { useQuery } from "@tanstack/react-query"
import { fetchDoctors } from "@/api/admin/workers.api"

export const doctorsQueryKey = ["workers", "doctor"] as const

export function useDoctors() {
  return useQuery({
    queryKey: doctorsQueryKey,
    queryFn: fetchDoctors,
    staleTime: 5 * 60 * 1000,
  })
}
