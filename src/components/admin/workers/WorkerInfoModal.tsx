"use client"

import { createPortal } from "react-dom"
import {
  X, Star, Mail, Phone, Globe, Clock, Calendar,
  BadgeCheck, GraduationCap, Banknote, Briefcase, UserCircle2,
} from "lucide-react"
import { Worker, ROLE_CONFIG } from "@/types/admin/workers"
import { formatDateOnly } from "@/helpers/date"
import { timeAgo } from "@/helpers/formatTimeAgo"

interface WorkerInfoModalProps {
  worker: Worker
  onClose: () => void
}

const IC = {
  about:      "var(--color-soft-blue)",
  mail:       "var(--color-soft-blue)",
  phone:      "var(--color-mint-green)",
  globe:      "var(--color-soft-coral)",
  clock:      "var(--color-soft-coral)",
  calendar:   "var(--color-soft-blue)",
  badge:      "var(--color-mint-green)",
  graduation: "var(--color-soft-blue)",
  banknote:   "var(--color-mint-green)",
  briefcase:  "var(--color-soft-blue)",
}

function SectionHeading({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.95 0.03 210)" }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
      <div className="flex-1 h-px ml-1" style={{ background: "oklch(0.90 0.02 210)" }} />
    </div>
  )
}

function Pill({ children, color, bg }: { children: React.ReactNode; color?: string; bg?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{ background: bg ?? "oklch(0.97 0.01 210)", color: color ?? "var(--color-cool-gray)", border: "1px solid oklch(0.90 0.02 210)" }}
    >
      {children}
    </span>
  )
}

