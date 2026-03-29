import type { CVStatus } from "@/types/admin/cv"
import { STATUS_CONFIG } from "@/types/admin/cv.config"

export function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  return `${days} days ago`
}

export function getInitials(fullName: string): string {
  return fullName.split(" ").map(w => w[0]).slice(0, 2).join("")
}

export function StatusBadge({ status }: { status: CVStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="text-[11px] px-2.5 py-1 rounded-full font-semibold whitespace-nowrap"
      style={{ background: cfg.lightBg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}
