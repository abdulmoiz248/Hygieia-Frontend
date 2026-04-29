import api from "@/lib/axios"
import { create } from "zustand"

export interface DoctorProfile {
  id: string
  name: string
  email: string
  phone: string
  gender: string
  dateofbirth: string
  img: string
  specialization: string
  experienceYears: number
  certifications: string[]
  education: string[]
  languages: string[]
  bio: string
  consultationFee: number
  workingHours: { day: string; start: string; end: string; location: string }[]
  rating: number
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
}

export interface DoctorStore {
  profile: DoctorProfile | null
  notifications: Notification[]
  loading: boolean
  setProfile: (profileData: DoctorProfile) => void
  setProfileData: (profileData: DoctorProfile) => void
  updateProfileField: <K extends keyof DoctorProfile>(
    field: K,
    value: DoctorProfile[K]
  ) => void
  resetProfile: () => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const useDoctorStore = create<DoctorStore>((set) => ({
  profile: null,
  notifications: [],
  loading: true,

  setProfile: async (profileData) => {
    await api.post(`/auth/user?role=doctor`, { profileData })
    set({ profile: profileData })
  },

  setProfileData: (profileData: DoctorProfile) => {
    set({ profile: profileData })
  },

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

export default useDoctorStore
