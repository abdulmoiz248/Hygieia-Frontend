"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Download, Loader2,
  Calendar, Activity, Target, AlertTriangle,
  Lightbulb, CheckCircle2, Clock, Bell, TrendingUp,
  Stethoscope, Salad, FlaskConical,
} from "lucide-react"
import { Badge }                from "@/components/ui/badge"
import { Progress }             from "@/components/ui/progress"
import { Button }               from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton }             from "@/components/ui/skeleton"
import type { Worker }          from "@/types/admin/workers"
import type { WorkerReport }    from "@/hooks/admin/workers/useWorkerReport"
import { ROLE_CONFIG }          from "@/types/admin/workers"

// ─── Role icon map ────────────────────────────────────────────────────────────
const ROLE_ICONS: Record<string, React.ElementType> = {
  doctor:       Stethoscope,
  nutritionist: Salad,
  pathologist:  FlaskConical,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase()
}

function completionBadgeClass(rate: number) {
  if (rate >= 80) return "bg-mint-green text-snow-white"
  if (rate >= 50) return "bg-yellow-400 text-dark-slate-gray"
  return "bg-soft-coral text-snow-white"
}

// ─── Tiny skeleton helpers ────────────────────────────────────────────────────
function Skel({ w = "w-16", h = "h-5" }: { w?: string; h?: string }) {
  return <Skeleton className={`${w} ${h} rounded-md`} />
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface WorkerReportPageProps {
  worker:    Worker
  report:    WorkerReport | null
  isLoading: boolean
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WorkerReportPage({ worker, report, isLoading }: WorkerReportPageProps) {
  const router   = useRouter()
  const cfg      = ROLE_CONFIG[worker.role]
  const RoleIcon = ROLE_ICONS[worker.role] ?? Stethoscope
  const [pdfLoading, setPdfLoading] = useState(false)

  const compRate = report?.metrics.completionRate ?? 0
  const today    = new Date().toLocaleDateString("en-PK", {
    day: "numeric", month: "long", year: "numeric",
  })

  // ── PDF ────────────────────────────────────────────────────────────────────
  const handleDownloadPdf = async () => {
    if (!report) return
    setPdfLoading(true)
    try {
      const { default: jsPDF } = await import("jspdf")
      const autoTable           = (await import("jspdf-autotable")).default
      const doc                 = new jsPDF({ unit: "pt", format: "a4" })
      const jsDoc               = doc as any
      const pageWidth           = doc.internal.pageSize.getWidth()
      const pageHeight          = doc.internal.pageSize.getHeight()
      const primaryColor: [number, number, number] = [0, 131, 150]
      const grayText:    [number, number, number]  = [60,  60,  60]
      const M = { left: 48, right: 48, top: 160, bottom: 72 }

      const getBase64 = async (url: string) => {
        const res  = await fetch(url)
        const blob = await res.blob()
        return new Promise<string>((res, rej) => {
          const r = new FileReader()
          r.onload = () => res(r.result as string)
          r.onerror = rej
          r.readAsDataURL(blob)
        })
      }

      let logoDataUrl: string | null = null
      try { logoDataUrl = await getBase64("/logo/logo.png") } catch {}

      const nowDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      const nowTime = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

      const drawHeader = (d: any) => {
        if (logoDataUrl) d.addImage(logoDataUrl, "PNG", M.left, 44, 56, 56)
        d.setTextColor(...primaryColor); d.setFont("helvetica", "bold"); d.setFontSize(16)
        d.text("Hygieia", M.left + 70, 60)
        d.setFont("helvetica", "normal"); d.setFontSize(11); d.setTextColor(...grayText)
        d.text("From Past to Future of Healthcare", M.left + 70, 78)
        d.setFontSize(10); d.setTextColor(100)
        d.text("www.hygieia-frontend.vercel.app", M.left + 70, 94)
        d.setFont("helvetica", "bold"); d.setFontSize(18); d.setTextColor(...primaryColor)
        d.text("Worker Performance Report", pageWidth - M.right, 64, { align: "right" })
        d.setFont("helvetica", "normal"); d.setFontSize(10); d.setTextColor(100)
        d.text(`Generated: ${nowDate} • ${nowTime}`, pageWidth - M.right, 80, { align: "right" })
        d.setDrawColor(...primaryColor); d.setLineWidth(2)
        d.line(M.left, 120, pageWidth - M.right, 120)
      }
      const drawFooter = (d: any, pg: number, total: number) => {
        d.setDrawColor(...primaryColor); d.setLineWidth(2)
        d.line(M.left, pageHeight - M.bottom, pageWidth - M.right, pageHeight - M.bottom)
        d.setFont("helvetica", "normal"); d.setFontSize(9); d.setTextColor(110, 110, 110)
        d.text("Confidential · Authorized administrators only.", M.left, pageHeight - M.bottom + 18)
        d.text(`Page ${pg} of ${total}`, pageWidth / 2, pageHeight - 16, { align: "center" })
      }
      const hook = () => {
        drawHeader(doc)
        const pg    = jsDoc.internal.getCurrentPageInfo().pageNumber
        const total = jsDoc.internal.getNumberOfPages()
        drawFooter(doc, pg, total)
      }

      let cursorY = M.top
      autoTable(doc, {
        startY: cursorY, theme: "grid",
        styles: { fontSize: 11, cellPadding: 6 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
        head: [["Field", "Details"]],
        body: [
          ["Worker Name", worker.name ?? "-"],
          ["Role",        cfg.label    ?? "-"],
          ["Email",       report.worker.email ?? "-"],
          ["Report Date", nowDate],
        ],
        didDrawPage: hook,
      })
      cursorY = jsDoc.lastAutoTable.finalY + 30

      autoTable(doc, {
        startY: cursorY, theme: "grid",
        styles: { fontSize: 11, cellPadding: 6 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
        head: [["Metric", "Value"]],
        body: [
          ["Total Appointments",   String(report.metrics.totalAppointments ?? "-")],
          ["Completion Rate",      `${compRate}%`],
          ["Account Active For",   `${report.overview.accountAgeDays ?? "-"} days`],
          ["Unread Notifications", String(report.overview.unreadNotifications ?? 0)],
        ],
        didDrawPage: hook,
      })
      cursorY = jsDoc.lastAutoTable.finalY + 30

      if (report.insights.length > 0) {
        autoTable(doc, {
          startY: cursorY, theme: "grid",
          styles: { fontSize: 11, cellPadding: 6 },
          headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
          head: [["#", "AI Insight"]],
          body: report.insights.map((ins, i) => [String(i + 1), ins]),
          didDrawPage: hook,
        })
      }

      doc.save(`${worker.name.replace(/\s+/g, "_")}_performance_report.pdf`)
    } catch (err) {
      console.error("PDF error:", err)
    } finally {
      setPdfLoading(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    // FIX 1: reduced px-6 → px-4 sm:px-6 to trim horizontal padding
    <div className="min-h-screen px-4 sm:px-6 pb-10 space-y-6 bg-[var(--color-snow-white)] fade-in">

      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      {/* FIX 1: reduced pt-6 → pt-4 */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-dark-slate-gray hover:text-soft-blue transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workers
        </button>

        <Button
          onClick={handleDownloadPdf}
          disabled={pdfLoading || isLoading || !report}
          className="flex items-center gap-2 bg-soft-coral hover:bg-soft-coral/90 text-snow-white text-sm"
        >
          {pdfLoading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
            : <><Download className="h-4 w-4" /> Download PDF</>}
        </Button>
      </div>

      {/* ── Worker identity ───────────────────────────────────────────────────── */}
      <Card
        className="w-full border-l-4 bg-cool-gray/10"
        style={{ borderLeftColor: "var(--color-soft-blue)" }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base select-none bg-soft-blue text-snow-white flex-shrink-0">
                {getInitials(worker.name)}
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-soft-coral">
                  {worker.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <RoleIcon className="h-4 w-4 text-soft-blue" />
                  <span className="text-sm text-dark-slate-gray font-medium">{cfg.label}</span>
                  <span className="text-muted-foreground">·</span>
                  {isLoading
                    ? <Skel w="w-40" />
                    : <span className="text-sm text-muted-foreground">{report?.worker.email}</span>}
                </div>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                <Calendar className="h-4 w-4 text-dark-slate-gray" />
                <span>Generated {today}</span>
              </div>
              <Badge className="mt-2 bg-mint-green text-snow-white p-2">Official Report</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ── Stat overview row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        {/* Account Age */}
        <Card className="border-l-4 bg-cool-gray/10" style={{ borderLeftColor: "var(--color-soft-blue)" }}>
          <CardContent className="pt-5 pb-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-soft-blue" />
              <span className="text-sm font-medium text-dark-slate-gray">Account Age</span>
            </div>
            {isLoading
              ? <Skel w="w-12" h="h-8" />
              : <p className="text-3xl font-bold text-soft-blue">{report?.overview.accountAgeDays}</p>}
            <p className="text-xs text-muted-foreground">days active</p>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card className="border-l-4 bg-cool-gray/10" style={{ borderLeftColor: "var(--color-mint-green)" }}>
          <CardContent className="pt-5 pb-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Target className="h-4 w-4 text-mint-green" />
              <span className="text-sm font-medium text-dark-slate-gray">Appointments</span>
            </div>
            {isLoading
              ? <Skel w="w-12" h="h-8" />
              : <p className="text-3xl font-bold text-mint-green">{report?.metrics.totalAppointments}</p>}
            <p className="text-xs text-muted-foreground">total</p>
          </CardContent>
        </Card>

        {/* Completion */}
        <Card className="border-l-4 bg-cool-gray/10" style={{ borderLeftColor: "var(--color-soft-coral)" }}>
          <CardContent className="pt-5 pb-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Activity className="h-4 w-4 text-soft-coral" />
              <span className="text-sm font-medium text-dark-slate-gray">Completion</span>
            </div>
            {isLoading
              ? <Skel w="w-14" h="h-8" />
              : <p className="text-3xl font-bold text-soft-coral">{compRate}%</p>}
            <p className="text-xs text-muted-foreground">rate</p>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-l-4 bg-cool-gray/10" style={{ borderLeftColor: "var(--color-soft-blue)" }}>
          <CardContent className="pt-5 pb-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Bell className="h-4 w-4 text-soft-blue" />
              <span className="text-sm font-medium text-dark-slate-gray">Notifications</span>
            </div>
            {isLoading
              ? <Skel w="w-8" h="h-8" />
              : <p className="text-3xl font-bold text-soft-blue">{report?.overview.unreadNotifications ?? 0}</p>}
            <p className="text-xs text-muted-foreground">unread</p>
          </CardContent>
        </Card>

      </div>

      {/* ── Completion progress bar ───────────────────────────────────────────── */}
      <Card className="w-full border-l-4 bg-cool-gray/10" style={{ borderLeftColor: "var(--color-soft-blue)" }}>
        <CardContent className="pt-1 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-soft-blue font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Completion Rate
            </span>
            {isLoading ? <Skel w="w-10" /> : <span className="font-bold text-soft-coral">{compRate}%</span>}
          </div>
          <Progress value={isLoading ? 0 : compRate} className="h-2" />
          <div>
            {isLoading
              ? <Skel w="w-24" h="h-6" />
              : (
                <Badge className={`text-xs p-1.5 ${completionBadgeClass(compRate)}`}>
                  {compRate >= 80 ? "Excellent" : compRate >= 50 ? "On Track" : "Needs Attention"}
                </Badge>
              )}
          </div>
        </CardContent>
      </Card>

      {/* ── Notifications alert ───────────────────────────────────────────────── */}
      {!isLoading && report && report.overview.unreadNotifications > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-snow-white border border-soft-coral/20">
          <AlertTriangle className="h-4 w-4 mt-0.5 text-soft-coral" />
          <div>
            <p className="text-sm font-medium text-soft-blue">Pending Notifications</p>
            <p className="text-sm text-muted-foreground">
              This worker has {report.overview.unreadNotifications} unread notification
              {report.overview.unreadNotifications !== 1 ? "s" : ""} in their inbox.
            </p>
          </div>
        </div>
      )}

      {/* ── AI insights ──────────────────────────────────────────────────────── */}
      <Card className="w-full border-l-4 bg-cool-gray/10" style={{ borderLeftColor: "var(--color-mint-green)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-soft-blue flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-mint-green" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading
            ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-snow-white">
                  <Skeleton className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0" />
                  <Skel w="w-full" h="h-4" />
                </div>
              ))
            )
            : report?.insights.length
              ? report.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-snow-white">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-mint-green flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{insight}</p>
                  </div>
                ))
              : <p className="text-sm text-muted-foreground">No insights available.</p>}
        </CardContent>
      </Card>

    </div>
  )
}