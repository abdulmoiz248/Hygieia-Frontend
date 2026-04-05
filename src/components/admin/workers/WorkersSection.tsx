"use client"

import { Stethoscope, Salad, FlaskConical, Loader2 } from "lucide-react"
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
  const cfg  = ROLE_CONFIG[role]
  const Icon = ROLE_ICONS[role]

  return (
    <div className="space-y-3">

      {/* Section heading — only shown in "All" tab */}
      {showRoleHeading && (
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
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
        </div>
      )}

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

      {/*
        Cards grid — breakpoints:
          < sm  (0–639px)   : 1 column  — full-width cards on phones
          sm–md (640–767px) : 2 columns — small tablets / large phones landscape
          md–xl (768–1279px): 2 columns — tablets portrait & landscape
          xl+   (1280px+)   : 3 columns — desktop

        Previously jumped straight from 1→2 at md, leaving small tablets
        on a single-column layout. Adding sm:grid-cols-2 fills that gap.
      */}
      {!loading && workers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 items-stretch">
          {workers.map((worker) => (
            <WorkerCard key={worker._id} worker={worker} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
