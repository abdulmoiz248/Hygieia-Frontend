import api from "@/lib/axios"
import { create } from "zustand"

export interface NutritionistProfile {
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

export interface NutritionistStore {
  profile: NutritionistProfile | null
  notifications: Notification[]
  loading: boolean
  setProfile: (profileData: NutritionistProfile) => void
 
  updateProfileField: <K extends keyof NutritionistProfile>(
    field: K,
    value: NutritionistProfile[K]
  ) => void
  resetProfile: () => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  setProfileData: (profileData: NutritionistProfile) => void
}

const useNutritionistStore = create<NutritionistStore>((set) => {
  
  return {
    profile: null,
   
    notifications: [],
    loading: true,
    setProfile: async (profileData) => {
      const role = 'nutritionist'
      await api.post(`/auth/user?role=${role}`, { profileData })
      set({ profile: profileData })
    },
   
    setProfileData: (profileData: NutritionistProfile) => {
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
  }
})

export default useNutritionistStore
