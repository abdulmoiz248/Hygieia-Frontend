"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp } from "lucide-react"
import { useUserRoleCounts, RoleTrend } from "@/hooks/admin/dashboard/useUserRoleCounts"

// ─── Theme Colors ─────────────────────────────────────────────────────────────
const SOFT_BLUE  = "#5ba8c4"
const MINT_GREEN = "#6ec6b8"
const SOFT_CORAL = "#e8826a"
const VIOLET     = "#9b8fce"

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  patient:       { label: "Patients",      color: SOFT_BLUE  },
  nutritionist:  { label: "Nutritionists", color: MINT_GREEN },
  doctor:        { label: "Doctors",       color: SOFT_CORAL },
  pathologist:   { label: "Pathologists",  color: VIOLET     },
  // backend may use either alias
  "lab-technician":  { label: "Pathologists", color: VIOLET },
  lab_technician:    { label: "Pathologists", color: VIOLET },
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-gray-700 mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-1.5 mb-0.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-500 capitalize">{entry.name}:</span>
          <span className="font-semibold text-gray-700">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build last-6-month labels as short month names (e.g. "Mar").
 * These are used to match against the API's `label` field (e.g. "Mar 2026").
 */
function getLast6MonthLabels(): string[] {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return d.toLocaleString("default", { month: "short" })
  })
}

/**
 * Extract the 6 monthly counts for a role from the API's roleTrends array.
 * Matches on the short month label (first 3 chars of the label field).
 * Falls back to `total` flat-lined if trends are missing.
 */
function extractMonthlyData(trend: RoleTrend, shortLabels: string[]): number[] {
  if (!trend.monthlyTrends?.length) {
    return Array(6).fill(trend.total)
  }
  return shortLabels.map((shortLabel) => {
    const match = trend.monthlyTrends.find((t) =>
      t.label.startsWith(shortLabel)
    )
    return match?.count ?? 0
  })
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminChartsSection() {
  const { data, isLoading } = useUserRoleCounts()

  const shortLabels = getLast6MonthLabels()

  // Deduplicate role trends (e.g. "pathologist" / "lab-technician" both map to Pathologists)
  const seen = new Set<string>()
  const resolvedTrends: Array<{ key: string; label: string; color: string; months: number[]; total: number }> = []

  ;(data?.roleTrends ?? []).forEach((trend) => {
    const cfg = ROLE_CONFIG[trend.role.toLowerCase()]
    if (!cfg) return                    // unknown role — skip
    if (seen.has(cfg.label)) return     // already added under an alias
    seen.add(cfg.label)

    resolvedTrends.push({
      key:    cfg.label,
      label:  cfg.label,
      color:  cfg.color,
      months: extractMonthlyData(trend, shortLabels),
      total:  trend.total,
    })
  })

  // Build chart data array — one object per month
  const chartData = shortLabels.map((month, i) => {
    const entry: Record<string, string | number> = { month }
    resolvedTrends.forEach((rt) => {
      entry[rt.key] = rt.months[i]
    })
    return entry
  })

  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white/60 border border-[var(--color-cool-gray)]/15 rounded-2xl p-6 flex flex-col"
      >
        {/* Header row */}
        <div className="flex flex-wrap items-start gap-4 mb-6">
          <div className="flex items-start gap-3 flex-1 min-w-0">
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
                Registered users by role — last 6 months
              </p>
            </div>
          </div>

          {/* Live total badges */}
          {!isLoading && (
            <div className="flex items-center gap-4 flex-wrap">
              {resolvedTrends.map((rt) => (
                <div key={rt.key} className="text-right">
                  <p
                    className="text-lg font-bold leading-none"
                    style={{ color: rt.color }}
                  >
                    {rt.total}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {rt.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center h-[280px]">
            <div className="w-full h-full bg-gray-100 rounded-xl animate-pulse" />
          </div>
        )}

        {/* Chart */}
        {!isLoading && (
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                barGap={3}
                barCategoryGap="28%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
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
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f8f8f8", radius: 4 }}
                />
                {resolvedTrends.map((rt) => (
                  <Bar
                    key={rt.key}
                    dataKey={rt.key}
                    fill={rt.color}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend */}
        {!isLoading && (
          <div className="flex gap-5 mt-4 flex-wrap">
            {resolvedTrends.map((rt) => (
              <div key={rt.key} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: rt.color }}
                />
                <span className="text-xs text-muted-foreground">{rt.label}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
