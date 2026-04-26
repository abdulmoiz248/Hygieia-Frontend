import { Search, LayoutGrid, List } from "lucide-react"
import { Tab, ViewMode } from "@/lib/admin/blog-helpers"

interface TabConfig {
  key:   Tab
  label: string
  count: number
}

interface BlogFiltersProps {
  tabs:        TabConfig[]
  activeTab:   Tab
  onTabChange: (tab: Tab) => void
  search:      string
  onSearch:    (value: string) => void
  viewMode:    ViewMode
  onViewMode:  (mode: ViewMode) => void
}

export function BlogFilters({
  tabs, activeTab, onTabChange,
  search, onSearch,
  viewMode, onViewMode,
}: BlogFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-white border border-[var(--color-cool-gray)]/20 rounded-2xl p-1 shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-95"
            style={activeTab === tab.key
              ? { background: "var(--gradient-primary)", color: "white" }
              : { color: "var(--color-cool-gray)" }}
            onMouseEnter={e => {
              if (activeTab !== tab.key) {
                (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.96 0.02 210)"
                ;(e.currentTarget as HTMLButtonElement).style.color = "var(--color-dark-slate-gray)"
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.key) {
                (e.currentTarget as HTMLButtonElement).style.background = ""
                ;(e.currentTarget as HTMLButtonElement).style.color = "var(--color-cool-gray)"
              }
            }}
          >
            {tab.label}
            <span
              className="text-[11px] px-1.5 py-0.5 rounded-full font-bold leading-none transition-all"
              style={activeTab === tab.key
                ? { background: "rgba(255,255,255,0.25)", color: "white" }
                : { background: "oklch(0.93 0.02 180)", color: "var(--color-cool-gray)" }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search + View Mode */}
      <div className="flex items-center gap-2">

        {/* Search */}
        <div className="relative group/search">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-cool-gray)] transition-colors group-focus-within/search:text-[var(--color-soft-blue)]" />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search posts…"
            className="pl-9 pr-4 py-2 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-blue)] focus:border-[var(--color-soft-blue)] outline-none bg-white shadow-sm text-sm w-52 transition-all duration-200 hover:border-[var(--color-soft-blue)]/50 hover:shadow-md placeholder:text-[var(--color-cool-gray)]/60"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-1 bg-white border border-[var(--color-cool-gray)]/20 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => onViewMode("grid")}
            className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-90"
            style={viewMode === "grid"
              ? { background: "var(--gradient-primary)", color: "white" }
              : { color: "var(--color-cool-gray)" }}
            onMouseEnter={e => {
              if (viewMode !== "grid") {
                (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.96 0.02 210)"
                ;(e.currentTarget as HTMLButtonElement).style.color = "var(--color-dark-slate-gray)"
              }
            }}
            onMouseLeave={e => {
              if (viewMode !== "grid") {
                (e.currentTarget as HTMLButtonElement).style.background = ""
                ;(e.currentTarget as HTMLButtonElement).style.color = "var(--color-cool-gray)"
              }
            }}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewMode("list")}
            className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-90"
            style={viewMode === "list"
              ? { background: "var(--gradient-primary)", color: "white" }
              : { color: "var(--color-cool-gray)" }}
            onMouseEnter={e => {
              if (viewMode !== "list") {
                (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.96 0.02 210)"
                ;(e.currentTarget as HTMLButtonElement).style.color = "var(--color-dark-slate-gray)"
              }
            }}
            onMouseLeave={e => {
              if (viewMode !== "list") {
                (e.currentTarget as HTMLButtonElement).style.background = ""
                ;(e.currentTarget as HTMLButtonElement).style.color = "var(--color-cool-gray)"
              }
            }}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}
