import { create } from "zustand"
import Cookies from "js-cookie"

interface AdminState {
  adminId: string | null
  token: string | null
  role: string | null
  isAuthenticated: boolean
  initAuth: () => void
  clearAuth: () => void
}

export const useAdminStore = create<AdminState>((set) => ({
  adminId: null,
  token: null,
  role: null,
  isAuthenticated: false,

  initAuth: () => {
    const token = Cookies.get("token")
    const id    = Cookies.get("id")
    const role  = Cookies.get("role")

    if (token && id && role === "admin") {
      set({ token, adminId: id, role, isAuthenticated: true })
    }
  },

  clearAuth: () => {
    Cookies.remove("token")
    Cookies.remove("id")
    Cookies.remove("role")
    set({ token: null, adminId: null, role: null, isAuthenticated: false })
  },
}))