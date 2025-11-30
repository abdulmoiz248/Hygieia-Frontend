"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Filter, FileText, File, MapPin, Link as LinkIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {  CalendarComponent } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Loader from "@/components/loader/loader"



import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/patient/store"
import { cancelAppointment, fetchAppointments } from "@/types/patient/appointmentsSlice"
import { Appointment, AppointmentMode } from "@/types/patient/appointment"
import { useRouter } from "next/navigation"
import { patientDestructive } from "@/toasts/PatientToast"
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Extended mock data with meeting remarks


export default function AppointmentsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { appointments, loading, error } = useSelector((state: RootState) => state.appointments)
  const router=useRouter()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

 const user=useSelector((state:RootState)=>state.profile)
 const patientId=user.id 

  useEffect(() => {
   
    if(appointments.length==0) dispatch(fetchAppointments(patientId!))
  }, [dispatch, patientId])

  if (loading)  {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader />
    </div>
  )
}
  if (error) return <p>Error: {error}</p>

const handleDownloadAppointmentSchedulePdf = async () => {
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

    const createWatermarkDataUrl = async (url: string, opacity: number, width: number, height: number): Promise<string> => {
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
      watermarkDataUrl = await createWatermarkDataUrl("/logo/logo.png", 0.05, pageWidth * 0.5, pageHeight * 0.5)
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
      doc.text("Appointment Schedule", pageWidth - M.right, 64, { align: "right" })
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
        ["Patient Name", user?.name || "-"],
        ["Patient Email", user?.email || "-"],
        ["Patient Contact", user?.phone || "-"],
      ],
      didDrawPage: pageContentHook,
    })

    cursorY = jsDoc.lastAutoTable.finalY + 30

    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.setTextColor(...primaryColor)
    doc.text("Upcoming Appointments", M.left, cursorY - 10)

    if (!appointments || appointments.length === 0) {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      doc.setTextColor(...grayText)
      doc.text("No appointments found.", M.left, cursorY + 10)
    } else {
      const sortedAppointments = [...appointments].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      const body = sortedAppointments.map((a, i) => [
        i + 1,
        `${a.doctor?.name || "-"} (${a.type})`,
        new Date(a.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        a.time,
        a.mode,
        a.status,
      ])

      autoTable(doc, {
        startY: cursorY + 8,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 6 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
        head: [["#", "Doctor", "Date", "Time", "Mode", "Status"]],
        body,
        didDrawPage: pageContentHook,
      })
    }

    const safeName = (user?.name || "patient").replace(/\s+/g, "_")
    doc.save(`${safeName}_appointment_schedule.pdf`)
  } catch (err) {
    console.error("PDF generation error:", err)
  }
}


  
    const handleDownload = () => {
    if (!selectedAppointment?.report) return
    const link = document.createElement("a")
    link.href = selectedAppointment.report
    link.download =  "appointment-report.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const filteredAppointments = appointments
    .filter((appointment) => {
      if (statusFilter === "all") return true
      return appointment.status === statusFilter
    })
    .filter((appointment) => appointment.status !== "cancelled")
    .sort((a, b) => {
      // Sort upcoming appointments first, then completed
      if (a.status === "upcoming" && b.status !== "upcoming") return -1
      if (a.status !== "upcoming" && b.status === "upcoming") return 1
      // Within same status, sort by date (earliest first for upcoming, latest first for completed)
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return a.status === "upcoming" ? dateA - dateB : dateB - dateA
    })

  // Add appointment dates for calendar
  const appointmentDates = appointments.map((apt) => new Date(apt.date))

   const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-soft-blue text-white"
      case "completed":
        return "bg-mint-green text-white"
      case "cancelled":
        return "bg-soft-coral text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div
  variants={itemVariants}
  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0"
>
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-soft-coral">Appointments</h1>
    <p className="text-cool-gray text-sm md:text-base">Manage your medical appointments</p>
  </div>

  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-full sm:w-48">
        <Filter className="w-4 h-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-snow-white">
        <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="all">
          All Appointments
        </SelectItem>
        <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="upcoming">
          Upcoming
        </SelectItem>
        <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="completed">
          Completed
        </SelectItem>
        <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="cancelled">
          Cancelled
        </SelectItem>
      </SelectContent>
    </Select>

    <Button className="w-full sm:w-auto bg-mint-green hover:bg-mint-green/90 text-white" asChild>
      <Link href="/patient/appointments/new">New Appointment</Link>
    </Button>
  </div>
</motion.div>


    
        <motion.div variants={itemVariants} className="bg-white/40">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-mint-green" />
                Appointments Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="w-full flex justify-center">
  <div className="w-full max-w-full overflow-x-auto">
    <CalendarComponent
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      className="rounded-5 border w-[70vh] p-0 m-0 min-w-[280px] sm:min-w-[350px] md:min-w-[400px]"
      modifiers={{
        appointment: appointmentDates,
      }}
      showOutsideDays={false}
      modifiersStyles={{
        appointment: {
          backgroundColor: "var(--soft-blue)",
          color: "white",
          borderRadius: "50%",
        },
      }}
    />
  </div>
</div>

                <div>
                  <h3 className="font-bold mb-4 text-soft-blue">
                    {selectedDate ? `Appointments on ${selectedDate.toLocaleDateString()}` : "Select a date"}
                  </h3>
                  {selectedDate && (
                    <div className="space-y-3">
                      {appointments
                        .filter((apt) => new Date(apt.date).toDateString() === selectedDate.toDateString())
                        .map((appointment) => (
                        <div
  key={appointment.id}
  className="p-4  bg-cool-gray/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 w-full max-w-md mx-auto sm:max-w-full"
>
  <div className="flex items-start sm:items-center sm:flex-row flex-col gap-4 ">
    <Avatar className="w-12 h-12 shrink-0">
      <AvatarImage src={appointment.doctor?.img || "/placeholder.svg"} />
      <AvatarFallback>
        {appointment.doctor?.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>

    <div className="flex-1 space-y-1">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="font-semibold text-base text-dark-slate-gray break-words">
          {appointment.doctor.name}
        </h4>
        <Badge className={`${getStatusColor(appointment.status)} text-xs px-2 py-0.5`}>
          {appointment.status}
        </Badge>
      </div>
      <p className="text-sm text-cool-gray">{appointment.time}</p>
    </div>
  </div>
</div>

                        ))}
                      {appointments.filter(
                        (apt) => new Date(apt.date).toDateString() === selectedDate?.toDateString(),
                      ).length === 0 && <p className="text-cool-gray text-center py-8">No appointments on this date</p>}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      

      {/* Appointments List */}
    <motion.div variants={itemVariants}>
  <Card className="bg-white/40">
    <CardHeader>
     

          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
       <CardTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
        <Clock className="w-5 h-5 text-mint-green" />
        Your Appointments
        <span className="text-mint-green">({filteredAppointments.length})</span>
      </CardTitle>
        <Button
          size="sm"
          className="text-snow-white bg-soft-blue border border-soft-blue hover:bg-soft-blue/90 hover:text-snow-white"
          onClick={async () => {
            await handleDownloadAppointmentSchedulePdf()
          }}
        >
          <File className="w-4 h-4 mr-2" />
          Download Schedule
        </Button>
      </CardHeader>
    </CardHeader>

    <CardContent className="space-y-4">
      {filteredAppointments.map((appointment) => (
        <motion.div
          key={appointment.id}
          whileHover={{ scale: 1.02 }}
          className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer  bg-cool-gray/10"
          onClick={() => setSelectedAppointment(appointment)}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex gap-4">
              <Avatar className="w-12 h-12 shrink-0">
                <AvatarImage src={appointment.doctor?.img || "/placeholder.svg"} />
                <AvatarFallback>
                  {appointment.doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 text-sm">
                <h3 className="font-semibold text-soft-blue text-base sm:text-lg">
                  {appointment.doctor.name}
                </h3>
                <p className="text-soft-coral">{appointment.notes}</p>

                <div className="flex flex-wrap items-center gap-2 text-cool-gray mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-mint-green" />
                    {new Date(appointment.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-mint-green" />
                    {appointment.time.slice(0, 5)}
                  </div>
                  {/* Location for physical appointments */}
                  {appointment.mode === AppointmentMode.Physical && appointment.location && (
                    <div className="flex items-center gap-1 text-mint-green">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{appointment.location}</span>
                    </div>
                  )}
                  {/* Join link for online appointments */}
                  {appointment.mode === AppointmentMode.Online && appointment.link && appointment.status === "upcoming" && (
                    <a
                      href={appointment.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-soft-blue hover:text-soft-blue/80 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span className="text-sm font-medium underline">Join Meeting</span>
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                  <Badge variant="outline">{appointment.type}</Badge>
                  {appointment.report && (
                    <Badge className="bg-soft-blue text-snow-white">
                      <FileText className="w-3 h-3 mr-1" />
                      Report Available
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {appointment.status === "upcoming" && (
              <div className="flex gap-2 sm:justify-end justify-start flex-wrap mt-2 sm:mt-0">
                <Button
                className="bg-soft-blue text-snow-white hover:bg-soft-blue/90"  size="sm">
                  Reschedule
                </Button>
                <Button
                
                  size="sm"
                  className="text-white bg-soft-coral hover:bg-soft-coral/90 hover:text-black border-0"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {filteredAppointments.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-soft-coral mx-auto mb-4" />
          <p className="text-cool-gray">No appointments found</p>
          <Button
            variant="outline"
            className="mt-2 bg-soft-blue text-snow-white hover:bg-soft-blue/90"
            asChild
          >
            <Link href="/patient/appointments/new">Book Your First Appointment</Link>
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
</motion.div>

      {/* Appointment Details Modal */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-snow-white">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedAppointment.doctor?.img || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedAppointment.doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedAppointment.doctor?.name}</h2>
                    <p className="text-cool-gray font-normal">{selectedAppointment.notes}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Appointment Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cool-gray" />
                    <span className="text-sm">
                      <strong>Date:</strong> {new Date(selectedAppointment.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cool-gray" />
                    <span className="text-sm">
                      <strong>Time:</strong> {selectedAppointment.time.slice(0, 5)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(selectedAppointment.status)}>{selectedAppointment.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedAppointment.type}</Badge>
                  </div>
                  {/* Location for physical appointments */}
                  {selectedAppointment.mode === AppointmentMode.Physical && selectedAppointment.location && (
                    <div className="col-span-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-mint-green" />
                      <span className="text-sm">
                        <strong>Location:</strong> {selectedAppointment.location}
                      </span>
                    </div>
                  )}
                  {/* Join link for online appointments */}
                  {selectedAppointment.mode === AppointmentMode.Online && selectedAppointment.link && selectedAppointment.status === "upcoming" && (
                    <div className="col-span-2 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-soft-blue" />
                      <span className="text-sm">
                        <strong>Meeting Link:</strong>{" "}
                        <a
                          href={selectedAppointment.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-soft-blue hover:text-soft-blue/80 underline"
                        >
                          Join Meeting
                        </a>
                      </span>
                    </div>
                  )}
                </div>

         
             

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  {selectedAppointment.status === "upcoming" && (
                    <>
                      <Button  onClick={()=>{
                        //real
                         localStorage.setItem('reschedule',selectedAppointment.id)
                        router.push('/patient/appointments/new')
                     
                      }}
                      className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-snow-white">Reschedule</Button>
                      <Button
                      className="bg-soft-coral hover:bg-soft-coral/90 text-snow-white border-0"
                      onClick={()=>{
                        dispatch(cancelAppointment(selectedAppointment.id))
                        
                        setSelectedAppointment(null)
                        patientDestructive(`Appointment with ${selectedAppointment.doctor?.name} Cancelled Successfully`) 
                      }
                      
}>Cancel</Button>
                    </>
                  )}
                  {selectedAppointment.status === "completed" && selectedAppointment.report && (
                    <>
                      <Button onClick={handleDownload}
                      className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-snow-white">
                        <FileText className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                      <Button 
                      className="hover:bg-mint-green hover:text-snow-white bg-transparent text-dark-slate-gray border border-dark-slate-gray hover:border-mint-green"
                       onClick={()=>{
                        localStorage.setItem('appointment',selectedAppointment.id)
                        router.push('/patient/appointments/new')
                       }}
                       
                      >Book Follow-up</Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
