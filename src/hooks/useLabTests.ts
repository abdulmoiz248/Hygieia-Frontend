import api from '@/lib/axios'
import { LabTest } from '@/types/patient/lab'
import { useQuery } from '@tanstack/react-query'

export function useLabTests() {
  return useQuery<LabTest[]>({
    queryKey: ['labTests'],
    queryFn: async () => {
      const { data } = await api.get<LabTest[]>('/lab-tests')
      return data
    },
     staleTime: 1000 * 60 * 5, // cache for 5 min
  })
}
