import api from "@/lib/axios"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

export interface DoctorNotification {
  id: string
  title: string
  notification_msg: string
  is_read: boolean
  created_at: string
  unread: boolean
}

const useDoctorNotifications = (
  doctorId: string
): UseQueryResult<DoctorNotification[]> => {
  return useQuery({
    queryKey: ["doctorNotifications", doctorId],
    queryFn: async () => {
      if (!doctorId) throw new Error("Doctor ID is required")
      const res = await api.get<{
        success: boolean
        data: DoctorNotification[]
        message: string
      }>(`/notifications/${doctorId}`)
      return res.data.data
    },
    enabled: !!doctorId,
  })
}

export default useDoctorNotifications
