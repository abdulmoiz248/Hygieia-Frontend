"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Calendar, Clock, File, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BookedLabTest } from "@/types/patient/lab"
import { useEffect, useState } from "react"
import { patientDestructive } from "@/toasts/PatientToast"
import { formatDateOnly } from "@/helpers/date"
import { usePatientLabTestsStore } from "@/store/patient/lab-tests-store"
import { usePatientProfileStore } from "@/store/patient/profile-store"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function LabBookingsSection() {
  const profile = usePatientProfileStore((state) => state.profile)
  const { bookedTests, fetchBookedTests, cancelLabTest } = usePatientLabTestsStore()

  const [selectTestModal, setSelectedTestModal] = useState<BookedLabTest | null>(null)

  const pendingTests = bookedTests.filter((test) => test.status === "pending")

  useEffect(() => {
    fetchBookedTests()
  }, [fetchBookedTests])

  const handleDownloadLabSchedulePdf = async () => {
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
      const headerHeight = 120

      const getBase64FromUrl = async (url: string): Promise<string> => {
        const res = await fetch(url)
        const blob = await res.blob()
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }

      const createWatermarkDataUrl = async (
        url: string,
        opacity: number,
        width: number,
        height: number
      ): Promise<string> => {
        const img = new Image()
        img.src = url
        await new Promise((res, rej) => {
          img.onload = res
          img.onerror = rej
        })
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")!
        ctx.globalAlpha = opacity
        ctx.drawImage(img, 0, 0, width, height)
        return canvas.toDataURL("image/png")
      }

      let logoDataUrl: string | null = null
      let watermarkDataUrl: string | null = null
      try {
        logoDataUrl = await getBase64FromUrl("/logo/logo.png")
        watermarkDataUrl = await createWatermarkDataUrl(
          "/logo/logo.png",
          0.05,
          pageWidth * 0.5,
          pageHeight * 0.5
        )
      } catch {}

      const now = new Date()
      const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

      const hospitalName = "Hygieia"
      const hospitalTagline = "From Past to Future of Healthcare"
      const hospitalAddress = "www.hygieia-frontend.vercel.app"
      const hospitalContact = "+92 80 1234 5678 • hygieia.fyp@gmail.com"

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
        doc.text("Lab Test Schedule", pageWidth - M.right, 64, { align: "right" })
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Generated: ${dateStr} • ${timeStr}`, pageWidth - M.right, 80, { align: "right" })
        doc.setDrawColor(...primaryColor)
        doc.setLineWidth(2)
        doc.line(M.left, headerHeight, pageWidth - M.right, headerHeight)
      }

      const drawFooter = (doc: any, pageNumber: number, pageCount: number) => {
        doc.setDrawColor(...primaryColor)
        doc.setLineWidth(2)
        doc.line(M.left, pageHeight - M.bottom, pageWidth - M.right, pageHeight - M.bottom)
        const disclaimer =
          "This document is computer-generated and may contain confidential information. If you are not the intended recipient, please delete it."
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
        const wmW = pageWidth * 0.45
        const wmH = pageHeight * 0.45
        const x = (pageWidth - wmW) / 2
        const y = (pageHeight - wmH) / 2
        doc.addImage(watermarkDataUrl, "PNG", x, y, wmW, wmH)
      }

      const pageContentHook = () => {
        drawWatermark(doc)
        drawHeader(doc)
        const pageNumber = jsDoc.internal.getCurrentPageInfo().pageNumber
        const pageCount = jsDoc.internal.getNumberOfPages()
        drawFooter(doc, pageNumber, pageCount)
      }

      let cursorY = M.top
      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.setTextColor(...primaryColor)
      doc.text("Patient Information", M.left, cursorY - 16)

      autoTable(doc, {
        startY: cursorY,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 6 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
        head: [["Field", "Details"]],
        body: [
          ["Patient Name", profile?.name || "-"],
          ["Patient Email", profile?.email || "-"],
          ["Patient Contact", profile?.phone || "-"],
        ],
        didDrawPage: pageContentHook,
      })

      cursorY = jsDoc.lastAutoTable.finalY + 30
      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.setTextColor(...primaryColor)
      doc.text("Scheduled Lab Tests", M.left, cursorY - 10)

      if (!pendingTests || pendingTests.length === 0) {
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        doc.setTextColor(...grayText)
        doc.text("No pending lab tests found.", M.left, cursorY + 10)
      } else {
        const sortedTests = [...pendingTests].sort(
          (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
        )
        const body = sortedTests.map((t, i) => [
          i + 1,
          t.testName,
          new Date(t.scheduledDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          t.scheduledTime,
          t.status,
          t.location,
        ])
        autoTable(doc, {
          startY: cursorY + 8,
          theme: "grid",
          styles: { fontSize: 11, cellPadding: 6 },
          headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
          head: [["#", "Test Name", "Date", "Time", "Status", "Location"]],
          body,
          didDrawPage: pageContentHook,
        })
      }

      const safeName = (profile?.name || "patient").replace(/\s+/g, "_")
      doc.save(`${safeName}_lab_schedule.pdf`)
    } catch (err) {
      console.error("PDF generation error:", err)
    }
  }

  const handleCancelTest = (testId: string) => {
    cancelLabTest(testId)
  }

  // Always render the section heading; show empty state if no pending tests
  return (
    <div className="space-y-6">
      {/* Section heading */}
      <div>
        <h1 className="text-3xl font-bold text-soft-coral">Lab Bookings</h1>
        <p className="text-cool-gray">View your lab bookings here</p>
      </div>

      {pendingTests.length === 0 ? (
        /* ── Empty state ── */
        <div className="rounded-2xl border border-dashed border-cool-gray/40 bg-white/40 py-14 text-center">
          <Calendar className="mx-auto h-12 w-12 text-cool-gray/50 mb-3" />
          <p className="text-lg font-semibold text-gray-600">No lab bookings yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Use the &quot;Browse Lab Tests&quot; button above to schedule a test.
          </p>
        </div>
      ) : (
        /* ── Booked tests card ── */
        <motion.div variants={itemVariants}>
          <Card className="bg-white/40">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-soft-coral" />
                Pending Lab Tests ({pendingTests.length})
              </CardTitle>
              <Button
                size="sm"
                className="text-snow-white bg-soft-blue border border-soft-blue hover:bg-soft-blue/90"
                onClick={handleDownloadLabSchedulePdf}
              >
                <File className="w-4 h-4 mr-2" />
                Download Schedule
              </Button>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {pendingTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-4 bg-cool-gray/10 rounded-lg border border-blue-200"
                  >
                    {/* Left: test info */}
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-soft-blue">{test.testName}</h4>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-dark-slate-gray">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-soft-coral" />
                          {formatDateOnly(test.scheduledDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-soft-coral" />
                          {test.scheduledTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-soft-coral" />
                          {test.location}
                        </span>
                      </div>

                      {/* ── Preparation instructions (actually rendered) ── */}
                      {Array.isArray(test.instructions) && test.instructions.filter((i: string) => i?.trim()).length > 0 && (
                        <div className="mt-2 rounded-lg bg-mint-green/10 border border-mint-green/30 p-3">
                          <p className="text-sm font-semibold text-mint-green mb-1">
                            Preparation Instructions
                          </p>
                          <ul className="list-disc list-inside space-y-0.5">
                            {test.instructions.filter((i: string) => i?.trim()).map((instruction: string, index: number) => (
                              <li key={index} className="text-sm text-dark-slate-gray">
                                {instruction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Right: cancel button only */}
                    <div className="flex shrink-0 items-start md:items-center">
                      <Button
                        size="sm"
                        onClick={() => setSelectedTestModal(test)}
                        className="text-snow-white bg-soft-coral hover:bg-soft-coral/90"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Cancel confirmation dialog */}
      {selectTestModal && (
        <Dialog open onOpenChange={() => setSelectedTestModal(null)}>
          <DialogContent className="backdrop-blur-md bg-snow-white border rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg text-soft-blue font-bold">
                Cancel Test: {selectTestModal.testName}
              </DialogTitle>
              <DialogDescription className="text-gray-700 mt-1">
                Are you sure you want to cancel this test scheduled on{" "}
                <strong>
                  {new Date(selectTestModal.scheduledDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>{" "}
                at <strong>{selectTestModal.scheduledTime}</strong>?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="ghost"
                className="bg-soft-blue text-snow-white hover:bg-soft-blue/90"
                onClick={() => setSelectedTestModal(null)}
              >
                No, Go Back
              </Button>
              <Button
                className="bg-soft-coral text-snow-white hover:bg-soft-coral/90"
                onClick={() => {
                  const testName = selectTestModal?.testName
                  handleCancelTest(selectTestModal.id)
                  patientDestructive(`${testName} Cancelled Successfully`)
                  setSelectedTestModal(null)
                }}
              >
                Yes, Cancel It
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}