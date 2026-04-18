"use client"

import { useState } from "react"
import { Stethoscope, Salad, FlaskConical, Loader2, ChevronDown } from "lucide-react"
import { Worker, Role, ROLE_CONFIG } from "@/types/admin/workers"
import WorkerCard from "./WorkerCard"

const ROLE_ICONS: Record<Role, React.ElementType> = {
  doctor:       Stethoscope,
  nutritionist: Salad,
  pathologist:  FlaskConical,
}

interface WorkersSectionProps {
  role: Role
  workers: Worker[]
  loading: boolean
  showRoleHeading: boolean
  onDelete: (params: { workerId: string; email: string; role: Role }) => void
}

export default function WorkersSection({
  role,
  workers,
  loading,
  showRoleHeading,
  onDelete,
}: WorkersSectionProps) {
  const [collapsed, setCollapsed] = useState(false)

  const cfg  = ROLE_CONFIG[role]
  const Icon = ROLE_ICONS[role]

  return (
    <div className="space-y-3">

      {/* Section heading — shown in "All" tab or always as a collapsible toggle */}
      <div
        className={`flex items-center gap-2 ${showRoleHeading || !loading ? "cursor-pointer select-none group" : ""}`}
        onClick={() => setCollapsed((c) => !c)}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105"
          style={{ background: cfg.lightBg }}
        >
          <Icon className="w-4 h-4" style={{ color: cfg.color }} />
        </div>
        <h2 className="font-semibold text-[var(--color-dark-slate-gray)]">{cfg.plural}</h2>
        {!loading && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: cfg.lightBg, color: cfg.color }}
          >
            {workers.length}
          </span>
        )}
        <div className="flex-1" />
        {/* Collapse toggle */}
        <button
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-all duration-200 hover:bg-gray-100"
          style={{ color: cfg.color }}
          onClick={(e) => { e.stopPropagation(); setCollapsed((c) => !c) }}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "-rotate-90" : ""}`}
          />
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>

      {/* Collapsible content */}
      {!collapsed && (
        <>
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12 gap-3 text-[var(--color-cool-gray)]">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: cfg.color }} />
              <span className="text-sm">Loading {cfg.plural.toLowerCase()}…</span>
            </div>
          )}

          {/* Empty state */}
          {!loading && workers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[var(--color-cool-gray)]/30 p-10 text-center">
              <Icon className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: cfg.color }} />
              <p className="text-sm text-[var(--color-cool-gray)]">
                No {cfg.plural.toLowerCase()} found
              </p>
            </div>
          )}

          {/* Cards grid */}
          {!loading && workers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 items-start">
              {workers.map((worker) => (
                <WorkerCard key={worker._id} worker={worker} onDelete={onDelete} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
