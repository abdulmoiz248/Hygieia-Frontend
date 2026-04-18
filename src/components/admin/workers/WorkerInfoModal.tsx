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

// Distinct colours per info category
const IC = {
  about:      "#8B5CF6",
  mail:       "#3B82F6",
  phone:      "#10B981",
  globe:      "#F59E0B",
  clock:      "#F97316",
  calendar:   "#06B6D4",
  badge:      "#10B981",
  graduation: "#6366F1",
  banknote:   "#16A34A",
  briefcase:  "#0EA5E9",
}

function SectionHeading({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType
  label: string
  color: string
}) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-cool-gray)]">
        {label}
      </span>
    </div>
  )
}

function Pill({
  children,
  color,
  bg,
}: {
  children: React.ReactNode
  color?: string
  bg?: string
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{
        background: bg ?? "#F8FAFC",
        color: color ?? "var(--color-cool-gray)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </span>
  )
}

export default function WorkerInfoModal({ worker, onClose }: WorkerInfoModalProps) {
  const cfg = ROLE_CONFIG[worker.role]

  const initials = worker.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Coloured stripe */}
        <div className="h-1.5 w-full flex-shrink-0" style={{ background: cfg.gradient }} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start gap-4 flex-shrink-0">
          {worker.img ? (
            <img
              src={worker.img}
              alt={worker.name}
              className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 shadow-sm"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{ background: cfg.gradient }}
            >
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)] leading-tight">
              {worker.name}
            </h2>
            <p className="text-xs font-medium mt-0.5" style={{ color: cfg.color }}>
              {worker.specialization || cfg.label}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-[var(--color-dark-slate-gray)]">
                  {worker.rating > 0 ? worker.rating.toFixed(1) : "0"}
                </span>
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

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 mt-0.5"
          >
            <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5 space-y-6">

          {/* Bio */}
          {worker.bio && (
            <div>
              <SectionHeading icon={UserCircle2} label="About" color={IC.about} />
              <p className="text-sm text-[var(--color-cool-gray)] leading-relaxed italic">
                {worker.bio}
              </p>
            </div>
          )}

          {/* Contact */}
          {(worker.personal_email || worker.email || worker.phone) && (
            <div>
              <SectionHeading icon={Mail} label="Contact" color={IC.mail} />
              <div className="space-y-2">
                {(worker.personal_email || worker.email) && (
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gray-50">
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: IC.mail }} />
                    <span className="text-sm text-[var(--color-dark-slate-gray)] truncate font-medium">
                      {worker.personal_email || worker.email}
                    </span>
                  </div>
                )}
                {worker.email && worker.personal_email && worker.email !== worker.personal_email && (
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gray-50">
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: IC.mail }} />
                    <div className="min-w-0">
                      <span className="text-sm text-[var(--color-dark-slate-gray)] truncate block font-medium">
                        {worker.email}
                      </span>
                      <span className="text-[10px] text-[var(--color-cool-gray)]">Work email</span>
                    </div>
                  </div>
                )}
                {worker.phone && (
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gray-50">
                    <Phone className="w-4 h-4 flex-shrink-0" style={{ color: IC.phone }} />
                    <span className="text-sm text-[var(--color-dark-slate-gray)] font-medium">
                      {worker.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {worker.languages.length > 0 && (
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

          {/* Working Hours — ALL */}
          {worker.workingHours.length > 0 && (
            <div>
              <SectionHeading icon={Clock} label="Working Hours" color={IC.clock} />
              <div className="grid gap-2">
                {worker.workingHours.map((wh, i) => (
                  <div
                    key={i}
                    className="px-3.5 py-2.5 rounded-xl flex items-start justify-between gap-3 bg-gray-50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: IC.clock }} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">{wh.day}</p>
                        {wh.location && (
                          <p className="text-[11px] text-[var(--color-cool-gray)] truncate mt-0.5">
                            {wh.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className="text-xs font-semibold tabular-nums flex-shrink-0 mt-0.5"
                      style={{ color: IC.clock }}
                    >
                      {wh.start} – {wh.end}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {worker.certifications.length > 0 && (
            <div>
              <SectionHeading icon={BadgeCheck} label="Certifications" color={IC.badge} />
              <div className="flex flex-wrap gap-1.5">
                {worker.certifications.map((c) => (
                  <Pill key={c} color={IC.badge} bg="#F0FDF4">
                    <BadgeCheck className="w-3 h-3" style={{ color: IC.badge }} />
                    {c}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {worker.education.length > 0 && (
            <div>
              <SectionHeading icon={GraduationCap} label="Education" color={IC.graduation} />
              <div className="space-y-1.5">
                {worker.education.map((edu) => (
                  <div
                    key={edu}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50"
                  >
                    <GraduationCap className="w-4 h-4 flex-shrink-0" style={{ color: IC.graduation }} />
                    <span className="text-sm text-[var(--color-dark-slate-gray)] font-medium">{edu}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Details */}
          {(worker.dateofbirth || worker.gender || worker.createdAt) && (
            <div>
              <SectionHeading icon={Calendar} label="Personal Details" color={IC.calendar} />
              <div className="grid grid-cols-2 gap-2">
                {worker.dateofbirth && (
                  <div className="px-3.5 py-2.5 rounded-xl bg-gray-50">
                    <p className="text-[10px] text-[var(--color-cool-gray)] uppercase tracking-wider mb-0.5">
                      Date of Birth
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">
                      {formatDateOnly(worker.dateofbirth)}
                    </p>
                  </div>
                )}
                {worker.gender && (
                  <div className="px-3.5 py-2.5 rounded-xl bg-gray-50">
                    <p className="text-[10px] text-[var(--color-cool-gray)] uppercase tracking-wider mb-0.5">
                      Gender
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)] capitalize">
                      {worker.gender}
                    </p>
                  </div>
                )}
                {worker.createdAt && (
                  <div className="px-3.5 py-2.5 rounded-xl bg-gray-50 col-span-2">
                    <p className="text-[10px] text-[var(--color-cool-gray)] uppercase tracking-wider mb-0.5">
                      Joined
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">
                      {formatDateOnly(worker.createdAt)}{" "}
                      <span className="font-normal text-[var(--color-cool-gray)]">
                        · {timeAgo(worker.createdAt)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (typeof document === "undefined") return null
  return createPortal(modal, document.body)
}
