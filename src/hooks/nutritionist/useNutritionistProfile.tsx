import { useQuery } from '@tanstack/react-query'
import api from "@/lib/axios"

export const useNutritionistProfile = (id: string, role: string) => {
  return useQuery({
    queryKey: ['profile', id, role],
    queryFn: async () => {
      if (!id || !role) throw new Error('Missing id or role')
      const res = await api.get(`/auth/user?id=${id}&role=${role}`)
      if (!res.data.success) throw new Error('Failed to fetch profile')
      return res.data
    },
    enabled: !!id && !!role,
  })
}
