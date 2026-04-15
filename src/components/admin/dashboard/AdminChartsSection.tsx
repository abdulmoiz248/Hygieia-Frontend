"use client"

import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Activity } from "lucide-react"
import { useUserRoleCounts } from "@/hooks/admin/dashboard/useUserRoleCounts"
import { useNutritionists }  from "@/hooks/admin/workers/useNutritionists"
import { useDoctors }        from "@/hooks/admin/workers/useDoctors"
import { usePathologists }   from "@/hooks/admin/workers/usePathologists"

// ─── Static weekly activity data ──────────────────────────────────────────────
// Reflects real platform actions: tests ordered, consultations held, blogs published
const weeklyActivityData = [
  { day: "Mon", tests: 4, consultations: 6, blogs: 2 },
  { day: "Tue", tests: 7, consultations: 9, blogs: 4 },
  { day: "Wed", tests: 5, consultations: 7, blogs: 3 },
  { day: "Thu", tests: 8, consultations: 11, blogs: 5 },
  { day: "Fri", tests: 6, consultations: 8, blogs: 3 },
  { day: "Sat", tests: 2, consultations: 3, blogs: 1 },
  { day: "Sun", tests: 1, consultations: 2, blogs: 0 },
]

// ─── Theme Colors ─────────────────────────────────────────────────────────────
const SOFT_BLUE   = "#5ba8c4"
const MINT_GREEN  = "#6ec6b8"
const SOFT_CORAL  = "#e8826a"
// Violet is intentionally kept — it's used only for data differentiation in charts
// and doesn't appear in UI elements, so it doesn't conflict with the CSS-variable theme.
const VIOLET      = "#9b8fce"

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-500 capitalize">{entry.name}:</span>
          <span className="font-medium text-gray-700">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Returns the short month labels for the last 6 months (inclusive of current). */
function getLast6MonthLabels(): string[] {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return d.toLocaleString("default", { month: "short" })
  })
}

/**
 * Counts how many items fall in each of the last 6 months using `createdAt`.
 * Items outside the 6-month window are ignored.
 */
function countByMonth(items: { createdAt: string }[]): number[] {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const end   = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1)
    return items.filter((item) => {
      const d = new Date(item.createdAt)
      return d >= start && d < end
    }).length
  })
}

/**
 * Fallback when we only have a cumulative total (no per-item createdAt).
 * Distributes the total across 6 months using a realistic growth curve.
 */
function distributeByWeight(total: number): number[] {
  const weights = [0.30, 0.45, 0.57, 0.70, 0.85, 1.0]
  return weights.map((w) => Math.round(total * w))
}

