import { create } from "zustand"

export interface LabTechnicianProfile {
  id: string 
  name: string
  email: string
  phone: string
  img: string
  gender: string
  dateofbirth: Date
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
}

export interface LabTechnicianStore {
  profile: LabTechnicianProfile | null
  notifications: Notification[]
  loading: boolean
  setProfile: (profileData: LabTechnicianProfile) => void
  updateProfileField: <K extends keyof LabTechnicianProfile>(
    field: K,
    value: LabTechnicianProfile[K]
  ) => void
  resetProfile: () => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const useLabTechnicianStore = create<LabTechnicianStore>((set) => ({
  profile: null,
  notifications: [],
  loading: false,

  setProfile: (profileData) => set({ profile: profileData }),

  updateProfileField: (field, value) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, [field]: value } : null,
    })),

  resetProfile: () => set({ profile: null }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [{ ...notification, unread: true }, ...state.notifications],
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
}))

export default useLabTechnicianStore
