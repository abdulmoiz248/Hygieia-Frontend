"use client"

import { Search, X } from "lucide-react"
import { Role } from "@/types/admin/workers"

const TABS: { label: string; value: Role | "all" }[] = [
  { label: "All",           value: "all"          },
  { label: "Doctors",       value: "doctor"       },
  { label: "Nutritionists", value: "nutritionist" },
  { label: "Pathologists",  value: "pathologist"  },
]

interface WorkersSearchTabsProps {
  search: string
  activeTab: Role | "all"
  onSearchChange: (v: string) => void
  onTabChange: (v: Role | "all") => void
}

export default function WorkersSearchTabs({
  search,
  activeTab,
  onSearchChange,
  onTabChange,
}: WorkersSearchTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

      {/* Search */}
      <div className="relative w-full sm:max-w-sm group">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-cool-gray)] transition-colors group-focus-within:text-[var(--color-soft-blue)]" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, specialization or email…"
          autoComplete="new-password"
          className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm outline-none transition-all
            bg-white border border-gray-200
            shadow-[0_2px_8px_rgba(0,0,0,0.06)]
            focus:border-[var(--color-soft-blue)] focus:ring-2 focus:ring-[var(--color-soft-blue)]/15
            focus:shadow-[0_4px_16px_rgba(91,168,196,0.15)]
            placeholder:text-gray-400"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5 text-[var(--color-cool-gray)]" />
          </button>
        )}
      </div>

      {/*
        Tab group — responsive behaviour:

        Mobile  (<sm): w-full so the pill container stretches edge-to-edge.
                       Each button is flex-1 so all four tabs share the width
                       equally and nothing wraps or overflows.
                       Font shrinks slightly (text-xs) to fit "Nutritionists"
                       comfortably on a 320 px viewport.

        Desktop (sm+): w-auto so the container hugs its content.
                       flex-none on each button restores natural sizing.
                       Font back to text-sm, padding back to px-4.
      */}
      <div
        className="
          flex w-full sm:w-auto
          bg-white border border-gray-200 rounded-xl p-1
          shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        "
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className="
                flex-1 sm:flex-none
                px-2 sm:px-4 py-2
                rounded-lg
                text-xs sm:text-sm font-medium
                text-center whitespace-nowrap
                transition-all duration-200
              "
              style={
                active
                  ? {
                      background: "var(--gradient-primary)",
                      color: "white",
                      boxShadow: "0 2px 8px rgba(91,168,196,0.3)",
                    }
                  : { color: "var(--color-cool-gray)" }
              }
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
