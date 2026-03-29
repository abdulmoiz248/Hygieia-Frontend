import { Inbox, Eye, Star, Ban } from "lucide-react"
import type { CVStatus, FilterRole, SortKey, AppliedRole } from "./cv"

export const STATUS_CONFIG: Record<CVStatus, {
  label: string
  icon: React.ElementType
  color: string
  colorClass: string
  gradient: string
  lightBg: string
}> = {
  new:         { label: "New",         icon: Inbox, color: "var(--color-soft-blue)",  colorClass: "soft-blue",  gradient: "linear-gradient(135deg, var(--color-soft-blue), oklch(0.45 0.18 230))",   lightBg: "oklch(0.95 0.05 210)" },
  reviewed:    { label: "Reviewed",    icon: Eye,   color: "var(--color-cool-gray)",  colorClass: "cool-gray",  gradient: "linear-gradient(135deg, var(--color-cool-gray), oklch(0.45 0.04 200))",   lightBg: "oklch(0.93 0.02 180)" },
  shortlisted: { label: "Shortlisted", icon: Star,  color: "var(--color-mint-green)", colorClass: "mint-green", gradient: "linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))",  lightBg: "oklch(0.95 0.04 178)" },
  rejected:    { label: "Rejected",    icon: Ban,   color: "var(--color-soft-coral)", colorClass: "soft-coral", gradient: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))",   lightBg: "oklch(0.96 0.06 10)"  },
}

export const ROLE_COLORS: Record<AppliedRole, string> = {
  doctor:       "var(--color-soft-blue)",
  nutritionist: "var(--color-mint-green)",
  pathologist:  "var(--color-soft-coral)",
}

export const ROLE_LABELS: Record<FilterRole, string> = {
  all: "All", doctor: "Doctor", nutritionist: "Nutritionist", pathologist: "Pathologist",
}

export const FILTER_TABS: { label: string; value: FilterRole }[] = [
  { label: "All",            value: "all"          },
  { label: "Doctors",        value: "doctor"        },
  { label: "Nutritionists",  value: "nutritionist"  },
  { label: "Pathologists",   value: "pathologist"   },
]

export const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Newest first", value: "date"       },
  { label: "Name A–Z",     value: "name"       },
  { label: "Experience",   value: "experience" },
]

export const STATUS_ORDER: Record<CVStatus, number> = {
  new: 0, reviewed: 1, shortlisted: 2, rejected: 3,
}
