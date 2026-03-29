"use client"

import { useState } from "react"
import {
  Star, Mail, Phone, Globe, Clock, Calendar,
  BadgeCheck, ChevronDown, Trash2,
} from "lucide-react"
import { Worker, ROLE_CONFIG } from "@/types/admin/workers"

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
      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
      style={{ background: color }}
    >
      {initials}
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold text-[var(--color-dark-slate-gray)]">
        {rating > 0 ? rating.toFixed(1) : "N/A"}
      </span>
    </div>
  )
}

// ─── Main Card ────────────────────────────────────────────────────────────────

interface WorkerCardProps {
  worker: Worker
  onDelete: (id: string) => void
}

export default function WorkerCard({ worker, onDelete }: WorkerCardProps) {
  const [expanded, setExpanded] = useState(false)
  const cfg = ROLE_CONFIG[worker.role]

  return (
    <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md flex flex-col">
      {/* Colored top stripe */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: cfg.gradient }} />

      {/* Card body — flex-col so footer always sticks to bottom */}
      <div className="p-5 flex flex-col flex-1">

        {/* ── Top: Avatar + Name + Rating ── */}
        <div className="flex items-start gap-4">
          <Avatar name={worker.name} color={cfg.color} />
          <div className="flex-1 min-w-0">
            {/* Name row */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-[var(--color-dark-slate-gray)] text-base leading-tight line-clamp-1">
                {worker.name}
              </h3>
              <div className="flex-shrink-0">
                <StarRating rating={worker.rating} />
              </div>
            </div>
            {/* Specialization */}
            <p className="text-xs mt-1 font-medium truncate" style={{ color: cfg.color }}>
              {worker.specialization || cfg.label}
            </p>
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {worker.experienceYears > 0 && (
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{ background: cfg.lightBg, color: cfg.color }}
                >
                  {worker.experienceYears} yrs exp
                </span>
              )}
              {worker.consultationFee > 0 && (
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium">
                  Rs. {worker.consultationFee.toLocaleString()}
                </span>
              )}
              {worker.certifications.slice(0, 2).map((c) => (
                <span
                  key={c}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium flex items-center gap-1"
                >
                  <BadgeCheck className="w-3 h-3" />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Contact Info — always same height ── */}
        <div className="flex flex-col gap-1.5 mt-4 text-xs text-[var(--color-cool-gray)] min-h-[36px]">
          {worker.personal_email ? (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{worker.personal_email}</span>
            </div>
          ) : null}
          {worker.phone ? (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{worker.phone}</span>
            </div>
          ) : null}
        </div>

        {/* ── Expanded Details ── */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-xs text-[var(--color-cool-gray)]">
            {worker.bio && (
              <p className="italic leading-relaxed text-[var(--color-cool-gray)]">{worker.bio}</p>
            )}

            {worker.languages.length > 0 && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{worker.languages.join(", ")}</span>
              </div>
            )}

            {worker.workingHours.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[var(--color-dark-slate-gray)]">Working Hours</span>
                </div>
                <div className="grid gap-1.5">
                  {worker.workingHours.slice(0, 3).map((wh, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 text-[11px]"
                    >
                      <span className="font-semibold w-20">{wh.day}</span>
                      <span>{wh.start} – {wh.end}</span>
                      <span className="truncate ml-2 max-w-[100px] text-right">{wh.location}</span>
                    </div>
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

        {/* ── Spacer pushes footer down ── */}
        <div className="flex-1" />

        {/* ── Footer: always at bottom ── */}
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

          <button
            onClick={() => onDelete(worker._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-soft-coral)] hover:bg-[var(--color-soft-coral)]/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
