import api from '@/lib/axios'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

export interface Notification {
  id: string
  title: string
  notification_msg: string
  is_read: boolean
  created_at: string
  unread: boolean
}

const useNutritionistNotifications = (
  nutritionistId: string
): UseQueryResult<Notification[]> => {
  return useQuery({
    queryKey: ['nutritionistNotifications', nutritionistId],
    queryFn: async () => {
      if (!nutritionistId) throw new Error('Nutritionist ID is required')
      const res = await api.get(`/notifications/nutritionist/${nutritionistId}`)
      return res.data as Notification[]
    },
    enabled: !!nutritionistId,
  })
}

export default useNutritionistNotifications
