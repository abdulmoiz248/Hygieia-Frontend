import { useState } from "react"
import { Search, SortAsc, ChevronDown, X } from "lucide-react"
import { STATUS_CONFIG, FILTER_TABS, SORT_OPTIONS } from "@/types/admin/cv.config"
import type { CVStatus, FilterRole, FilterStatus, SortKey } from "@/types/admin/cv"

interface CVFiltersBarProps {
  search: string
  onSearch: (v: string) => void
  filterRole: FilterRole
  onFilterRole: (v: FilterRole) => void
  filterStatus: FilterStatus
  onFilterStatus: (v: FilterStatus) => void
  sortKey: SortKey
  onSort: (v: SortKey) => void
}

export default function CVFiltersBar({
  search, onSearch,
  filterRole, onFilterRole,
  filterStatus, onFilterStatus,
  sortKey, onSort,
}: CVFiltersBarProps) {
  const [showSort, setShowSort] = useState(false)

  return (
    <div className="space-y-3">

      {/* Row 1: Search + Role tabs + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">

        {/* Search */}
        <div className="relative flex-1 sm:max-w-sm group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-cool-gray)] transition-colors group-focus-within:text-[var(--color-soft-blue)]" />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-cool-gray)]/30
              bg-white shadow-sm text-sm outline-none transition-all
              hover:border-[var(--color-soft-blue)]/40 hover:shadow-[0_4px_12px_rgba(91,168,196,0.1)]
              focus:border-[var(--color-soft-blue)] focus:ring-2 focus:ring-[var(--color-soft-blue)]/15
              focus:shadow-[0_4px_16px_rgba(91,168,196,0.15)]"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5 text-[var(--color-cool-gray)]" />
            </button>
          )}
        </div>

        {/* Role tabs + divider + sort */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1 bg-white border border-[var(--color-cool-gray)]/20 rounded-xl p-1 shadow-sm">
            {FILTER_TABS.map(tab => {
              const active = filterRole === tab.value
              return (
                <button
                  key={tab.value}
                  onClick={() => onFilterRole(tab.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap active:scale-[0.97]"
                  style={active
                    ? { background: "var(--gradient-primary)", color: "white", boxShadow: "0 2px 8px rgba(91,168,196,0.3)" }
                    : { color: "var(--color-cool-gray)" }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(91,168,196,0.08)"
                      e.currentTarget.style.color = "var(--color-soft-blue)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = ""
                      e.currentTarget.style.color = "var(--color-cool-gray)"
                    }
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="w-px h-6 bg-[var(--color-cool-gray)]/20" />

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[var(--color-cool-gray)]/20 shadow-sm text-xs font-medium text-[var(--color-cool-gray)] hover:text-[var(--color-dark-slate-gray)] hover:border-[var(--color-soft-blue)]/40 hover:shadow-[0_4px_12px_rgba(91,168,196,0.1)] transition-all duration-200 whitespace-nowrap active:scale-[0.97]"
            >
              <SortAsc className="w-3.5 h-3.5" />
              {SORT_OPTIONS.find(s => s.value === sortKey)?.label}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showSort ? "rotate-180" : ""}`} />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1.5 bg-white border border-[var(--color-cool-gray)]/20 rounded-xl shadow-lg z-20 py-1 min-w-[150px]">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { onSort(opt.value); setShowSort(false) }}
                    className="w-full text-left px-4 py-2 text-xs font-medium transition-all duration-150 hover:bg-gray-50 active:scale-[0.98]"
                    style={sortKey === opt.value ? { color: "var(--color-soft-blue)" } : { color: "var(--color-cool-gray)" }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Status filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-[var(--color-cool-gray)]">Status:</span>
        {(["new", "reviewed", "shortlisted", "rejected"] as CVStatus[]).map(s => {
          const cfg = STATUS_CONFIG[s]
          const isActive = filterStatus === s
          return (
            <button
              key={s}
              onClick={() => onFilterStatus(filterStatus === s ? "all" : s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={isActive
                ? { background: cfg.lightBg, color: cfg.color, borderColor: cfg.color }
                : { background: "white", color: "var(--color-cool-gray)", borderColor: "oklch(0.90 0.02 180)" }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = cfg.color
                  e.currentTarget.style.color = cfg.color
                  e.currentTarget.style.background = cfg.lightBg
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "oklch(0.90 0.02 180)"
                  e.currentTarget.style.color = "var(--color-cool-gray)"
                  e.currentTarget.style.background = "white"
                }
              }}
            >
              <cfg.icon className="w-3 h-3" />
              {cfg.label}
            </button>
          )
        })}
        {filterStatus !== "all" && (
          <button
            onClick={() => onFilterStatus("all")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-[var(--color-cool-gray)] hover:text-[var(--color-soft-coral)] hover:bg-[oklch(0.96_0.06_10)] transition-all duration-200 active:scale-95"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>
    </div>
  )
}
