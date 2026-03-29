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
} from "lucide-react"

import { STATUS_CONFIG, ROLE_COLORS, ROLE_LABELS } from "@/types/admin/cv.config"
import { timeAgo, getInitials, StatusBadge } from "@/helpers/cv"
import type { CV, CVStatus } from "@/types/admin/cv"

interface CVCardProps {
  cv: CV
  onDelete: (id: string) => void
  onAddAsWorker: (cv: CV) => void
  onStatusChange: (id: string, status: CVStatus) => void
  onPreview: (cvLink: string, name: string) => void
}

export default function CVCard({
  cv,
  onDelete,
  onAddAsWorker,
  onStatusChange,
  onPreview,
}: CVCardProps) {
  const [expanded, setExpanded] = useState(false)

  const color = ROLE_COLORS[cv.role]
  const initials = getInitials(cv.fullName)

  // ✅ Download handler (works with external URLs)
  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
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
    <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">

      {/* Role color stripe */}
      <div
        className="h-1.5 w-full flex-shrink-0"
        style={{
          background: `linear-gradient(90deg, ${color}, oklch(0.72 0.11 178))`,
        }}
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
                <p
                  className="text-xs mt-0.5 font-medium capitalize"
                  style={{ color }}
                >
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
            style={{
              background: "oklch(0.96 0.06 10)",
              color: "var(--color-soft-coral)",
            }}
          >
            <FileText className="w-3 h-3" /> PDF
          </span>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-1.5 mt-3 text-xs text-[var(--color-cool-gray)]">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{cv.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{cv.phone}</span>
          </div>
        </div>

        {/* Expandable: status change */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-[var(--color-dark-slate-gray)] mb-2">
              Update Status
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(STATUS_CONFIG) as CVStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(cv.id, s)}
                  className="text-[11px] px-2.5 py-1 rounded-full font-semibold border-2 transition-all"
                  style={
                    cv.status === s
                      ? {
                          background: STATUS_CONFIG[s].lightBg,
                          color: STATUS_CONFIG[s].color,
                          borderColor: STATUS_CONFIG[s].color,
                        }
                      : {
                          background: "white",
                          color: "var(--color-cool-gray)",
                          borderColor: "oklch(0.90 0.02 180)",
                        }
                  }
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color }}
          >
            {expanded ? "Less" : "More options"}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="flex items-center gap-1">
            {/* Preview */}
            <button
              title="Preview CV"
              onClick={() => onPreview(cv.cvLink, cv.fullName)}
              className="p-2 rounded-lg transition-colors text-[var(--color-soft-blue)]"
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "oklch(0.95 0.05 210)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Download */}
            <button
              title="Download CV"
              onClick={() => handleDownload(cv.cvLink, cv.fullName)}
              className="p-2 rounded-lg transition-colors text-[var(--color-cool-gray)]"
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "oklch(0.93 0.02 180)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Register */}
            <button
              title="Add as Worker"
              onClick={() => onAddAsWorker(cv)}
              className="p-2 rounded-lg transition-colors text-[var(--color-mint-green)]"
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "oklch(0.95 0.04 178)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <UserPlus className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              title="Delete CV"
              onClick={() => onDelete(cv.id)}
              className="p-2 rounded-lg transition-colors text-[var(--color-soft-coral)]"
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "oklch(0.96 0.06 10)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}