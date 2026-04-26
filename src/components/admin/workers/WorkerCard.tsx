"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"                       
import {
  Star, Mail, Phone, FileText, Trash2, Info,
  BadgeCheck,
} from "lucide-react"
import { Worker, Role, ROLE_CONFIG } from "@/types/admin/workers"
import WorkerInfoModal from "./WorkerInfoModal"

// ─── Sub-components (unchanged) ───────────────────────────────────────────────

function Avatar({ name, img, gradient }: {
  name: string
  img?: string
  color: string
  gradient: string
}) {
  if (img) {
    return (
      <img
        src={img}
        alt={name}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover flex-shrink-0 shadow-sm"
      />
    )
  }
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
      style={{ background: gradient }}
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
        {rating > 0 ? rating.toFixed(1) : "0"}
      </span>
    </div>
  )
}

// ─── Main Card ────────────────────────────────────────────────────────────────

interface WorkerCardProps {
  worker: Worker
  onDelete: (params: { workerId: string; email: string; role: Role }) => void
}

export default function WorkerCard({ worker, onDelete }: WorkerCardProps) {
  const router = useRouter()                                        
  const [showInfoModal, setShowInfoModal] = useState(false)

  const cfg = ROLE_CONFIG[worker.role]

  const handleDeleteClick = () => {
    onDelete({ workerId: worker._id, email: worker.email, role: worker.role })
  }

  // ── Changed: no fetch, just navigate ─────────────────────────────────────
  const handleReportClick = () => {
    router.push(`/admin/workers/${worker.id}/report`)
  }

  return (
    <>
      <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col">

        {/* Coloured top stripe */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: cfg.gradient }} />

        <div className="p-4 sm:p-5 flex flex-col flex-1">

          {/* ── Header ── */}
          <div className="flex items-start gap-3 sm:gap-4">
            <Avatar
              name={worker.name}
              img={worker.img}
              color={cfg.color}
              gradient={cfg.gradient}
            />
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
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
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
                {worker.certifications.slice(0, 1).map((c) => (
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
          <div className="flex flex-col gap-2 mt-4">
            {worker.personal_email && (
              <div className="flex items-center gap-2.5 px-1">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cfg.color }} />
                <span className="text-xs text-[var(--color-dark-slate-gray)] truncate font-semibold">
                  {worker.personal_email}
                </span>
              </div>
            )}
            {worker.phone && (
              <div className="flex items-center gap-2.5 px-1">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#10B981" }} />
                <span className="text-xs text-[var(--color-dark-slate-gray)] font-semibold">
                  {worker.phone}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* ── Footer ── */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            {/* More info */}
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:opacity-80"
              style={{ color: cfg.color, background: cfg.lightBg }}
            >
              <Info className="w-3.5 h-3.5" />
              More info
            </button>

            <div className="flex items-center gap-1">
              {/* ── Report button — now navigates to the full page ── */}
              <button
                onClick={handleReportClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-gray-100"
                style={{ color: cfg.color }}
              >
                <FileText className="w-3.5 h-3.5" />
                Report
              </button>

              {/* Delete button */}
              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-soft-coral)] transition-all duration-200 hover:bg-[var(--color-soft-coral)]/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal (unchanged) */}
      {showInfoModal && (
        <WorkerInfoModal
          worker={worker}
          onClose={() => setShowInfoModal(false)}
        />
      )}
    </>
  )
}
