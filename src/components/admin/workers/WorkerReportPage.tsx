"use client"

import { useState } from "react"
import {
  Download,
  Loader2,
  Calendar,
  Activity,
  Target,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
  TrendingUp,
  Stethoscope,
  Salad,
  FlaskConical,
  BarChart3,
  Users,
  Star,
  TestTube,
  Pill,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Worker } from "@/types/admin/workers"
import type { WorkerReport } from "@/hooks/admin/workers/useWorkerReport"
import { ROLE_CONFIG } from "@/types/admin/workers"
import { WorkerAnalyticsCharts } from "./WorkerAnalyticsCharts"
// import { PatientReportsSection } from "./PatientReportsSection"

// ─── Role icon map ────────────────────────────────────────────────────────────
const ROLE_ICONS: Record<string, React.ElementType> = {
  doctor: Stethoscope,
  nutritionist: Salad,
  lab_technician: FlaskConical,
  pathologist: FlaskConical,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  if (!name) return "W"
  return name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase()
}

function completionBadgeClass(rate: number) {
  if (rate >= 80) return "bg-mint-green text-snow-white"
  if (rate >= 50) return "bg-yellow-400 text-dark-slate-gray"
  return "bg-soft-coral text-snow-white"
}

function Skel({ w = "w-16", h = "h-5", className = "" }: { w?: string; h?: string; className?: string }) {
  return <Skeleton className={`${w} ${h} rounded-md ${className}`} />
}

function parseReportDate(value?: string) {
  if (!value) return null

  const trimmed = value.trim()
  const slashDate = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)

  if (slashDate) {
    const first = Number(slashDate[1])
    const second = Number(slashDate[2])
    const year = Number(slashDate[3])
    const day = first > 12 ? first : second > 12 ? second : first
    const month = first > 12 ? second : second > 12 ? first : second
    const parsed = new Date(year, month - 1, day)

    return isNaN(parsed.getTime()) ? null : parsed
  }

  const parsed = new Date(trimmed)
  return isNaN(parsed.getTime()) ? null : parsed
}

