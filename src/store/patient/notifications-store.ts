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

const initialNotifications: NotificationType[] = [
  {
    id: "1",
    title: "Appointment Reminder",
    message: "Your appointment with Dr. Sarah Johnson is in 2 hours",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    title: "Medication Reminder",
    message: "Time to take your Lisinopril (10mg)",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "3",
    title: "Lab Results Ready",
    message: "Your blood test results are now available",
    time: "3 hours ago",
    unread: false,
  },
]

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

