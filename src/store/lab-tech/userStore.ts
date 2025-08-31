import api from "@/lib/axios"
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
  fetchProfile: () => Promise<void>
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

const useLabTechnicianStore = create<LabTechnicianStore>((set) => {
  const fetchProfile = async () => {
    try {
      set({ loading: true })

      const id = localStorage.getItem("id")
      const role = localStorage.getItem("role")
      console.log("id=",id," role= ",role)

      if (!id || !role) throw new Error("Missing id or role in localStorage")
        

     const res=await api.get(`/auth/user?id=${id}&role=${role}`)


      if (!res.data.success) throw new Error("Failed to fetch profile")
      const data = await res.data

      set({ profile: data, loading: false })
    } catch (err) {
      console.error("Error fetching profile:", err)
      set({ profile: null, loading: false })
    }
  }

  return {
    profile: null,
    notifications: [],
    loading: false,
   setProfile: async(profileData) => {
    const role=localStorage.getItem('role')
   
        await api.post(`/auth/user?role=${role}`, {profileData})
    set({ profile: profileData })

   },


    fetchProfile,
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


export default useLabTechnicianStore
