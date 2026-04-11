"use client"

import { useState } from "react"
import {
  X, Download, Loader2,
  Stethoscope, Salad, FlaskConical,
  Activity, Bell, CalendarDays, TrendingUp, Lightbulb,
} from "lucide-react"
import { Worker, ROLE_CONFIG } from "@/types/admin/workers"
import type { WorkerReport } from "@/hooks/admin/workers/useWorkerReport"

// ─── Theme tokens — mirrors AdminStatsCards colorClasses palette ──────────────
const C = {
  softBlue:  "oklch(0.55 0.15 210)",  // --color-soft-blue   (Account Age, primary brand)
  mintGreen: "oklch(0.72 0.11 178)",  // --color-mint-green  (Appointments, completion ≥ 80%)
  softCoral: "oklch(0.65 0.25 10)",   // --color-soft-coral  (Notifications, download btn)
  coolGray:  "oklch(0.35 0.05 180)",  // --color-cool-gray   (Completion card)
  snowWhite: "oklch(0.98 0.02 100)",  // --color-snow-white
  error:     "oklch(0.65 0.25 0)",    // completion < 50%
} as const

// ─── Role icons ───────────────────────────────────────────────────────────────
const ROLE_ICONS: Record<string, React.ElementType> = {
  doctor:       Stethoscope,
  nutritionist: Salad,
  pathologist:  FlaskConical,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase()
}

function completionColor(rate: number): string {
  if (rate >= 80) return C.mintGreen
  if (rate >= 50) return C.softCoral
  return C.error
}

