import api from "@/lib/axios"
import { NotificationType } from "@/types/patient/notification"

export const notificationApi = {
  // Fetch all notifications for a user
  getNotifications: async (userId: string): Promise<NotificationType[]> => {
    const { data } = await api.get<{ success: boolean; data: NotificationType[]; message: string }>(`/notifications/${userId}`)
    return data.data
  },

  // Mark a specific notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    await api.patch(`/notifications/mark-read/${notificationId}`)
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (userId: string): Promise<void> => {
    await api.patch(`/notifications/mark-all-read/${userId}`)
  },
}
