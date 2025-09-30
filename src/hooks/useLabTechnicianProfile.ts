import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { LabTechnicianProfile } from "@/store/lab-tech/userStore"

export function useLabTechnicianProfile() {
  return useQuery<LabTechnicianProfile>({
    queryKey: ["labTechnicianProfile"],
    queryFn: async () => {
      const id = localStorage.getItem("id")
      const role = localStorage.getItem("role")

      if (!id || !role) throw new Error("Missing id or role in localStorage")

      const res = await api.get(`/auth/user?id=${id}&role=${role}`)
      if (!res.data.success) throw new Error("Failed to fetch profile")

      return res.data as LabTechnicianProfile
    },
    staleTime: 1000 * 60 * 5,
  })
}
