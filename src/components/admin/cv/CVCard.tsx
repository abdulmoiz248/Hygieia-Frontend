import { useState } from "react"
import {
  FileText,
  Trash2,
  UserPlus,
  ChevronDown,
  Eye,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  Download,
  ClipboardEdit,
  Loader2,
} from "lucide-react"

import { STATUS_CONFIG, ROLE_COLORS, ROLE_LABELS } from "@/types/admin/cv.config"
import { timeAgo, getInitials, StatusBadge } from "@/helpers/cv"
import type { CV, CVStatus } from "@/types/admin/cv"

interface CVCardProps {
  cv:               CV
  isUpdatingStatus: boolean
  onDelete:         (id: string) => void
  onAddAsWorker:    (cv: CV) => void
  onStatusChange:   (id: string, status: CVStatus) => void
  onPreview:        (cvLink: string, name: string) => void
}

export default function CVCard({
  cv,
  isUpdatingStatus,
  onDelete,
  onAddAsWorker,
  onStatusChange,
  onPreview,
}: CVCardProps) {
  const [expanded, setExpanded] = useState(false)

  const color    = ROLE_COLORS[cv.role]
  const initials = getInitials(cv.fullName)

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url)
      const blob     = await response.blob()
      const blobUrl  = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href     = blobUrl
      link.download = `${name}-CV.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">

      {/* Role color stripe */}
      <div
        className="h-1.5 w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg, ${color}, oklch(0.72 0.11 178))` }}
      />

      <div className="p-5 flex flex-col flex-1">

        {/* Top: Avatar + Name + Status */}
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: color }}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--color-dark-slate-gray)] text-sm leading-tight truncate">
                  {cv.fullName}
                </h3>
                <p className="text-xs mt-0.5 font-medium capitalize" style={{ color }}>
                  {ROLE_LABELS[cv.role]}
                  {cv.doctorField ? ` · ${cv.doctorField}` : ""}
                </p>
              </div>
              <StatusBadge status={cv.status} />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium flex items-center gap-1">
            <Briefcase className="w-3 h-3" /> {cv.experience} yrs exp
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {timeAgo(cv.created_at)}
          </span>
          <span
            className="text-[11px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"
            style={{ background: "oklch(0.96 0.06 10)", color: "var(--color-soft-coral)" }}
          >
            <FileText className="w-3 h-3" /> PDF
          </span>
        </div>

        {/* Contact — FIX: bold text + colored icons like WorkerCard */}
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex items-center gap-2.5 px-1">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
            <span className="text-xs text-[var(--color-dark-slate-gray)] truncate font-semibold">
              {cv.email}
            </span>
          </div>
          <div className="flex items-center gap-2.5 px-1">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#10B981" }} />
            <span className="text-xs text-[var(--color-dark-slate-gray)] font-semibold">
              {cv.phone}
            </span>
          </div>
        </div>

        {/* Expandable: status change */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-[var(--color-dark-slate-gray)]">
                Update Status
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(STATUS_CONFIG) as CVStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(cv.id, s)}
                  disabled={isUpdatingStatus || cv.status === s}
                  className="text-[11px] px-2.5 py-1 rounded-full font-semibold border-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1 hover:opacity-80 active:scale-95"
                  style={
                    cv.status === s
                      ? {
                          background:   STATUS_CONFIG[s].lightBg,
                          color:        STATUS_CONFIG[s].color,
                          borderColor:  STATUS_CONFIG[s].color,
                        }
                      : {
                          background:  "white",
                          color:       "var(--color-cool-gray)",
                          borderColor: "oklch(0.90 0.02 180)",
                        }
                  }
                >
                  {isUpdatingStatus && cv.status !== s ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : null}
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spacer pushes actions to bottom */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">

          {/* "Update Status" toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:opacity-80 active:scale-95"
            style={{ color, background: expanded ? `${color}15` : "transparent" }}
          >
            {expanded ? (
              <>
                Close
                <ChevronDown className="w-3.5 h-3.5 rotate-180 transition-transform duration-200" />
              </>
            ) : (
              <>
                <ClipboardEdit className="w-3.5 h-3.5" />
                Update Status
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
              </>
            )}
          </button>

          <div className="flex items-center gap-0.5">

            {/* Preview */}
            <button
              title="Preview CV"
              onClick={() => onPreview(cv.cvLink, cv.fullName)}
              className="p-2 rounded-lg transition-all duration-200 text-[var(--color-soft-blue)] hover:bg-[oklch(0.95_0.05_210)] hover:scale-110 active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Download */}
            <button
              title="Download CV"
              onClick={() => handleDownload(cv.cvLink, cv.fullName)}
              className="p-2 rounded-lg transition-all duration-200 text-[var(--color-cool-gray)] hover:bg-[oklch(0.93_0.02_180)] hover:text-[var(--color-dark-slate-gray)] hover:scale-110 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Register as worker */}
            <button
              title="Add as Worker"
              onClick={() => onAddAsWorker(cv)}
              className="p-2 rounded-lg transition-all duration-200 text-[var(--color-mint-green)] hover:bg-[oklch(0.95_0.04_178)] hover:scale-110 active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              title="Delete CV"
              onClick={() => onDelete(cv.id)}
              className="p-2 rounded-lg transition-all duration-200 text-[var(--color-soft-coral)] hover:bg-[oklch(0.96_0.06_10)] hover:scale-110 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
