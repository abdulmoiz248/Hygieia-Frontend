import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { NotificationType } from "@/types/patient/notification"

type NotificationState = {
  notifications: NotificationType[]
  setNotifications: (items: NotificationType[]) => void
  addNotification: (item: NotificationType) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const initialNotifications: NotificationType[] =[]

export const usePatientNotificationsStore = create<NotificationState>()(
  devtools(
    (set) => ({
      notifications: initialNotifications,
      setNotifications: (items) => set({ notifications: items }),
      addNotification: (item) =>
        set((state) => ({
          notifications: [item, ...state.notifications],
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, unread: false } : n
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, unread: false })),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    { name: "patient-notifications-store" }
  )
)

