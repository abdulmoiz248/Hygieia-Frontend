"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
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
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { Worker } from "@/types/admin/workers"
import type { WorkerReport } from "@/hooks/admin/workers/useWorkerReport"
import { ROLE_CONFIG } from "@/types/admin/workers"
import { WorkerAnalyticsCharts } from "./WorkerAnalyticsCharts"

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

// ─── Props ────────────────────────────────────────────────────────────────────
interface WorkerReportPageProps {
  worker: Worker
  report: WorkerReport | null
  isLoading: boolean
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WorkerReportPage({ worker, report, isLoading }: WorkerReportPageProps) {
  const router = useRouter()
  const cfg = ROLE_CONFIG[worker.role] || { label: worker.role }
  const RoleIcon = ROLE_ICONS[worker.role] ?? Stethoscope
  const [pdfLoading, setPdfLoading] = useState(false)

  // Handle nested or flat metrics
  const compRate = report?.metrics?.efficiency?.completionRatePercentage ?? report?.metrics?.completionRate ?? 0
  
  // Details
  const workerName = report?.detailed?.profile?.name || worker.name
  const workerAvatar = report?.detailed?.profile?.img || worker.img || ""
  const workerPhone = report?.detailed?.profile?.phone

  // Unread notifications
  const unreadCount = report?.overview?.notifications?.unread ?? report?.overview?.unreadNotifications ?? 0

  // ── PDF ────────────────────────────────────────────────────────────────────
  const handleDownloadPdf = async () => {
    if (!report) return
    setPdfLoading(true)
    try {
      const { default: jsPDF } = await import("jspdf")
      const autoTable = (await import("jspdf-autotable")).default
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

      const nowDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      const nowTime = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

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
        d.text(`Generated: ${nowDate} • ${nowTime}`, pageWidth - M.right, 80, { align: "right" })
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
        autoTable(doc, {
          startY: cursorY,
          theme: "grid",
          styles: { fontSize: 11, cellPadding: 6 },
          headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
          head: [["#", "AI Insight"]],
          body: report.insights.map((ins, i) => [String(i + 1), ins]),
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
  
  let metric3Label = "Unique Patients"
  let metric3Value = report?.metrics?.core?.uniquePatients ?? report?.metrics?.uniquePatients ?? report?.overview?.patients?.totalUniquePatients ?? 0
  
  let metric4Label = "Avg Rating"
  let metric4Value = report?.metrics?.core?.averageRating ?? report?.metrics?.averageRating ?? "-"
  let Metric4Icon = Star
//@ts-ignore
  if (worker.role === "lab_technician" || worker.role === "pathologist") {
    metric1Label = "Lab Bookings"
    metric1Value = report?.metrics?.core?.totalLabBookings ?? report?.metrics?.totalLabBookings ?? 0
    Metric1Icon = TestTube
    metric2Value = report?.metrics?.core?.completedBookings ?? report?.metrics?.completedBookings ?? 0
    metric4Label = "Pending Tests"
    metric4Value = report?.metrics?.core?.pendingBookings ?? report?.metrics?.pendingBookings ?? 0
    Metric4Icon = Clock
  } else if (worker.role === "doctor") {
    metric1Label = "Prescriptions"
    metric1Value = report?.metrics?.core?.totalPrescriptions ?? report?.metrics?.totalPrescriptions ?? 0
    Metric1Icon = Pill
    metric2Value = report?.metrics?.core?.completedPrescriptions ?? report?.metrics?.completedPrescriptions ?? 0
  }

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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* ── Left Column (Profile & Action) ────────────────────────────────────── */}
          <div className="xl:col-span-1 space-y-6">
            
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
                        <p className="text-sm text-muted-foreground break-all">{report?.worker?.email || report?.workerDetails?.profile?.email}</p>
                        {workerPhone && <p className="text-sm text-muted-foreground">{workerPhone}</p>}
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
            <Card className="hover-lift border-accent/20 rounded-2xl shadow-sm">
              <CardHeader className="bg-accent/5 pb-4 border-b border-accent/10">
                <CardTitle className="text-soft-coral flex items-center gap-2 text-lg">
                  <Download className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Button
                  onClick={handleDownloadPdf}
                  disabled={pdfLoading || isLoading || !report}
                  className="w-full bg-soft-coral hover:bg-soft-coral/90 text-snow-white flex items-center justify-center gap-2 h-12 rounded-xl transition-all"
                >
                  {pdfLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> <span>Generating...</span></>
                  ) : (
                    <><Download className="w-5 h-5" /> <span>Download PDF Report</span></>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Completion Progress & Alerts */}
            <Card className="hover-lift rounded-2xl shadow-sm">
              <CardHeader className="bg-white pb-2">
                <CardTitle className="text-soft-coral flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-4 space-y-6">
                
                <div className="space-y-4">
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
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-soft-coral/20">
                    <AlertTriangle className="h-5 w-5 mt-0.5 text-soft-coral shrink-0" />
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
          </div>

          {/* ── Right Column (Analytics & Detailed Metrics) ──────────────────────── */}
          <div className="xl:col-span-3 space-y-8">

            {/* Summary Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-soft-blue bg-white shadow-sm hover-lift rounded-xl">
                <CardContent className="p-4 sm:p-6 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Metric1Icon className="h-4 w-4 text-soft-blue" />
                    <span className="text-sm font-medium text-dark-slate-gray whitespace-nowrap">{metric1Label}</span>
                  </div>
                  {isLoading ? (
                    <Skel w="w-12" h="h-8" className="mx-auto" />
                  ) : (
                    <p className="text-3xl font-bold text-soft-blue">{metric1Value}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-mint-green bg-white shadow-sm hover-lift rounded-xl">
                <CardContent className="p-4 sm:p-6 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-mint-green" />
                    <span className="text-sm font-medium text-dark-slate-gray whitespace-nowrap">{metric2Label}</span>
                  </div>
                  {isLoading ? (
                    <Skel w="w-12" h="h-8" className="mx-auto" />
                  ) : (
                    <p className="text-3xl font-bold text-mint-green">{metric2Value}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-soft-coral bg-white shadow-sm hover-lift rounded-xl">
                <CardContent className="p-4 sm:p-6 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4 text-soft-coral" />
                    <span className="text-sm font-medium text-dark-slate-gray whitespace-nowrap">{metric3Label}</span>
                  </div>
                  {isLoading ? (
                    <Skel w="w-12" h="h-8" className="mx-auto" />
                  ) : (
                    <p className="text-3xl font-bold text-soft-coral">{metric3Value}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-400 bg-white shadow-sm hover-lift rounded-xl">
                <CardContent className="p-4 sm:p-6 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Metric4Icon className={`h-4 w-4 ${Metric4Icon === Star ? "text-yellow-500 fill-current" : "text-yellow-500"}`} />
                    <span className="text-sm font-medium text-dark-slate-gray whitespace-nowrap">{metric4Label}</span>
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

            {/* AI Insights & Recommendations (Minimalistic) */}
         <Card className="hover-lift border-accent/10 shadow-sm rounded-xl">
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
                    <ul className="space-y-3">
                      {report.insights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-dark-slate-gray">
                          <span className="text-soft-blue mt-0.5">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No insights available.</p>
                  )}
                </CardContent>
              </Card>

            
           

            {/* Recent Activity */}
            {(!isLoading && report?.recentActivity) && (
              <div className="space-y-4 max-w-2xl mx-auto w-full">
                {report.recentActivity.appointments && report.recentActivity.appointments.length > 0 && (
                  <Card className="hover-lift border-secondary/20 overflow-hidden shadow-md rounded-2xl">
                    <CardHeader className="bg-cool-gray/5 border-b">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-soft-coral flex items-center gap-2 text-lg">
                          <Calendar className="w-5 h-5" />
                          Recent Appointments
                        </CardTitle>
                        <Badge variant="outline" className="border-secondary text-soft-blue">
                          {report.recentActivity.appointments.length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-cool-gray/10">
                        {report.recentActivity.appointments.map((apt) => (
                          <div key={apt.id} className="flex items-center justify-between p-4 hover:bg-cool-gray/5 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="bg-white p-2 rounded-lg shadow-sm border border-cool-gray/10 text-center shrink-0 w-14">
                                <p className="text-[10px] text-soft-coral font-bold uppercase">{new Date(apt.date).toLocaleDateString("en-US", { month: "short" })}</p>
                                <p className="text-lg font-bold text-dark-slate-gray leading-none">{new Date(apt.date).getDate()}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-soft-blue capitalize text-sm">{apt.type}</p>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                  <Clock className="w-3 h-3" /> {apt.time}
                                </div>
                              </div>
                            </div>
                            <Badge className={apt.status === "completed" ? "bg-mint-green/20 text-mint-green hover:bg-mint-green/30" : apt.status === "upcoming" ? "bg-soft-blue/20 text-soft-blue hover:bg-soft-blue/30" : "bg-soft-coral/20 text-soft-coral hover:bg-soft-coral/30"}>
                              {apt.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {report.recentActivity.labBookings && report.recentActivity.labBookings.length > 0 && (
                  <Card className="hover-lift border-secondary/20 overflow-hidden shadow-md rounded-2xl">
                    <CardHeader className="bg-cool-gray/5 border-b">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-soft-coral flex items-center gap-2 text-lg">
                          <TestTube className="w-5 h-5 text-mint-green" />
                          Recent Lab Bookings
                        </CardTitle>
                        <Badge variant="outline" className="border-secondary text-soft-blue">
                          {report.recentActivity.labBookings.length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-cool-gray/10">
                        {report.recentActivity.labBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 hover:bg-cool-gray/5 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="bg-white p-2 rounded-lg shadow-sm border border-cool-gray/10 text-center shrink-0 w-14">
                                <p className="text-[10px] text-soft-coral font-bold uppercase">{new Date(booking.scheduled_date).toLocaleDateString("en-US", { month: "short" })}</p>
                                <p className="text-lg font-bold text-dark-slate-gray leading-none">{new Date(booking.scheduled_date).getDate()}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-soft-blue text-sm">Lab Test #{booking.test_id.slice(0, 6)}</p>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                  <Clock className="w-3 h-3" /> {booking.scheduled_time}
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[150px] sm:max-w-xs">{booking.location}</p>
                              </div>
                            </div>
                            <Badge className={booking.status === "completed" ? "bg-mint-green/20 text-mint-green hover:bg-mint-green/30" : "bg-yellow-400/20 text-yellow-600 hover:bg-yellow-400/30"}>
                              {booking.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {report.recentActivity.prescriptions && report.recentActivity.prescriptions.length > 0 && (
                  <Card className="hover-lift border-secondary/20 overflow-hidden shadow-md rounded-2xl">
                    <CardHeader className="bg-cool-gray/5 border-b">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-soft-coral flex items-center gap-2 text-lg">
                          <Pill className="w-5 h-5 text-soft-coral" />
                          Recent Prescriptions
                        </CardTitle>
                        <Badge variant="outline" className="border-secondary text-soft-blue">
                          {report.recentActivity.prescriptions.length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-cool-gray/10">
                        {report.recentActivity.prescriptions.map((rx) => (
                          <div key={rx.id} className="flex items-center justify-between p-4 hover:bg-cool-gray/5 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="bg-white p-2 rounded-lg shadow-sm border border-cool-gray/10 text-center shrink-0 w-14">
                                <p className="text-[10px] text-soft-coral font-bold uppercase">{new Date(rx.start_date).toLocaleDateString("en-US", { month: "short" })}</p>
                                <p className="text-lg font-bold text-dark-slate-gray leading-none">{new Date(rx.start_date).getDate()}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-soft-blue text-sm">Prescription #{rx.id.slice(0, 8)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Valid till: {new Date(rx.end_date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Badge className={rx.status === "completed" ? "bg-mint-green/20 text-mint-green hover:bg-mint-green/30" : "bg-soft-blue/20 text-soft-blue hover:bg-soft-blue/30"}>
                              {rx.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}