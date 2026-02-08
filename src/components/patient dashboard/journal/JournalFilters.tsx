"use client"

import { cn } from "@/lib/utils"
import { usePatientJournalStore } from "@/store/patient/journal-store"

const CATEGORIES = [
  null,
  "medication",
  "symptom",
  "food",
  "mood",
  "exercise",
] as const

export function JournalFilters() {
  const selectedCategory = usePatientJournalStore((s) => s.selectedCategory)
  const setSelectedCategory = usePatientJournalStore((s) => s.setSelectedCategory)

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-soft-blue">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat
          const label = cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : "All"
          return (
            <button
              key={label}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-soft-blue/20 border-l-4 border-mint-green text-soft-blue"
                  : "bg-cool-gray/10 text-cool-gray hover:bg-cool-gray/20"
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
