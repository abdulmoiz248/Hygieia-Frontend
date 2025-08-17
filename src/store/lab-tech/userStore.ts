import { create } from "zustand"

interface LabTechnicianProfile {
  id: string | null
  name: string
  email: string
  phone: string
  specialization: string
  experienceYears: number
  certifications: string[]
  shift: string
  available: boolean
  img: string
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
}

interface LabTechnicianStore {
  profile: LabTechnicianProfile
  notifications: Notification[]
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

const initialProfile: LabTechnicianProfile = {
  id: null,
  name: "Haris Imran",
  email: "fa22-bcs-084@cuilahore.edu.pk",
  phone: "",
  specialization: "",
  experienceYears: 0,
  certifications: [],
  shift: "morning",
  available: false,
  img: "/doctor.png",
}

const useLabTechnicianStore = create<LabTechnicianStore>((set) => ({
  profile: initialProfile,
  notifications: [
    {
      id: "1",
      title: "New Report Assigned",
      message: "You have been assigned a new lab report for analysis.",
      time: "2 min ago",
      unread: true,
    },
    {
      id: "2",
      title: "Shift Update",
      message: "Your evening shift has been updated to morning.",
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

export default useLabTechnicianStore
