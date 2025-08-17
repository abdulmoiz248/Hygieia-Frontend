import { create } from "zustand"

export interface NutritionistProfile {
  id: string | null
  name: string
  email: string
  phone: string
  specialization: string
  experienceYears: number
  certifications: string[]
  clinic: string
  available: boolean
  img: string
  gender: string
  dateOfBirth: string
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
}

export interface NutritionistStore {
  profile: NutritionistProfile
  notifications: Notification[]
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
}

const initialProfile: NutritionistProfile = {
  id: null,
  name: "Wahb Usman",
  email: "fa22-bcs-072cuilahore.edu.pk",
  phone: "oooooooo",
  specialization: "Diet & Wellness",
  experienceYears: 0,
  certifications: [],
  clinic: "City Health Center",
  available: true,
  img: "/wahb.png",
  gender: "female",
  dateOfBirth: "2004-05-11",
}

const useNutritionistStore = create<NutritionistStore>((set) => ({
  profile: initialProfile,
  notifications: [
    {
      id: "1",
      title: "New Appointment",
      message: "You have a new consultation scheduled with a client.",
      time: "5 min ago",
      unread: true,
    },
    {
      id: "2",
      title: "Diet Plan Update",
      message: "A client has requested changes to their diet plan.",
      time: "1 hour ago",
      unread: true,
    },
  ],

  setProfile: (profileData) => set({ profile: profileData }),

  updateProfileField: (field, value) =>
    set((state) => ({
      profile: { ...state.profile, [field]: value },
    })),

  resetProfile: () => set({ profile: initialProfile }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        { ...notification, unread: true },
        ...state.notifications,
      ],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        unread: false,
      })),
    })),

  clearNotifications: () => set({ notifications: [] }),
}))

export default useNutritionistStore
