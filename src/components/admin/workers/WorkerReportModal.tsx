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
  softBlue:  "oklch(0.55 0.15 210)",
  mintGreen: "oklch(0.72 0.11 178)",
  softCoral: "oklch(0.65 0.25 10)",
  coolGray:  "oklch(0.35 0.05 180)",
  snowWhite: "oklch(0.98 0.02 100)",
  error:     "oklch(0.65 0.25 0)",
} as const

const ROLE_ICONS: Record<string, React.ElementType> = {
  doctor:       Stethoscope,
  nutritionist: Salad,
  pathologist:  FlaskConical,
}

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase()
}

function completionColor(rate: number): string {
  if (rate >= 80) return C.mintGreen
  if (rate >= 50) return C.softCoral
  return C.error
}

function tint(color: string, pct = 10) {
  return `color-mix(in oklch, ${color} ${pct}%, transparent)`
}

interface WorkerReportModalProps {
  worker: Worker
  report: WorkerReport
  onClose: () => void
}

export default function WorkerReportModal({ worker, report, onClose }: WorkerReportModalProps) {
  const cfg      = ROLE_CONFIG[worker.role]
  const RoleIcon = ROLE_ICONS[worker.role] ?? Stethoscope
  const [loading, setLoading] = useState(false)

  const compRate  = report.metrics.completionRate
  const compColor = completionColor(compRate)
  const PRIMARY   = C.softBlue

  const dateStr = new Date().toLocaleDateString("en-PK", {
    day: "numeric", month: "long", year: "numeric",
  })

  const stats = [
    { label: "Account Age",   value: String(report.overview.accountAgeDays ?? "-"),        unit: "days",   color: C.softBlue,  icon: CalendarDays },
    { label: "Appointments",  value: String(report.metrics.totalAppointments ?? "-"),       unit: "total",  color: C.mintGreen, icon: Activity     },
    { label: "Completion",    value: `${compRate}%`,                                        unit: "rate",   color: C.coolGray,  icon: TrendingUp   },
    { label: "Notifications", value: String(report.overview.unreadNotifications ?? "-"),    unit: "unread", color: C.softCoral, icon: Bell         },
  ]

  const metricRows = [
    { label: "Total Appointments",   value: String(report.metrics.totalAppointments ?? "-"),    accent: false },
    { label: "Completion Rate",      value: `${compRate}%`,                              accent: true  },
    { label: "Account Active For",   value: `${report.overview.accountAgeDays ?? "-"} days`,    accent: false },
    { label: "Unread Notifications", value: String(report.overview.unreadNotifications ?? "-"), accent: false },
  ]

  // ── PDF download — mirrors appointment schedule PDF pattern ──────────────

  const handleDownloadPdf = async () => {
    setLoading(true)
    try {
      const { default: jsPDF } = await import("jspdf")
      const autoTable = (await import("jspdf-autotable")).default

      const doc    = new jsPDF({ unit: "pt", format: "a4" })
      const jsDoc  = doc as any
      const pageWidth  = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      const primaryColor: [number, number, number] = [0, 131, 150]
      const grayText:    [number, number, number] = [60, 60, 60]
      const M = { left: 48, right: 48, top: 160, bottom: 72 }
      const headerHeight = 120

      // ── Helpers ──────────────────────────────────────────────────────────

      const getBase64FromUrl = async (url: string): Promise<string> => {
        const res  = await fetch(url)
        const blob = await res.blob()
        return new Promise((resolve, reject) => {
          const reader    = new FileReader()
          reader.onload  = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }

      const createWatermarkDataUrl = async (
        url: string, opacity: number, width: number, height: number
      ): Promise<string> => {
        const img = new Image()
        img.src   = url
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej })
        const canvas = document.createElement("canvas")
        canvas.width  = width
        canvas.height = height
        const ctx = canvas.getContext("2d")!
        ctx.globalAlpha = opacity
        ctx.drawImage(img, 0, 0, width, height)
        return canvas.toDataURL("image/png")
      }

      let logoDataUrl:      string | null = null
      let watermarkDataUrl: string | null = null
      try {
        logoDataUrl      = await getBase64FromUrl("/logo/logo.png")
        watermarkDataUrl = await createWatermarkDataUrl("/logo/logo.png", 0.05, pageWidth * 0.5, pageHeight * 0.5)
      } catch {}

      const now     = new Date()
      const nowDate = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      const nowTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

      const hospitalName    = "Hygieia"
      const hospitalTagline = "From Past to Future of Healthcare"
      const hospitalAddress = "www.hygieia-frontend.vercel.app"
      const hospitalContact = "+92 80 1234 5678 • hygieia.fyp@gmail.com"

      // ── Per-page chrome ──────────────────────────────────────────────────

      const drawHeader = (doc: any) => {
        if (logoDataUrl) doc.addImage(logoDataUrl, "PNG", M.left, 44, 56, 56)
        doc.setTextColor(...primaryColor)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(16)
        doc.text(hospitalName, M.left + 70, 60)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        doc.setTextColor(...grayText)
        doc.text(hospitalTagline, M.left + 70, 78)
        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(hospitalAddress, M.left + 70, 94)
        doc.text(hospitalContact, M.left + 70, 108)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(18)
        doc.setTextColor(...primaryColor)
        doc.text("Worker Performance Report", pageWidth - M.right, 64, { align: "right" })
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Generated: ${nowDate} • ${nowTime}`, pageWidth - M.right, 80, { align: "right" })
        doc.setDrawColor(...primaryColor)
        doc.setLineWidth(2)
        doc.line(M.left, headerHeight, pageWidth - M.right, headerHeight)
      }

      const drawFooter = (doc: any, pageNumber: number, pageCount: number) => {
        doc.setDrawColor(...primaryColor)
        doc.setLineWidth(2)
        doc.line(M.left, pageHeight - M.bottom, pageWidth - M.right, pageHeight - M.bottom)
        const disclaimer =
          "This document is computer-generated and may contain confidential information. " +
          "For authorized administrators only. If you are not the intended recipient, please delete it."
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(110, 110, 110)
        const wrapped = doc.splitTextToSize(disclaimer, pageWidth - M.left - M.right - 140)
        doc.text(wrapped, M.left, pageHeight - M.bottom + 18)
        doc.setFontSize(9)
        doc.text(`Page ${pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 16, { align: "center" })
      }

      const drawWatermark = (doc: any) => {
        if (!watermarkDataUrl) return
        const wmW = pageWidth  * 0.45
        const wmH = pageHeight * 0.45
        doc.addImage(watermarkDataUrl, "PNG", (pageWidth - wmW) / 2, (pageHeight - wmH) / 2, wmW, wmH)
      }

      const pageContentHook = () => {
        drawWatermark(doc)
        drawHeader(doc)
        const pageNumber = jsDoc.internal.getCurrentPageInfo().pageNumber
        const pageCount  = jsDoc.internal.getNumberOfPages()
        drawFooter(doc, pageNumber, pageCount)
      }

      // ── Worker info table ────────────────────────────────────────────────

      let cursorY = M.top
      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.setTextColor(...primaryColor)
      doc.text("Worker Information", M.left, cursorY - 16)

      autoTable(doc, {
        startY: cursorY,
        theme: "grid",
        styles:      { fontSize: 11, cellPadding: 6 },
        headStyles:  { fillColor: primaryColor, textColor: [255, 255, 255] },
        margin:      { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
        head: [["Field", "Details"]],
        body: [
          ["Worker Name",  worker.name                           ?? "-"],
          ["Role",         cfg.label                             ?? "-"],
          ["Email",        report.worker.email                   ?? "-"],
          ["Report Date",  nowDate                                     ],
        ],
        didDrawPage: pageContentHook,
      })

      cursorY = jsDoc.lastAutoTable.finalY + 30

      // ── Performance metrics table ────────────────────────────────────────

      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.setTextColor(...primaryColor)
      doc.text("Performance Metrics", M.left, cursorY - 10)

      autoTable(doc, {
        startY: cursorY,
        theme: "grid",
        styles:              { fontSize: 11, cellPadding: 6 },
        headStyles:          { fillColor: primaryColor, textColor: [255, 255, 255] },
        alternateRowStyles:  { fillColor: [245, 245, 245] },
        margin:              { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
        head: [["Metric", "Value"]],
        body: [
          ["Total Appointments",   String(report.metrics.totalAppointments ?? "-")],
          ["Completion Rate",      `${compRate}%`                                  ],
          ["Account Active For",   `${report.overview.accountAgeDays ?? "-"} days` ],
          ["Unread Notifications", String(report.overview.unreadNotifications ?? "-")],
        ],
        didDrawPage: pageContentHook,
      })

      cursorY = jsDoc.lastAutoTable.finalY + 30

      // ── AI insights table (only if present) ─────────────────────────────

      if (report.insights.length > 0) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(13)
        doc.setTextColor(...primaryColor)
        doc.text("AI-Generated Insights", M.left, cursorY - 10)

        autoTable(doc, {
          startY: cursorY,
          theme: "grid",
          styles:             { fontSize: 11, cellPadding: 6 },
          headStyles:         { fillColor: primaryColor, textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          columnStyles:       { 0: { cellWidth: 30 }, 1: { cellWidth: "auto" } },
          margin:             { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
          head: [["#", "Insight"]],
          body: report.insights.map((insight, i) => [String(i + 1), insight]),
          didDrawPage: pageContentHook,
        })
      }

      // ── Save ─────────────────────────────────────────────────────────────

      const safeName = worker.name.replace(/\s+/g, "_")
      doc.save(`${safeName}_performance_report.pdf`)
    } catch (err) {
      console.error("PDF generation error:", err)
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
            <button
              onClick={handleDownloadPdf}
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

          <div style={{ height: 5, background: PRIMARY }} />

          {/* Header */}
          <div
            className="flex items-start justify-between gap-6 px-8 py-5"
            style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}
          >
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

          <div
            className="py-1.5 text-center text-[10px] font-semibold tracking-widest"
            style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
          >
            CONFIDENTIAL · HYGIEIA HEALTH PLATFORM · AUTHORIZED ADMINISTRATORS ONLY
          </div>

          <div className="px-8 py-6 space-y-7">

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-3">
              {stats.map(({ label, value, unit, color, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl overflow-hidden flex flex-col"
                  style={{
                    background: `linear-gradient(to bottom right, ${tint(color, 10)}, ${tint(color, 5)})`,
                    border: `1px solid ${tint(color, 20)}`,
                  }}
                >
                  <div style={{ height: 3, background: color }} />
                  <div className="flex flex-col px-3 pt-2.5 pb-3 gap-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wide leading-none truncate"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {label}
                      </span>
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                    </div>
                    <p className="text-[22px] font-bold leading-none tabular-nums" style={{ color }}>
                      {value}
                    </p>
                    <p className="text-[10px] font-normal" style={{ color: "var(--muted-foreground)", opacity: 0.65 }}>
                      {unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance metrics */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: PRIMARY }} />
                <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "var(--foreground)" }}>
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

            {/* AI insights */}
            {report.insights.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: C.mintGreen }} />
                  <Lightbulb className="w-3.5 h-3.5" style={{ color: C.mintGreen }} />
                  <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "var(--foreground)" }}>
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

            {/* Footer */}
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

          <div style={{ height: 5, background: PRIMARY }} />

        </div>
      </div>
    </div>
  )
}
