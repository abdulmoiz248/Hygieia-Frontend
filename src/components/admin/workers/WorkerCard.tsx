"use client"

import { useState } from "react"
import {
  Star, Mail, Phone, Globe, Clock, Calendar,
  BadgeCheck, ChevronDown, Trash2, FileText,
} from "lucide-react"
import { Worker, Role, ROLE_CONFIG } from "@/types/admin/workers"
import { useWorkerReport } from "@/hooks/admin/workers/useWorkerReport"
import WorkerReportModal from "./WorkerReportModal"
import type { WorkerReport } from "@/hooks/admin/workers/useWorkerReport"

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name, color }: { name: string; color: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <div
      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0"
      style={{ background: color }}
    >
      {initials}
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold text-[var(--color-dark-slate-gray)]">
        {rating > 0 ? rating.toFixed(1) : "N/A"}
      </span>
    </div>
  )
}

function WorkingHourRow({ day, start, end, location }: {
  day: string; start: string; end: string; location: string
}) {
  return (
    <div className="px-3 py-2 rounded-lg bg-gray-50 text-[11px] space-y-0.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-[var(--color-dark-slate-gray)]">{day}</span>
        <span className="tabular-nums text-[var(--color-cool-gray)]">{start} – {end}</span>
      </div>
      {location && (
        <p className="truncate text-[10px] text-[var(--color-cool-gray)]/60">{location}</p>
      )}
    </div>
  )
}

// ─── Main Card ────────────────────────────────────────────────────────────────

interface WorkerCardProps {
  worker: Worker
  onDelete: (params: { workerId: string; email: string; role: Role }) => void
}

export default function WorkerCard({ worker, onDelete }: WorkerCardProps) {
  const [expanded,    setExpanded]    = useState(false)
  const [reportData,  setReportData]  = useState<WorkerReport | null>(null)

  const cfg = ROLE_CONFIG[worker.role]
  const { mutate: fetchReport, isPending: reportLoading } = useWorkerReport()

  const handleDeleteClick = () => {
    onDelete({ workerId: worker._id, email: worker.email, role: worker.role })
  }

  const handleReportClick = () => {
    fetchReport(worker.id, {
      onSuccess: (data) => setReportData(data),
    })
  }

  return (
    <>
      <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md flex flex-col">

        {/* Coloured top stripe */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: cfg.gradient }} />

        <div className="p-4 sm:p-5 flex flex-col flex-1">

          {/* ── Header ── */}
          <div className="flex items-start gap-3 sm:gap-4">
            <Avatar name={worker.name} color={cfg.color} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-[var(--color-dark-slate-gray)] text-sm sm:text-base leading-tight line-clamp-1 min-w-0">
                  {worker.name}
                </h3>
                <StarRating rating={worker.rating} />
              </div>
              <p className="text-xs mt-1 font-medium truncate" style={{ color: cfg.color }}>
                {worker.specialization || cfg.label}
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-2.5">
                {worker.experienceYears > 0 && (
                  <span
                    className="text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium"
                    style={{ background: cfg.lightBg, color: cfg.color }}
                  >
                    {worker.experienceYears} yrs exp
                  </span>
                )}
                {worker.consultationFee > 0 && (
                  <span className="text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium">
                    Rs.&nbsp;{worker.consultationFee.toLocaleString()}
                  </span>
                )}
                {worker.certifications.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    className="text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium flex items-center gap-1"
                  >
                    <BadgeCheck className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate max-w-[80px] sm:max-w-none">{c}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Contact ── */}
          <div className="flex flex-col gap-1.5 mt-4 text-xs text-[var(--color-cool-gray)] min-h-[36px]">
            {worker.personal_email && (
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{worker.personal_email}</span>
              </div>
            )}
            {worker.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{worker.phone}</span>
              </div>
            )}
          </div>

          {/* ── Expanded Details ── */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-xs text-[var(--color-cool-gray)]">
              {worker.bio && (
                <p className="italic leading-relaxed">{worker.bio}</p>
              )}
              {worker.languages.length > 0 && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{worker.languages.join(", ")}</span>
                </div>
              )}
              {worker.workingHours.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="font-semibold text-[var(--color-dark-slate-gray)]">Working Hours</span>
                  </div>
                  <div className="grid gap-1.5">
                    {worker.workingHours.slice(0, 3).map((wh, i) => (
                      <WorkingHourRow key={i} day={wh.day} start={wh.start} end={wh.end} location={wh.location} />
                    ))}
                    {worker.workingHours.length > 3 && (
                      <p className="text-[11px] text-center text-[var(--color-cool-gray)] pt-0.5">
                        +{worker.workingHours.length - 3} more days
                      </p>
                    )}
                  </div>
                </div>
              )}
              {worker.dateofbirth && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>DOB: {worker.dateofbirth} · {worker.gender}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex-1" />

          {/* ── Footer ── */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: cfg.color }}
            >
              {expanded ? "Less info" : "More info"}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              />
            </button>

            <div className="flex items-center gap-1">
              {/* Report button */}
              <button
                onClick={handleReportClick}
                disabled={reportLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                style={{ color: cfg.color }}
              >
                {reportLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                {reportLoading ? "Loading…" : "Report"}
              </button>

              {/* Delete button */}
              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-soft-coral)] hover:bg-[var(--color-soft-coral)]/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportData && (
        <WorkerReportModal
          worker={worker}
          report={reportData}
          onClose={() => setReportData(null)}
        />
      )}
    </>
  )
}
