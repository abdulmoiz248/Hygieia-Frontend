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

const useLabTechNotifications = (
  labTechId: string
): UseQueryResult<Notification[]> => {
  return useQuery({
    queryKey: ['labTechNotifications', labTechId],
    queryFn: async () => {
      if (!labTechId) throw new Error('Lab Tech ID is required')
      const res = await api.get(`/notifications/${labTechId}`)
      return res.data as Notification[]
    },
    enabled: !!labTechId,
  })
}

export default useLabTechNotifications