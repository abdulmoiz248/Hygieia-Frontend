import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { JournalEntry } from "@/types/patient/journal"

type JournalState = {
  selectedCategory: string | null
  page: number
  searchQuery: string
  viewingEntry: JournalEntry | null
  showEntryForm: boolean
  setSelectedCategory: (category: string | null) => void
  setPage: (page: number) => void
  setSearchQuery: (query: string) => void
  setViewingEntry: (entry: JournalEntry | null) => void
  setShowEntryForm: (show: boolean) => void
}

export const usePatientJournalStore = create<JournalState>()(
  devtools(
    (set) => ({
      selectedCategory: null,
      page: 1,
      searchQuery: "",
      viewingEntry: null,
      showEntryForm: false,

      setSelectedCategory: (category) =>
        set({ selectedCategory: category, page: 1 }),
      setPage: (page) => set({ page }),
      setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
      setViewingEntry: (entry) => set({ viewingEntry: entry }),
      setShowEntryForm: (show) => set({ showEntryForm: show }),
    }),
    { name: "patient-journal-store" }
  )
)