function formatCardDate(value?: string) {
  const date = parseReportDate(value)
  if (!date) return "No date"
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatCardDateTime(value?: string) {
  const date = parseReportDate(value)
  if (!date) return "No time"
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " - " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

// ─── Props ────────────────────────────────────────────────────────────────────
function formatDayNumber(value?: string) {
  return parseReportDate(value)?.getDate() ?? "-"
}

function formatMonthLabel(value?: string) {
  const date = parseReportDate(value)
  return date ? date.toLocaleDateString("en-US", { month: "short" }) : "Date"
}

function formatInsightText(insight: unknown) {
  const cleanText = (text: string) =>
    text
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/<\/?[^>]+>/g, " ")
      .replace(/(^|\s)&\/?p\b/gi, " ")
      .replace(/&\s*\/?\s*p;?/gi, " ")
      .replace(/^[\s\p{Extended_Pictographic}\uFE0F\u200D★⭐⚠✅❌🔸🔹•-]+/u, "")
      .replace(/\s+/g, " ")
      .trim()

  if (typeof insight === "string") return cleanText(insight)
  if (!insight || typeof insight !== "object") return String(insight ?? "")

  const value = insight as Record<string, unknown>
  const candidate =
    value.insight ??
    value.message ??
    value.text ??
    value.title ??
    value.description ??
    value.recommendation ??
    value.content ??
    value.value ??
    value.children ??
    value.p

  if (typeof candidate === "string") return cleanText(candidate)

  return cleanText(Object.entries(value)
    .filter(([, entry]) => entry !== null && entry !== undefined && typeof entry !== "object")
    .map(([key, entry]) => `${key}: ${entry}`)
    .join("; "))
}

interface WorkerReportPageProps {
  worker: Worker
  report: WorkerReport | null
  isLoading: boolean
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WorkerReportPage({ worker, report, isLoading }: WorkerReportPageProps) {
 
  const cfg = ROLE_CONFIG[worker.role] || { label: worker.role }
  const RoleIcon = ROLE_ICONS[worker.role] ?? Stethoscope
  const [pdfLoading, setPdfLoading] = useState(false)
  const isNutritionist = worker.role === "nutritionist"

  // Handle nested or flat metrics
  const compRate = report?.metrics?.efficiency?.completionRatePercentage ?? report?.metrics?.completionRate ?? 0
  
  // Details
  const workerName = report?.detailed?.profile?.name || worker.name
  const workerAvatar = report?.detailed?.profile?.img || worker.img || ""
  const workerPhone = report?.detailed?.profile?.phone || worker.phone || "-"

  // Unread notifications
  const unreadCount = report?.overview?.notifications?.unread ?? report?.overview?.unreadNotifications ?? 0

  // ── PDF ────────────────────────────────────────────────────────────────────
  const handleDownloadPdf = async () => {
    if (!report) return
    setPdfLoading(true)
    try {
      const { default: jsPDF } = await import("jspdf")
      const autoTableModule = await import("jspdf-autotable")
      const autoTable = autoTableModule.default ?? autoTableModule.autoTable
      if (!autoTable) throw new Error("PDF table generator could not be loaded.")
      const doc = new jsPDF({ unit: "pt", format: "a4" })
      const jsDoc = doc as any
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const primaryColor: [number, number, number] = [0, 131, 150]
      const grayText: [number, number, number] = [60, 60, 60]
      const M = { left: 48, right: 48, top: 160, bottom: 72 }

      const getBase64 = async (url: string) => {
        const res = await fetch(url)
        const blob = await res.blob()
        return new Promise<string>((res, rej) => {
          const r = new FileReader()
          r.onload = () => res(r.result as string)
          r.onerror = rej
          r.readAsDataURL(blob)
        })
      }

      let logoDataUrl: string | null = null
      try {
        logoDataUrl = await getBase64("/logo/logo.png")
      } catch {}

      const now = new Date()
      const nowDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      const nowTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

      const drawHeader = (d: any) => {
        if (logoDataUrl) d.addImage(logoDataUrl, "PNG", M.left, 44, 56, 56)
        d.setTextColor(...primaryColor)
        d.setFont("helvetica", "bold")
        d.setFontSize(16)
        d.text("Hygieia", M.left + 70, 60)
        d.setFont("helvetica", "normal")
        d.setFontSize(11)
        d.setTextColor(...grayText)
        d.text("From Past to Future of Healthcare", M.left + 70, 78)
        d.setFontSize(10)
        d.setTextColor(100)
        d.text("www.hygieia-frontend.vercel.app", M.left + 70, 94)
        d.setFont("helvetica", "bold")
        d.setFontSize(18)
        d.setTextColor(...primaryColor)
        d.text("Worker Performance Report", pageWidth - M.right, 64, { align: "right" })
        d.setFont("helvetica", "normal")
        d.setFontSize(10)
        d.setTextColor(100)
        d.text(`Generated: ${nowDate} - ${nowTime}`, pageWidth - M.right, 80, { align: "right" })
        d.setDrawColor(...primaryColor)
        d.setLineWidth(2)
        d.line(M.left, 120, pageWidth - M.right, 120)
      }
      const drawFooter = (d: any, pg: number, total: number) => {
        d.setDrawColor(...primaryColor)
        d.setLineWidth(2)
        d.line(M.left, pageHeight - M.bottom, pageWidth - M.right, pageHeight - M.bottom)
        d.setFont("helvetica", "normal")
        d.setFontSize(9)
        d.setTextColor(110, 110, 110)
        d.text("Confidential · Authorized administrators only.", M.left, pageHeight - M.bottom + 18)
        d.text(`Page ${pg} of ${total}`, pageWidth / 2, pageHeight - 16, { align: "center" })
      }
      const hook = () => {
        drawHeader(doc)
        const pg = jsDoc.internal.getCurrentPageInfo().pageNumber
        const total = jsDoc.internal.getNumberOfPages()
        drawFooter(doc, pg, total)
      }

      let cursorY = M.top
      autoTable(doc, {
        startY: cursorY,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 6 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
        head: [["Field", "Details"]],
        body: [
          ["Worker Name", workerName ?? "-"],
          ["Role", cfg.label ?? "-"],
          ["Email", report.worker?.email || report.workerDetails?.profile?.email || "-"],
          ["Report Date", nowDate],
        ],
        didDrawPage: hook,
      })
      cursorY = jsDoc.lastAutoTable.finalY + 30

      autoTable(doc, {
        startY: cursorY,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 6 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
        head: [["Metric", "Value"]],
        body: [
          ["Completion Rate", `${compRate}%`],
          ["Account Active For", `${report.overview.accountAgeDays ?? "-"} days`],
          ["Unread Notifications", String(unreadCount)],
        ],
        didDrawPage: hook,
      })
      cursorY = jsDoc.lastAutoTable.finalY + 30

      if (report.insights && report.insights.length > 0) {
        const numberColumnWidth = 40
        const tableWidth = pageWidth - M.left - M.right
        const textColumnWidth = tableWidth - numberColumnWidth
        const rowPadding = 8
        const lineHeight = 14

        const drawInsightTableHeader = () => {
          doc.setFillColor(...primaryColor)
          doc.rect(M.left, cursorY, tableWidth, 28, "F")
          doc.setFont("helvetica", "bold")
          doc.setFontSize(11)
          doc.setTextColor(255, 255, 255)
          doc.text("#", M.left + 10, cursorY + 18)
          doc.text("AI Insight", M.left + numberColumnWidth + 10, cursorY + 18)
          cursorY += 28
        }

        const ensureInsightSpace = (height: number) => {
          if (cursorY + height <= pageHeight - M.bottom - 10) return
          doc.addPage()
          drawHeader(doc)
          drawFooter(doc, jsDoc.internal.getCurrentPageInfo().pageNumber, jsDoc.internal.getNumberOfPages())
          cursorY = M.top
          drawInsightTableHeader()
        }

        ensureInsightSpace(70)
        drawInsightTableHeader()

        report.insights.forEach((insight, i) => {
          const insightText = formatInsightText(insight) || "No insight text provided."
          const lines = doc.splitTextToSize(insightText, textColumnWidth - rowPadding * 2)
          const rowHeight = Math.max(30, lines.length * lineHeight + rowPadding * 2)

          ensureInsightSpace(rowHeight)
          doc.setDrawColor(220, 220, 220)
          doc.setFillColor(i % 2 === 0 ? 255 : 245, i % 2 === 0 ? 255 : 245, i % 2 === 0 ? 255 : 245)
          doc.rect(M.left, cursorY, tableWidth, rowHeight, "FD")
          doc.line(M.left + numberColumnWidth, cursorY, M.left + numberColumnWidth, cursorY + rowHeight)
          doc.setFont("helvetica", "normal")
          doc.setFontSize(10)
          doc.setTextColor(...grayText)
          doc.text(String(i + 1), M.left + 10, cursorY + rowPadding + 10)
          doc.text(lines, M.left + numberColumnWidth + rowPadding, cursorY + rowPadding + 10)
          cursorY += rowHeight
        })

        cursorY += 30
      }

      if (recentAppointments.length > 0) {
        autoTable(doc, {
          startY: cursorY,
          theme: "grid",
          styles: { fontSize: 10, cellPadding: 6 },
          headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
          head: [["Appointment", "Date", "Time", "Status", "Reviews"]],
          body: recentAppointments.map((apt) => [
            apt.type || "Appointment",
            formatCardDate(apt.date),
            apt.time || "-",
            apt.status || "-",
            String(reviewsByAppointmentId[apt.id]?.length ?? 0),
          ]),
          didDrawPage: hook,
        })
        cursorY = jsDoc.lastAutoTable.finalY + 30
      }

      if (visiblePrescriptions.length > 0) {
        autoTable(doc, {
          startY: cursorY,
          theme: "grid",
          styles: { fontSize: 10, cellPadding: 6 },
          headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
          head: [["Prescription", "Start Date", "End Date", "Status"]],
          body: visiblePrescriptions.map((rx) => [
            "Prescription",
            formatCardDate(rx.start_date),
            formatCardDate(rx.end_date),
            rx.status || "-",
          ]),
          didDrawPage: hook,
        })
        cursorY = jsDoc.lastAutoTable.finalY + 30
      }

      if (recentDietPlans.length > 0) {
        autoTable(doc, {
          startY: cursorY,
          theme: "grid",
          styles: { fontSize: 10, cellPadding: 6 },
          headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
          head: [["Diet Plan", "Start Date", "End Date", "Daily Calories"]],
          body: recentDietPlans.map((plan) => [
            "Diet Plan",
            formatCardDate(plan.start_date),
            formatCardDate(plan.end_date),
            plan.daily_calories || "-",
          ]),
          didDrawPage: hook,
        })
        cursorY = jsDoc.lastAutoTable.finalY + 30
      }

      if (recentReviews.length > 0) {
        autoTable(doc, {
          startY: cursorY,
          theme: "grid",
          styles: { fontSize: 10, cellPadding: 6 },
          headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
          head: [["Rating", "Date", "Review"]],
          body: recentReviews.map((review) => [
            `${review.rating}/5`,
            formatCardDateTime(review.created_at),
            review.review_text || "No review text provided.",
          ]),
          didDrawPage: hook,
        })
      }

      doc.save(`${workerName.replace(/\s+/g, "_")}_performance_report.pdf`)
    } catch (err) {
      console.error("PDF error:", err)
    } finally {
      setPdfLoading(false)
    }
  }

  // Determine dynamic metric labels based on role and flat/nested metrics
  let metric1Label = "Appointments"
  let metric1Value = report?.metrics?.core?.totalAppointments ?? report?.metrics?.totalAppointments ?? 0
  let Metric1Icon = Target
  
  let metric2Label = "Completed"
  let metric2Value = report?.metrics?.core?.completedAppointments ?? report?.metrics?.completedAppointments ?? 0
  
  const metric3Label = "Unique Patients"
  const metric3Value = report?.metrics?.core?.uniquePatients ?? report?.metrics?.uniquePatients ?? report?.overview?.patients?.totalUniquePatients ?? 0
  
  let metric4Label = "Avg Rating"
  let metric4Value = report?.metrics?.core?.averageRating ?? report?.metrics?.averageRating ?? "-"
  let Metric4Icon = Star
//@ts-expect-error  just in case backend send different
  if (worker.role === "lab_technician" || worker.role === "pathologist") {
    metric1Label = "Lab Bookings"
    metric1Value = report?.metrics?.core?.totalLabBookings ?? report?.metrics?.totalLabBookings ?? 0
    Metric1Icon = TestTube
    metric2Value = report?.metrics?.core?.completedBookings ?? report?.metrics?.completedBookings ?? 0
    metric4Label = "Pending Tests"
    metric4Value = report?.metrics?.core?.pendingBookings ?? report?.metrics?.pendingBookings ?? 0
    Metric4Icon = Clock
  } else if (worker.role === "doctor") {
    metric1Label = "Appointments"
    metric1Value = report?.metrics?.core?.totalAppointments ?? report?.metrics?.totalAppointments ?? 0
    Metric1Icon = Calendar
    metric2Label = "Active Prescriptions"
    metric2Value = report?.metrics?.core?.activePrescriptions ?? report?.metrics?.activePrescriptions ?? 0
  }

  const recentAppointments = report?.recentActivity?.appointments ?? []
  const recentPrescriptions = report?.recentActivity?.prescriptions ?? []
  const recentDietPlans = report?.recentActivity?.dietPlans ?? []
  const recentReviews = report?.recentActivity?.reviews ?? []
  const recentLabBookings = report?.recentActivity?.labBookings ?? []
  const visiblePrescriptions = isNutritionist ? [] : recentPrescriptions
  const activityItemCount =
    recentAppointments.length +
    visiblePrescriptions.length +
    recentDietPlans.length +
    recentReviews.length +
    recentLabBookings.length
  const appointmentIds = new Set(recentAppointments.map((appointment) => appointment.id))
  const reviewsByAppointmentId = recentReviews.reduce<Record<string, typeof recentReviews>>((acc, review) => {
    if (!review.appointment_id) return acc
    acc[review.appointment_id] = [...(acc[review.appointment_id] ?? []), review]
    return acc
  }, {})
  const unlinkedReviews = recentReviews.filter((review) => !review.appointment_id || !appointmentIds.has(review.appointment_id))

  return (
    <div className="min-h-screen bg-gradient-to-br bg-transparent fade-in pb-12">
      <div className="container mx-auto space-y-8 px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-soft-coral" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-balance text-soft-coral">Worker Analytics</h1>
                <p className="text-cool-gray text-lg">Comprehensive performance and activity overview</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-stretch">
          
          {/* ── Left Column (Profile & Action) ────────────────────────────────────── */}
          <div className="xl:col-span-1 flex h-full flex-col gap-4">
            
            {/* Worker Profile Card */}
            <Card className="hover-lift bg-white overflow-hidden shadow-md border-t-4 border-t-soft-blue rounded-2xl">
              <div className="p-6">
                <div className="flex flex-col items-center justify-center text-center">
                  {isLoading ? (
                    <Skeleton className="w-28 h-28 rounded-full mb-4" />
                  ) : (
                    <Avatar className="w-28 h-28 border-4 border-background shadow-lg mb-4">
                      <AvatarImage src={workerAvatar || ""} alt={workerName} className="object-cover" />
                      <AvatarFallback className="bg-soft-blue text-snow-white text-3xl font-bold">
                        {getInitials(workerName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="w-full space-y-2">
                    <h3 className="text-xl font-bold text-soft-coral">{workerName}</h3>
                    <div className="flex items-center justify-center gap-2 text-dark-slate-gray font-medium">
                      <RoleIcon className="w-4 h-4 text-soft-blue" />
                      <span className="capitalize">{cfg.label}</span>
                    </div>
                    {isLoading ? (
                      <Skel w="w-3/4" h="h-4" className="mx-auto" />
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground break-all">{report?.worker?.email || report?.workerDetails?.profile?.email || worker.email || "-"}</p>
                        <p className="text-sm text-muted-foreground">{workerPhone}</p>
                      </>
                    )}

                    {report && (
                      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-cool-gray/20">
                        <Clock className="w-4 h-4 text-soft-blue" />
                        <span className="text-sm text-cool-gray">Active for <span className="font-semibold text-dark-slate-gray">{report.overview.accountAgeDays}</span> days</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="hover-lift border-accent/20 rounded-xl shadow-sm min-h-[132px] w-full">
              <CardContent className="flex h-full min-h-[132px] flex-col justify-between gap-5 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-soft-coral">
                  <Download className="w-4 h-4" />
                  Quick Actions
                </div>
                <Button
                  onClick={handleDownloadPdf}
                  disabled={pdfLoading || isLoading || !report}
                  className="w-full bg-soft-coral hover:bg-soft-coral/90 text-snow-white flex items-center justify-center gap-2 h-10 rounded-lg transition-all"
                >
                  {pdfLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> <span>Generating...</span></>
                  ) : (
                    <><Download className="w-4 h-4" /> <span>Download PDF Report</span></>
                  )}
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* ── Right Column (Analytics & Detailed Metrics) ──────────────────────── */}
          <div className="xl:col-span-3 space-y-8">

            {/* Summary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-soft-blue bg-white shadow-sm hover-lift rounded-xl h-full">
                <CardContent className="min-h-32 p-4 sm:p-6 text-center flex flex-col items-center justify-center gap-3">
                  <div className="flex min-h-10 items-center justify-center gap-2">
                    <Metric1Icon className="h-4 w-4 text-soft-blue" />
                    <span className="text-sm font-medium text-dark-slate-gray leading-tight">{metric1Label}</span>
                  </div>
                  {isLoading ? (
                    <Skel w="w-12" h="h-8" className="mx-auto" />
                  ) : (
                    <p className="text-3xl font-bold text-soft-blue">{metric1Value}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-mint-green bg-white shadow-sm hover-lift rounded-xl h-full">
                <CardContent className="min-h-32 p-4 sm:p-6 text-center flex flex-col items-center justify-center gap-3">
                  <div className="flex min-h-10 items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-mint-green" />
                    <span className="text-sm font-medium text-dark-slate-gray leading-tight">{metric2Label}</span>
                  </div>
                  {isLoading ? (
                    <Skel w="w-12" h="h-8" className="mx-auto" />
                  ) : (
                    <p className="text-3xl font-bold text-mint-green">{metric2Value}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-soft-coral bg-white shadow-sm hover-lift rounded-xl h-full">
                <CardContent className="min-h-32 p-4 sm:p-6 text-center flex flex-col items-center justify-center gap-3">
                  <div className="flex min-h-10 items-center justify-center gap-2">
                    <Users className="h-4 w-4 text-soft-coral" />
                    <span className="text-sm font-medium text-dark-slate-gray leading-tight">{metric3Label}</span>
                  </div>
                  {isLoading ? (
                    <Skel w="w-12" h="h-8" className="mx-auto" />
                  ) : (
                    <p className="text-3xl font-bold text-soft-coral">{metric3Value}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-400 bg-white shadow-sm hover-lift rounded-xl h-full">
                <CardContent className="min-h-32 p-4 sm:p-6 text-center flex flex-col items-center justify-center gap-3">
                  <div className="flex min-h-10 items-center justify-center gap-2">
                    <Metric4Icon className={`h-4 w-4 ${Metric4Icon === Star ? "text-yellow-500 fill-current" : "text-yellow-500"}`} />
                    <span className="text-sm font-medium text-dark-slate-gray leading-tight">{metric4Label}</span>
                  </div>
                  {isLoading ? (
                    <Skel w="w-12" h="h-8" className="mx-auto" />
                  ) : (
                    <p className="text-3xl font-bold text-yellow-500">{metric4Value}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Analytics Charts (Moved Above AI Insights) */}
            {!isLoading && report?.analytics && (
              <WorkerAnalyticsCharts analytics={report.analytics} />
            )}

          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-stretch">
          <Card className="hover-lift rounded-xl shadow-sm h-full">
            <CardContent className="h-full p-4 space-y-4">
              <div className="text-soft-coral flex items-center gap-2 text-base font-semibold">
                <Activity className="w-4 h-4" />
                Status
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-soft-blue font-medium flex items-center gap-2 whitespace-nowrap">
                    <TrendingUp className="h-4 w-4 shrink-0" />
                    <span className="text-sm">Completion Rate</span>
                  </span>
                  {isLoading ? <Skel w="w-10" /> : <span className="font-bold text-soft-coral text-base">{Number(compRate).toFixed(1)}%</span>}
                </div>
                <Progress value={isLoading ? 0 : compRate} className="h-2.5 text-soft-blue rounded-full" />
                <div>
                  {isLoading ? (
                    <Skel w="w-24" h="h-6" />
                  ) : (
                    <Badge className={`text-xs px-3 py-1 ${completionBadgeClass(compRate)}`}>
                      {compRate >= 80 ? "Excellent" : compRate >= 50 ? "On Track" : "Needs Attention"}
                    </Badge>
                  )}
                </div>
              </div>

              {!isLoading && report && unreadCount > 0 && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-soft-coral/20">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-soft-coral shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-soft-coral">Unread Notifications</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Worker has {unreadCount} pending alerts.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover-lift border-accent/10 shadow-sm rounded-xl h-full xl:col-span-3">
            <CardHeader className="pb-3 border-b border-cool-gray/10">
              <CardTitle className="text-soft-blue flex items-center gap-2 text-base">
                <Lightbulb className="w-5 h-5 text-soft-blue" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skel w="w-full" h="h-4" />
                  <Skel w="w-5/6" h="h-4" />
                  <Skel w="w-4/5" h="h-4" />
                </div>
              ) : report?.insights && report.insights.length > 0 ? (
                <div className="space-y-3">
                  {report.insights.map((insight, i) => (
                    <p key={i} className="text-sm text-dark-slate-gray leading-relaxed">
                      {formatInsightText(insight)}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No insights available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
            {(!isLoading && report?.recentActivity) && (
              <div className="space-y-6 w-full">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-soft-coral">Recent Activity</h2>
                    <p className="text-sm text-muted-foreground">
                      {isNutritionist ? "Appointments, diet plans, and linked patient reviews" : "Appointments, prescriptions, and linked patient reviews"}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-secondary text-soft-blue rounded-full px-3 py-1">
                    {activityItemCount} items
                  </Badge>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  {recentAppointments.length > 0 && (
                    <Card className={`overflow-hidden rounded-3xl border border-soft-blue/15 shadow-sm bg-white ${isNutritionist && recentDietPlans.length === 0 ? "xl:col-span-2" : ""}`}>
                      <CardHeader className="border-b border-soft-blue/10 bg-white py-4">
                        <div className="flex items-center justify-between gap-3">
                          <CardTitle className="text-soft-coral flex items-center gap-2 text-lg">
                            <Calendar className="w-5 h-5" />
                            Appointments
                          </CardTitle>
                          <Badge className="bg-soft-blue/10 text-soft-blue hover:bg-soft-blue/15 rounded-full">
                            {recentAppointments.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-cool-gray/10 [&>*:first-child]:pt-2 sm:[&>*:first-child]:pt-3">
                          {recentAppointments.map((apt) => (
                            <div key={apt.id} id={`appointment-${apt.id}`} className="p-4 sm:p-5 hover:bg-cool-gray/5 transition-colors">
                              <div className="flex items-start gap-4">
                                <div className="w-14 shrink-0 rounded-2xl bg-soft-blue/10 border border-soft-blue/15 p-2 text-center">
                                  <p className="text-[10px] uppercase tracking-wide text-soft-coral font-bold">{formatMonthLabel(apt.date)}</p>
                                  <p className="text-lg font-bold text-dark-slate-gray leading-none">{formatDayNumber(apt.date)}</p>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                      <p className="font-semibold text-soft-blue capitalize text-sm sm:text-base">{apt.type}</p>
                                      <p className="text-xs text-muted-foreground mt-1">{formatCardDate(apt.date)} - {apt.time}</p>
                                    </div>
                                    <Badge className={apt.status === "completed" ? "bg-mint-green/15 text-mint-green hover:bg-mint-green/20 rounded-full px-3" : apt.status === "upcoming" ? "bg-soft-blue/15 text-soft-blue hover:bg-soft-blue/20 rounded-full px-3" : "bg-soft-coral/15 text-soft-coral hover:bg-soft-coral/20 rounded-full px-3"}>
                                      {apt.status}
                                    </Badge>
                                  </div>
                                  {(reviewsByAppointmentId[apt.id]?.length ?? 0) > 0 && (
                                    <Accordion type="single" collapsible className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 px-3">
                                      <AccordionItem value="reviews" className="border-0">
                                        <AccordionTrigger className="py-3 text-xs font-semibold text-yellow-700 hover:no-underline">
                                          <span className="flex items-center gap-2">
                                            <Star className="h-4 w-4 fill-current" />
                                            {reviewsByAppointmentId[apt.id].length} review{reviewsByAppointmentId[apt.id].length === 1 ? "" : "s"}
                                          </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-3 pb-3">
                                          {reviewsByAppointmentId[apt.id].map((review) => (
                                            <div key={review.id} className="rounded-xl bg-white border border-yellow-400/15 p-3">
                                              <div className="flex flex-wrap items-center justify-between gap-2">
                                                <Badge className="bg-yellow-400/15 text-yellow-700 hover:bg-yellow-400/20 rounded-full">
                                                  {review.rating}/5
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">{formatCardDateTime(review.created_at)}</span>
                                              </div>
                                              <p className="mt-3 text-sm text-dark-slate-gray whitespace-pre-wrap leading-relaxed">
                                                {review.review_text || "No review text provided."}
                                              </p>
                                            </div>
                                          ))}
                                        </AccordionContent>
                                      </AccordionItem>
                                    </Accordion>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {visiblePrescriptions.length > 0 && (
                    <Card className="overflow-hidden rounded-3xl border border-soft-coral/15 shadow-sm bg-white">
                      <CardHeader className="border-b border-soft-coral/10 bg-white py-4">
                        <div className="flex items-center justify-between gap-3">
                          <CardTitle className="text-soft-coral flex items-center gap-2 text-lg">
                            <Pill className="w-5 h-5 text-soft-coral" />
                            Prescriptions
                          </CardTitle>
                          <Badge className="bg-soft-coral/10 text-soft-coral hover:bg-soft-coral/15 rounded-full">
                            {visiblePrescriptions.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-cool-gray/10 [&>*:first-child]:pt-2 sm:[&>*:first-child]:pt-3">
                          {visiblePrescriptions.map((rx) => (
                            <div key={rx.id} className="p-4 sm:p-5 hover:bg-cool-gray/5 transition-colors">
                              <div className="flex items-start gap-4">
                                <div className="w-14 shrink-0 rounded-2xl bg-soft-coral/10 border border-soft-coral/15 p-2 text-center">
                                  <p className="text-[10px] uppercase tracking-wide text-soft-coral font-bold">Start</p>
                                  <p className="text-lg font-bold text-dark-slate-gray leading-none">{formatDayNumber(rx.start_date)}</p>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                      <p className="font-semibold text-soft-blue text-sm sm:text-base">Prescription</p>
                                      <p className="text-xs text-muted-foreground mt-1">{formatCardDate(rx.start_date)} to {formatCardDate(rx.end_date)}</p>
                                    </div>
                                    <Badge className={rx.status === "completed" ? "bg-mint-green/15 text-mint-green hover:bg-mint-green/20 rounded-full px-3" : "bg-soft-blue/15 text-soft-blue hover:bg-soft-blue/20 rounded-full px-3"}>
                                      {rx.status}
                                    </Badge>
                                  </div>
                                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span className="rounded-full bg-cool-gray/10 px-2.5 py-1">Valid till {formatCardDate(rx.end_date)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {isNutritionist && recentDietPlans.length > 0 && (
                    <Card className="overflow-hidden rounded-3xl border border-mint-green/15 shadow-sm bg-white">
                      <CardHeader className="border-b border-mint-green/10 bg-white py-4">
                        <div className="flex items-center justify-between gap-3">
                          <CardTitle className="text-soft-coral flex items-center gap-2 text-lg">
                            <Salad className="w-5 h-5 text-mint-green" />
                            Diet Plans
                          </CardTitle>
                          <Badge className="bg-mint-green/10 text-mint-green hover:bg-mint-green/15 rounded-full">
                            {recentDietPlans.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-cool-gray/10 [&>*:first-child]:pt-2 sm:[&>*:first-child]:pt-3">
                          {recentDietPlans.map((plan) => (
                            <div key={plan.id} className="p-4 sm:p-5 hover:bg-cool-gray/5 transition-colors">
                              <div className="flex items-start gap-4">
                                <div className="w-14 shrink-0 rounded-2xl bg-mint-green/10 border border-mint-green/15 p-2 text-center">
                                  <p className="text-[10px] uppercase tracking-wide text-soft-coral font-bold">Start</p>
                                  <p className="text-lg font-bold text-dark-slate-gray leading-none">{formatDayNumber(plan.start_date)}</p>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                      <p className="font-semibold text-soft-blue text-sm sm:text-base">Diet Plan</p>
                                      <p className="text-xs text-muted-foreground mt-1">{formatCardDate(plan.start_date)} to {formatCardDate(plan.end_date)}</p>
                                    </div>
                                    <Badge className="bg-mint-green/15 text-mint-green hover:bg-mint-green/20 rounded-full px-3">
                                      {plan.daily_calories ? `${plan.daily_calories} cal` : "Active"}
                                    </Badge>
                                  </div>
                                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span className="rounded-full bg-cool-gray/10 px-2.5 py-1">Valid till {formatCardDate(plan.end_date)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {recentLabBookings.length > 0 && (
                    <Card className="overflow-hidden rounded-3xl border border-mint-green/15 shadow-sm bg-white xl:col-span-2">
                      <CardHeader className="border-b border-mint-green/10 bg-white py-4">
                        <div className="flex items-center justify-between gap-3">
                          <CardTitle className="text-soft-coral flex items-center gap-2 text-lg">
                            <TestTube className="w-5 h-5 text-mint-green" />
                            Lab Bookings
                          </CardTitle>
                          <Badge className="bg-mint-green/10 text-mint-green hover:bg-mint-green/15 rounded-full">
                            {recentLabBookings.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-cool-gray/10 [&>*:first-child]:pt-2 sm:[&>*:first-child]:pt-3">
                          {recentLabBookings.map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-cool-gray/5 transition-colors">
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="w-14 shrink-0 rounded-2xl bg-mint-green/10 border border-mint-green/15 p-2 text-center">
                                  <p className="text-[10px] uppercase tracking-wide text-soft-coral font-bold">Lab</p>
                                  <p className="text-lg font-bold text-dark-slate-gray leading-none">{formatDayNumber(booking.scheduled_date)}</p>
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-soft-blue text-sm sm:text-base">Lab Booking</p>
                                  <p className="text-xs text-muted-foreground mt-1">{formatCardDate(booking.scheduled_date)} - {booking.scheduled_time}</p>
                                  <p className="text-[11px] text-muted-foreground mt-2 truncate max-w-[240px] sm:max-w-md">{booking.location}</p>
                                </div>
                              </div>
                              <Badge className={booking.status === "completed" ? "bg-mint-green/15 text-mint-green hover:bg-mint-green/20 rounded-full px-3" : "bg-yellow-400/15 text-yellow-700 hover:bg-yellow-400/20 rounded-full px-3"}>
                                {booking.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {unlinkedReviews.length > 0 && (
                    <Card className="overflow-hidden rounded-3xl border border-yellow-400/20 shadow-sm bg-white xl:col-span-2">
                      <CardHeader className="bg-gradient-to-r from-yellow-400/10 to-transparent border-b border-yellow-400/10 pb-4">
                        <div className="flex items-center justify-between gap-3">
                          <CardTitle className="text-soft-coral flex items-center gap-2 text-lg">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            Unlinked Reviews
                          </CardTitle>
                          <Badge className="bg-yellow-400/10 text-yellow-700 hover:bg-yellow-400/15 rounded-full">
                            {unlinkedReviews.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-cool-gray/10 [&>*:first-child]:pt-3 sm:[&>*:first-child]:pt-4">
                          {unlinkedReviews.map((review) => {
                            return (
                              <div key={review.id} className="p-4 sm:p-5 hover:bg-cool-gray/5 transition-colors">
                                <div className="flex flex-col gap-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <Badge className="bg-yellow-400/15 text-yellow-700 hover:bg-yellow-400/20 rounded-full capitalize">
                                          {review.provider_role || worker.role}
                                        </Badge>
                                        <Badge className="bg-soft-blue/10 text-soft-blue hover:bg-soft-blue/15 rounded-full">
                                          {review.rating}/5
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-2">{formatCardDateTime(review.created_at)}</p>
                                    </div>
                                  </div>

                                  <div className="rounded-2xl border border-cool-gray/10 bg-snow-white p-4 text-sm text-dark-slate-gray whitespace-pre-wrap leading-relaxed">
                                    {review.review_text || "No review text provided."}
                                  </div>

                                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-soft-blue/5 border border-soft-blue/10 px-4 py-3">
                                    <div className="min-w-0">
                                      <p className="text-xs font-semibold uppercase tracking-wide text-soft-blue">Appointment</p>
                                      <p className="text-sm text-muted-foreground mt-1">No matching appointment is available in the recent activity list.</p>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* ── Patient Reports & Warn ──────────────────────────────────────── */}
            {/* <PatientReportsSection workerId={worker.id} workerName={worker.name} /> */}
      </div>
    </div>
  )
}
