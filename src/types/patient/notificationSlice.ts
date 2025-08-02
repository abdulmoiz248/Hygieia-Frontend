import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { NotificationType } from "./notification"

export interface NotificationState {
  notifications: NotificationType[]
}

const initialState: NotificationState = {
  notifications: [
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
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationType[]>) => {
      state.notifications = action.payload
    },
    addNotification: (state, action: PayloadAction<NotificationType>) => {
      state.notifications.unshift(action.payload)
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) notification.unread = false
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.unread = false)
    },
    clearNotifications: (state) => {
      state.notifications = []
    }
  }
})

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications
} = notificationsSlice.actions

export default notificationsSlice.reducer