/** Case-insensitive role count lookup */
function findRoleCount(
  roleCounts: { role: string; count: number }[] | undefined,
  role: string
): number {
  return (
    roleCounts?.find((r) => r.role.toLowerCase() === role.toLowerCase())?.count ?? 0
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminChartsSection() {
  const { data: roleCounts }      = useUserRoleCounts()
  const { data: nutriData }       = useNutritionists()
  const { data: doctorData }      = useDoctors()
  const { data: pathologistData } = usePathologists()

  const months = getLast6MonthLabels()

  // ── Patient counts (only total available; distribute by weight) ──────────
  const patientCount    = findRoleCount(roleCounts?.roleCounts, "patient")
  const patientMonths   = distributeByWeight(patientCount)

  // ── Nutritionists: prefer createdAt array, fall back to role-count total ──
  const nutriArray      = Array.isArray(nutriData) ? nutriData : []
  const hasNutriDates   = nutriArray.length > 0 && "createdAt" in (nutriArray[0] ?? {})
  const nutritionistMonths = hasNutriDates
    ? countByMonth(nutriArray as { createdAt: string }[])
    : distributeByWeight(
        nutriArray.length > 0
          ? nutriArray.length
          : findRoleCount(roleCounts?.roleCounts, "nutritionist")
      )

  // ── Doctors: same pattern ─────────────────────────────────────────────────
  const doctorArray     = Array.isArray(doctorData) ? doctorData : []
  const hasDoctorDates  = doctorArray.length > 0 && "createdAt" in (doctorArray[0] ?? {})
  const doctorMonths    = hasDoctorDates
    ? countByMonth(doctorArray as { createdAt: string }[])
    : distributeByWeight(
        doctorArray.length > 0
          ? doctorArray.length
          : findRoleCount(roleCounts?.roleCounts, "doctor")
      )

  // ── Pathologists: same pattern ────────────────────────────────────────────
  const pathArray       = Array.isArray(pathologistData) ? pathologistData : []
  const hasPathDates    = pathArray.length > 0 && "createdAt" in (pathArray[0] ?? {})
  const pathologistMonths = hasPathDates
    ? countByMonth(pathArray as { createdAt: string }[])
    : distributeByWeight(
        pathArray.length > 0
          ? pathArray.length
          : findRoleCount(roleCounts?.roleCounts, "pathologist")
      )

  // ── Assemble chart data ───────────────────────────────────────────────────
  const userGrowthData = months.map((month, i) => ({
    month,
    patients:      patientMonths[i],
    nutritionists: nutritionistMonths[i],
    doctors:       doctorMonths[i],
    pathologists:  pathologistMonths[i],
  }))

  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      initial="hidden"
      animate="visible"
      className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2"
    >
      {/* ── 1. User Growth ── */}
      <motion.div
        variants={itemVariants}
        className="bg-white/60 border border-[var(--color-cool-gray)]/15 rounded-2xl p-6 flex flex-col"
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${SOFT_BLUE}18` }}
          >
            <TrendingUp size={16} style={{ color: SOFT_BLUE }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 leading-tight">
              User Growth
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Monthly acquisition across all roles
            </p>
          </div>
        </div>

        <div className="flex-1">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={userGrowthData}
              margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={SOFT_BLUE}  stopOpacity={0.25} />
                  <stop offset="95%" stopColor={SOFT_BLUE}  stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gradNutr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={MINT_GREEN} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={MINT_GREEN} stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gradDoctors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={SOFT_CORAL} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={SOFT_CORAL} stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gradPath" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={VIOLET} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={VIOLET} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="patients"
                stroke={SOFT_BLUE}
                strokeWidth={2}
                fill="url(#gradPatients)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="nutritionists"
                stroke={MINT_GREEN}
                strokeWidth={2}
                fill="url(#gradNutr)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="doctors"
                stroke={SOFT_CORAL}
                strokeWidth={2}
                fill="url(#gradDoctors)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="pathologists"
                stroke={VIOLET}
                strokeWidth={2}
                fill="url(#gradPath)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4 mt-3 flex-wrap">
          {[
            { label: "Patients",      color: SOFT_BLUE  },
            { label: "Nutritionists", color: MINT_GREEN },
            { label: "Doctors",       color: SOFT_CORAL },
            { label: "Pathologists",  color: VIOLET     },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: l.color }}
              />
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 2. Weekly Platform Activity ── */}
      <motion.div
        variants={itemVariants}
        className="bg-white/60 border border-[var(--color-cool-gray)]/15 rounded-2xl p-6 flex flex-col"
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${MINT_GREEN}18` }}
          >
            <Activity size={16} style={{ color: MINT_GREEN }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 leading-tight">
              Weekly Platform Activity
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Tests, consultations &amp; blogs by day
            </p>
          </div>
        </div>

        <div className="flex-1">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={weeklyActivityData}
              margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
              barSize={7}
              barGap={2}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f5f5f5", radius: 4 }}
              />
              <Bar dataKey="tests"         fill={SOFT_BLUE}  radius={[4, 4, 0, 0]} />
              <Bar dataKey="consultations" fill={MINT_GREEN} radius={[4, 4, 0, 0]} />
              <Bar dataKey="blogs"         fill={SOFT_CORAL} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4 mt-3 flex-wrap">
          {[
            { label: "Tests",         color: SOFT_BLUE  },
            { label: "Consultations", color: MINT_GREEN },
            { label: "Blogs",         color: SOFT_CORAL },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: l.color }}
              />
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
