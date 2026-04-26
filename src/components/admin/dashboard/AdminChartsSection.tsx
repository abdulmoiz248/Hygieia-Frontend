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
import { useUserRoleCounts } from "@/hooks/admin/dashboard/useUserRoleCounts"
import { useNutritionists }  from "@/hooks/admin/workers/useNutritionists"
import { useDoctors }        from "@/hooks/admin/workers/useDoctors"
import { usePathologists }   from "@/hooks/admin/workers/usePathologists"

// ─── Theme Colors ─────────────────────────────────────────────────────────────
const SOFT_BLUE  = "#5ba8c4"
const MINT_GREEN = "#6ec6b8"
const SOFT_CORAL = "#e8826a"
const VIOLET     = "#9b8fce"

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-gray-700 mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
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

function getLast6MonthLabels(): string[] {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return d.toLocaleString("default", { month: "short" })
  })
}

/**
 * CUMULATIVE count: how many items existed by the END of each month.
 * Workers registered before the 6-month window still appear correctly
 * instead of showing 0 in every month.
 */
function cumulativeByMonth(items: { createdAt: string }[]): number[] {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const end = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1)
    return items.filter((item) => new Date(item.createdAt) < end).length
  })
}

/**
 * Fallback: flat line at the real total — honest, not fabricated growth.
 */
function flatTotal(total: number): number[] {
  return Array(6).fill(total)
}

/**
 * Role count lookup — tries multiple aliases.
 * Fixes: "pathologist" vs "lab-technician" mismatch.
 */
function findRoleCount(
  roleCounts: { role: string; count: number }[] | undefined,
  ...aliases: string[]
): number {
  if (!roleCounts) return 0
  for (const alias of aliases) {
    const found = roleCounts.find((r) => r.role.toLowerCase() === alias.toLowerCase())
    if (found) return found.count
  }
  return 0
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminChartsSection() {
  const { data: roleCounts }      = useUserRoleCounts()
  const { data: nutriData }       = useNutritionists()
  const { data: doctorData }      = useDoctors()
  const { data: pathologistData } = usePathologists()

  const months = getLast6MonthLabels()

  // ── Patients ──────────────────────────────────────────────────────────────
  const patientTotal  = findRoleCount(roleCounts?.roleCounts, "patient")
  const patientMonths = flatTotal(patientTotal)

  // ── Nutritionists ─────────────────────────────────────────────────────────
  const nutriArray         = Array.isArray(nutriData) ? nutriData : []
  const hasNutriDates      = nutriArray.length > 0 && "createdAt" in (nutriArray[0] ?? {})
  const nutritionistMonths = hasNutriDates
    ? cumulativeByMonth(nutriArray as { createdAt: string }[])
    : flatTotal(
        nutriArray.length > 0
          ? nutriArray.length
          : findRoleCount(roleCounts?.roleCounts, "nutritionist")
      )
  const nutritionistTotal = nutritionistMonths[5]

  // ── Doctors ───────────────────────────────────────────────────────────────
  const doctorArray    = Array.isArray(doctorData) ? doctorData : []
  const hasDoctorDates = doctorArray.length > 0 && "createdAt" in (doctorArray[0] ?? {})
  const doctorMonths   = hasDoctorDates
    ? cumulativeByMonth(doctorArray as { createdAt: string }[])
    : flatTotal(
        doctorArray.length > 0
          ? doctorArray.length
          : findRoleCount(roleCounts?.roleCounts, "doctor")
      )
  const doctorTotal = doctorMonths[5]

  // ── Pathologists — tries "pathologist", "lab-technician", "lab_technician" ─
  const pathArray         = Array.isArray(pathologistData) ? pathologistData : []
  const hasPathDates      = pathArray.length > 0 && "createdAt" in (pathArray[0] ?? {})
  const pathologistMonths = hasPathDates
    ? cumulativeByMonth(pathArray as { createdAt: string }[])
    : flatTotal(
        pathArray.length > 0
          ? pathArray.length
          : findRoleCount(roleCounts?.roleCounts, "pathologist", "lab-technician", "lab_technician")
      )
  const pathologistTotal = pathologistMonths[5]

  // ── Chart data ────────────────────────────────────────────────────────────
  const chartData = months.map((month, i) => ({
    month,
    Patients:      patientMonths[i],
    Nutritionists: nutritionistMonths[i],
    Doctors:       doctorMonths[i],
    Pathologists:  pathologistMonths[i],
  }))

  const totals = [
    { label: "Patients",      value: patientTotal,      color: SOFT_BLUE  },
    { label: "Nutritionists", value: nutritionistTotal, color: MINT_GREEN },
    { label: "Doctors",       value: doctorTotal,       color: SOFT_CORAL },
    { label: "Pathologists",  value: pathologistTotal,  color: VIOLET     },
  ]

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
              <h3 className="text-lg font-semibold text-gray-800 leading-tight">User Growth</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Cumulative registered users by role — last 6 months
              </p>
            </div>
          </div>

          {/* Live total badges */}
          <div className="flex items-center gap-4 flex-wrap">
            {totals.map((s) => (
              <div key={s.label} className="text-right">
                <p className="text-lg font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              barGap={3}
              barCategoryGap="28%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
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
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8f8f8", radius: 4 }} />
              <Bar dataKey="Patients"      fill={SOFT_BLUE}  radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Nutritionists" fill={MINT_GREEN} radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Doctors"       fill={SOFT_CORAL} radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Pathologists"  fill={VIOLET}     radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex gap-5 mt-4 flex-wrap">
          {totals.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: l.color }} />
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
