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

// ─── Mock Data ────────────────────────────────────────────────────────────────

const userGrowthData = [
  { month: "Jul", patients: 12, nutritionists: 2, pathologists: 1 },
  { month: "Aug", patients: 19, nutritionists: 3, pathologists: 2 },
  { month: "Sep", patients: 25, nutritionists: 3, pathologists: 2 },
  { month: "Oct", patients: 34, nutritionists: 4, pathologists: 3 },
  { month: "Nov", patients: 48, nutritionists: 5, pathologists: 3 },
  { month: "Dec", patients: 61, nutritionists: 6, pathologists: 4 },
]

const weeklyActivityData = [
  { day: "Mon", tests: 4, consultations: 6, reports: 3 },
  { day: "Tue", tests: 7, consultations: 9, reports: 5 },
  { day: "Wed", tests: 5, consultations: 7, reports: 4 },
  { day: "Thu", tests: 8, consultations: 11, reports: 7 },
  { day: "Fri", tests: 6, consultations: 8, reports: 5 },
  { day: "Sat", tests: 2, consultations: 3, reports: 2 },
  { day: "Sun", tests: 1, consultations: 2, reports: 1 },
]

// ─── Theme Colors ─────────────────────────────────────────────────────────────
const SOFT_BLUE  = "#5ba8c4"
const MINT_GREEN = "#6ec6b8"
const SOFT_CORAL = "#e8826a"

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-500 capitalize">{entry.name}:</span>
          <span className="font-medium text-gray-700">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminChartsSection() {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
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
            <h3 className="text-lg font-semibold text-gray-800 leading-tight">User Growth</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Monthly acquisition across all roles</p>
          </div>
        </div>

        <div className="flex-1">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={userGrowthData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="gradPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={SOFT_BLUE}  stopOpacity={0.25} />
                  <stop offset="95%" stopColor={SOFT_BLUE}  stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gradNutr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={MINT_GREEN} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={MINT_GREEN} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
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
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4 mt-3">
          {[
            { label: "Patients",      color: SOFT_BLUE  },
            { label: "Nutritionists", color: MINT_GREEN },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
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
            <h3 className="text-lg font-semibold text-gray-800 leading-tight">Weekly Platform Activity</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Tests, consultations & reports by day</p>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f5f5", radius: 4 }} />
              <Bar dataKey="tests"         fill={SOFT_BLUE}  radius={[4, 4, 0, 0]} />
              <Bar dataKey="consultations" fill={MINT_GREEN} radius={[4, 4, 0, 0]} />
              <Bar dataKey="reports"       fill={SOFT_CORAL} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4 mt-3 flex-wrap">
          {[
            { label: "Tests",         color: SOFT_BLUE  },
            { label: "Consultations", color: MINT_GREEN },
            { label: "Reports",       color: SOFT_CORAL },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}