/** Translucent tint — matches the /10 and /20 pattern in AdminStatsCards */
function tint(color: string, pct = 10) {
  return `color-mix(in oklch, ${color} ${pct}%, transparent)`
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface WorkerReportModalProps {
  worker: Worker
  report: WorkerReport
  onClose: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorkerReportModal({ worker, report, onClose }: WorkerReportModalProps) {
  const cfg      = ROLE_CONFIG[worker.role]
  const RoleIcon = ROLE_ICONS[worker.role] ?? Stethoscope
  const [loading, setLoading] = useState(false)

  const compRate  = report.metrics.completionRate
  const compColor = completionColor(compRate)

  // Primary brand color — soft-blue, same as doctor card in AdminStatsCards
  const PRIMARY = C.softBlue

  const dateStr = new Date().toLocaleDateString("en-PK", {
    day: "numeric", month: "long", year: "numeric",
  })

  // ── Stat cards — mirrors the 4-color pattern from AdminStatsCards ──────────
  // soft-blue → mint-green → cool-gray → soft-coral (same visual rhythm)
  const stats = [
    {
      label: "Account Age",
      value: String(report.overview.accountAgeDays ?? "-"),
      unit: "days",
      color: C.softBlue,
      icon: CalendarDays,
    },
    {
      label: "Appointments",
      value: String(report.metrics.totalAppointments ?? "-"),
      unit: "total",
      color: C.mintGreen,
      icon: Activity,
    },
    {
      label: "Completion",
      value: `${compRate}%`,
      unit: "rate",
      color: C.coolGray,
      icon: TrendingUp,
    },
    {
      label: "Notifications",
      value: String(report.overview.unreadNotifications ?? "-"),
      unit: "unread",
      color: C.softCoral,
      icon: Bell,
    },
  ]

  const metricRows = [
    { label: "Total Appointments",   value: String(report.metrics.totalAppointments ?? "-"),    accent: false },
    { label: "Completion Rate",      value: `${compRate}%`,                              accent: true  },
    { label: "Account Active For",   value: `${report.overview.accountAgeDays ?? "-"} days`,    accent: false },
    { label: "Unread Notifications", value: String(report.overview.unreadNotifications ?? "-"), accent: false },
  ]

  // ── TXT download ──────────────────────────────────────────────────────────

  const handleDownloadTxt = () => {
    setLoading(true)
    try {
      const sep  = "═".repeat(60)
      const thin = "─".repeat(60)
      const bar  = `[${"█".repeat(Math.round(compRate / 5))}${"░".repeat(20 - Math.round(compRate / 5))}]`

      const lines = [
        sep,
        "  HYGIEIA HEALTH PLATFORM — WORKER PERFORMANCE REPORT",
        "  CONFIDENTIAL · AUTHORIZED ADMINISTRATORS ONLY",
        sep,
        "",
        `  Worker Name : ${worker.name}`,
        `  Role        : ${cfg.label}`,
        `  Email       : ${report.worker.email}`,
        `  Generated   : ${dateStr}`,
        "",
        thin,
        "  PERFORMANCE METRICS",
        thin,
        "",
        `  Total Appointments   : ${report.metrics.totalAppointments ?? "-"}`,
        `  Completion Rate      : ${compRate}%`,
        `  Account Active For   : ${report.overview.accountAgeDays ?? "-"} days`,
        `  Unread Notifications : ${report.overview.unreadNotifications ?? "-"}`,
        "",
        `  Completion  ${bar} ${compRate}%`,
        "",
      ]

      if (report.insights.length > 0) {
        lines.push(thin, "  AI-GENERATED INSIGHTS", thin, "")
        report.insights.forEach((insight, i) => lines.push(`  ${i + 1}. ${insight}`, ""))
      }

      lines.push(sep, "  Hygieia Health Platform · Official Report", `  ${dateStr}`, sep)

      const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement("a")
      a.href     = url
      a.download = `${worker.name.replace(/\s+/g, "_")}_Report_${new Date().toISOString().split("T")[0]}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error("TXT generation failed", e)
    } finally {
      setLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.5)", backdropFilter: "blur(6px)", fontFamily: "inherit" }}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "var(--background)", border: "1px solid var(--border)" }}
      >

        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}
        >
          <span
            className="text-[11px] font-bold tracking-widest uppercase"
            style={{ color: "var(--muted-foreground)" }}
          >
            Worker Performance Report
          </span>

          <div className="flex items-center gap-2">
            {/* Download button — soft-coral, matches AdminStatsCards "Pending CVs" card */}
            <button
              onClick={handleDownloadTxt}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: C.softCoral, color: C.snowWhite }}
            >
              {loading
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating…</>
                : <><Download className="w-3.5 h-3.5" />Download Report</>}
            </button>

            <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-accent">
              <X className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ────────────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1">

          {/* Top accent bar — soft-blue (primary brand) */}
          <div style={{ height: 5, background: PRIMARY }} />

          {/* Header */}
          <div
            className="flex items-start justify-between gap-6 px-8 py-5"
            style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}
          >
            {/* Left: avatar + info */}
            <div className="flex items-start gap-4 min-w-0">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 select-none"
                style={{ background: PRIMARY, color: C.snowWhite }}
              >
                {getInitials(worker.name)}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold leading-tight" style={{ color: "var(--foreground)" }}>
                  {worker.name}
                </h2>
                <div
                  className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold"
                  style={{ background: tint(PRIMARY, 15), color: PRIMARY }}
                >
                  <RoleIcon className="w-3 h-3" />
                  {cfg.label.toUpperCase()}
                </div>
                <p className="mt-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {report.worker.email}
                </p>
              </div>
            </div>

            {/* Right: title + badge */}
            <div className="flex-shrink-0 text-right">
              <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Performance Report</p>
              <div className="my-1.5 h-px" style={{ background: "var(--border)" }} />
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Generated: {dateStr}</p>
              <div
                className="mt-2 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold"
                style={{
                  background: tint(PRIMARY, 12),
                  color: PRIMARY,
                  border: `1px solid ${tint(PRIMARY, 35)}`,
                }}
              >
                ✓ OFFICIAL
              </div>
            </div>
          </div>

          {/* Confidential banner */}
          <div
            className="py-1.5 text-center text-[10px] font-semibold tracking-widest"
            style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
          >
            CONFIDENTIAL · HYGIEIA HEALTH PLATFORM · AUTHORIZED ADMINISTRATORS ONLY
          </div>

          <div className="px-8 py-6 space-y-7">

            {/* ── STAT CARDS — 4 colors matching AdminStatsCards rhythm ─────── */}
            <div className="grid grid-cols-4 gap-3">
              {stats.map(({ label, value, unit, color, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl overflow-hidden flex flex-col"
                  style={{
                    // Mirrors AdminStatsCards: bg-gradient-to-br from-{color}/10 to-{color}/5 border-{color}/20
                    background: `linear-gradient(to bottom right, ${tint(color, 10)}, ${tint(color, 5)})`,
                    border: `1px solid ${tint(color, 20)}`,
                  }}
                >
                  {/* Top accent strip */}
                  <div style={{ height: 3, background: color }} />

                  <div className="flex flex-col px-3 pt-2.5 pb-3 gap-1.5">
                    {/* Label + icon row */}
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wide leading-none truncate"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {label}
                      </span>
                      {/* Icon — same placement as AdminStatsCards */}
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                    </div>

                    {/* Value */}
                    <p
                      className="text-[22px] font-bold leading-none tabular-nums"
                      style={{ color }}
                    >
                      {value}
                    </p>

                    {/* Unit — light weight, subdued */}
                    <p
                      className="text-[10px] font-normal"
                      style={{ color: "var(--muted-foreground)", opacity: 0.65 }}
                    >
                      {unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── PERFORMANCE METRICS ───────────────────────────────────────── */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: PRIMARY }} />
                <span
                  className="text-[11px] font-bold tracking-widest uppercase"
                  style={{ color: "var(--foreground)" }}
                >
                  Performance Metrics
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <div
                  className="flex items-center justify-between px-5 py-2.5"
                  style={{ background: PRIMARY }}
                >
                  <span className="text-[10px] font-bold tracking-wider" style={{ color: C.snowWhite }}>METRIC</span>
                  <span className="text-[10px] font-bold tracking-wider" style={{ color: C.snowWhite }}>VALUE</span>
                </div>
                {metricRows.map(({ label, value, accent }, i) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-5 py-3"
                    style={{
                      background: i % 2 === 0 ? "var(--muted)" : "var(--card)",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{label}</span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: accent ? compColor : "var(--foreground)" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar — color reflects completion level */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Completion Rate</span>
                  <span className="text-xs font-bold" style={{ color: compColor }}>{compRate}%</span>
                </div>
                <div
                  className="h-2.5 w-full rounded-full overflow-hidden"
                  style={{ background: tint(compColor, 15) }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(compRate, 100)}%`, background: compColor }}
                  />
                </div>
                <div className="flex justify-between text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>
            </div>

            {/* ── AI INSIGHTS ───────────────────────────────────────────────── */}
            {report.insights.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: C.mintGreen }} />
                  <Lightbulb className="w-3.5 h-3.5" style={{ color: C.mintGreen }} />
                  <span
                    className="text-[11px] font-bold tracking-widest uppercase"
                    style={{ color: "var(--foreground)" }}
                  >
                    AI-Generated Insights
                  </span>
                  <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                </div>
                <div className="space-y-3">
                  {report.insights.map((insight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl px-4 py-3.5"
                      style={{
                        background: tint(C.mintGreen, 8),
                        border: `1px solid ${tint(C.mintGreen, 20)}`,
                        borderLeft: `4px solid ${C.mintGreen}`,
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                        style={{ background: C.mintGreen, color: C.snowWhite }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── FOOTER ────────────────────────────────────────────────────── */}
            <div
              className="flex items-start justify-between pt-4"
              style={{ borderTop: `3px solid ${PRIMARY}` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-1 self-stretch rounded-full" style={{ background: PRIMARY }} />
                <div>
                  <p className="text-[13px] font-bold" style={{ color: "var(--foreground)" }}>
                    Hygieia Health Platform
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    Confidential · For authorized administrators only
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{dateStr}</p>
                <p className="text-[10px] font-bold mt-0.5" style={{ color: PRIMARY }}>OFFICIAL REPORT</p>
              </div>
            </div>

          </div>

          {/* Bottom accent bar */}
          <div style={{ height: 5, background: PRIMARY }} />

        </div>
      </div>
    </div>
  )
}