function InfoRow({ icon: Icon, iconColor, children, sub }: { icon: React.ElementType; iconColor: string; children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-3.5 py-3.5 rounded-xl" style={{ background: "oklch(0.97 0.01 210)", borderLeft: "3px solid oklch(0.88 0.04 210)" }}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: iconColor }} />
      <div className="min-w-0">
        <div className="text-sm text-[var(--color-dark-slate-gray)] font-medium break-all">{children}</div>
        {sub && <div className="text-[10px] text-[var(--color-cool-gray)] mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

function DetailBox({ label, value, color, span2 = false }: { label: string; value: React.ReactNode; color: string; span2?: boolean }) {
  return (
    <div className={`px-3.5 py-2.5 rounded-xl ${span2 ? "col-span-2" : ""}`} style={{ background: "oklch(0.97 0.01 210)", borderLeft: "3px solid oklch(0.88 0.04 210)" }}>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{label}</p>
      <div className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">{value}</div>
    </div>
  )
}

export default function WorkerInfoModal({ worker, onClose }: WorkerInfoModalProps) {
  const cfg = ROLE_CONFIG[worker.role]

  const initials = worker.name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase()

  const hasContact   = !!(worker.personal_email || worker.email || worker.phone)
  const hasEducation = worker.education.length > 0
  const hasLanguages = worker.languages.length > 0
  const hasCerts     = worker.certifications.length > 0
  const hasHours     = worker.workingHours.length > 0
  const hasPersonal  = !!(worker.dateofbirth || worker.gender || worker.createdAt)

  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* max-w-4xl for a wider, less cluttered feel */}
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Coloured stripe */}
        <div className="h-1.5 w-full flex-shrink-0" style={{ background: cfg.gradient }} />

        {/* ── Header ── */}
        <div className="px-7 pt-5 pb-4 border-b border-gray-100 flex items-center gap-4 flex-shrink-0">
          {worker.img ? (
            <img src={worker.img} alt={worker.name} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 shadow-sm" />
          ) : (
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ background: cfg.gradient }}>
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)] leading-tight truncate">{worker.name}</h2>
            <p className="text-xs font-medium mt-0.5" style={{ color: cfg.color }}>{worker.specialization || cfg.label}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-[var(--color-dark-slate-gray)]">{worker.rating > 0 ? worker.rating.toFixed(1) : "New"}</span>
              </span>
              {worker.experienceYears > 0 && (
                <Pill color={cfg.color} bg={cfg.lightBg}>
                  <Briefcase className="w-3 h-3" style={{ color: IC.briefcase }} />
                  {worker.experienceYears} yrs
                </Pill>
              )}
              {worker.consultationFee > 0 && (
                <Pill>
                  <Banknote className="w-3 h-3" style={{ color: IC.banknote }} />
                  Rs.&nbsp;{worker.consultationFee.toLocaleString()}
                </Pill>
              )}
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto px-7 py-6 space-y-6">

          {/* Bio — full width */}
          {worker.bio && (
            <div>
              <SectionHeading icon={UserCircle2} label="About" color={IC.about} />
              <p className="text-sm text-[var(--color-cool-gray)] leading-relaxed italic pl-8">{worker.bio}</p>
            </div>
          )}

          {/*
            Paired 2-column grid — each row is a semantic pair:
            Row 1: Contact        | Education
            Row 2: Languages      | Certifications
            Row 3: Working Hours  | Personal Details
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

            {/* ─── Row 1 left: Contact ─── */}
            {hasContact && (
              <div>
                <SectionHeading icon={Mail} label="Contact" color={IC.mail} />
                <div className="space-y-2">
                  {(worker.personal_email || worker.email) && (
                    <InfoRow icon={Mail} iconColor={IC.mail}>{worker.personal_email || worker.email}</InfoRow>
                  )}
                  {worker.email && worker.personal_email && worker.email !== worker.personal_email && (
                    <InfoRow icon={Mail} iconColor={IC.mail} sub="Work email">{worker.email}</InfoRow>
                  )}
                  {worker.phone && (
                    <InfoRow icon={Phone} iconColor={IC.phone}>{worker.phone}</InfoRow>
                  )}
                </div>
              </div>
            )}

            {/* ─── Row 1 right: Education ─── */}
            {hasEducation && (
              <div>
                <SectionHeading icon={GraduationCap} label="Education" color={IC.graduation} />
                <div className="space-y-2">
                  {worker.education.map((edu) => (
                    <InfoRow key={edu} icon={GraduationCap} iconColor={IC.graduation}>{edu}</InfoRow>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Row 2 left: Languages ─── */}
            {hasLanguages && (
              <div>
                <SectionHeading icon={Globe} label="Languages" color={IC.globe} />
                <div className="flex flex-wrap gap-1.5">
                  {worker.languages.map((lang) => (
                    <Pill key={lang}>
                      <Globe className="w-3 h-3" style={{ color: IC.globe }} />
                      {lang}
                    </Pill>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Row 2 right: Certifications ─── */}
            {hasCerts && (
              <div>
                <SectionHeading icon={BadgeCheck} label="Certifications" color={IC.badge} />
                <div className="flex flex-wrap gap-1.5">
                  {worker.certifications.map((c) => (
                    <Pill key={c} color={IC.badge} bg="oklch(0.96 0.03 178)">
                      <BadgeCheck className="w-3 h-3" style={{ color: IC.badge }} />
                      {c}
                    </Pill>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Row 3 left: Working Hours ─── */}
            {hasHours && (
              <div>
                <SectionHeading icon={Clock} label="Working Hours" color={IC.clock} />
                <div className="space-y-2">
                  {worker.workingHours.map((wh, i) => (
                    <div
                      key={i}
                      className="px-3.5 py-2.5 rounded-xl flex items-start justify-between gap-3"
                      style={{ background: "oklch(0.97 0.01 210)", borderLeft: "3px solid oklch(0.88 0.04 210)" }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: IC.clock }} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">{wh.day}</p>
                          {wh.location && (
                            <p className="text-[11px] text-[var(--color-cool-gray)] truncate mt-0.5">{wh.location}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-semibold tabular-nums flex-shrink-0" style={{ color: IC.clock }}>
                        {wh.start} – {wh.end}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Row 3 right: Personal Details ─── */}
            {hasPersonal && (
              <div>
                <SectionHeading icon={Calendar} label="Personal Details" color={IC.calendar} />
                <div className="grid grid-cols-2 gap-2">
                  {worker.gender && (
                    <DetailBox label="Gender" value={<span className="capitalize">{worker.gender}</span>} color={IC.calendar} />
                  )}
                  {worker.dateofbirth && (
                    <DetailBox label="Date of Birth" value={formatDateOnly(worker.dateofbirth)} color={IC.calendar} />
                  )}
                  {worker.createdAt && (
                    <DetailBox
                      label="Joined"
                      span2
                      color={IC.calendar}
                      value={
                        <>
                          {formatDateOnly(worker.createdAt)}
                          <span className="font-normal text-[var(--color-cool-gray)] ml-1.5 text-xs">
                            · {timeAgo(worker.createdAt)}
                          </span>
                        </>
                      }
                    />
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )

  if (typeof document === "undefined") return null
  return createPortal(modal, document.body)
}
