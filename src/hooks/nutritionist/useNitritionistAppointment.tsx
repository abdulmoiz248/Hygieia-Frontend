import { useQuery } from '@tanstack/react-query'
import api from "@/lib/axios"

export const useNutritionistAppointment = (doctorId: string, status: string = 'all') => {
  return useQuery({
    queryKey: ['appointments', doctorId, status],
    queryFn: async () => {
      if (!doctorId) throw new Error('Missing doctorId')
      const url = `/appointments?doctorId=${doctorId}${status !== 'all' ? `&status=${status}` : ''}`
      const res = await api.get(url)
      return res.data.items ?? []
    },
    enabled: !!doctorId,
  })
}
