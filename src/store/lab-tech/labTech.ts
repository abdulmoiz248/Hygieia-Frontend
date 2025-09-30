import { create } from "zustand"

interface LabStore {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const useLabStore = create<LabStore>((set) => ({
  activeTab: "dashboard",
  setActiveTab: (tab) => set({ activeTab: tab }),
}))