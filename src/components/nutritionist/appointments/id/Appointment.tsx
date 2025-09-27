"use client"

import { useEffect, useRef, useState } from "react"
import {  useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import Loader from '@/components/loader/loader'
import {
  Calendar,
  Heart,
  FileText,
  ExternalLink,
  Bot,
  ShieldOff,
  Activity,
  Weight,
  Ruler,
  Clock,
  Stethoscope,
  BarChart3,
  Star,
  Target,
  ClipboardList,
} from "lucide-react"
import { AppointmentStatus, type Appointment } from "@/types/patient/appointment"
import { EnhancedFitnessCharts, FitnessData } from "@/components/nutritionist/appointments/id/enhanced-fitness-charts"
import { MedicalRecord } from "@/types"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"
import { DietPlanDialog } from "@/components/nutritionist/appointments/id/diet-plan-dialog"
import { formatDateOnly } from "@/helpers/date"
import LabTests from "@/components/nutritionist/appointments/id/LabTest"
import api from "@/lib/axios"
import { useDietPlanStore } from "@/store/nutritionist/diet-plan-store"
import { generateAIReport } from "./AiReport"




export const fetchPatientAnalytics = async (patientId: string) => {
  const res = await api.get(`/analytics/${patientId}`)
  console.log(res)
  if (!res.data) throw new Error("Failed to fetch analytics")
  return res.data
}


export async function completeNutritionistAppointment(
  appointmentId: string,
  nutritionistId: string,
  payload: {
    referredTestIds?: string[]
    report?: string
    dietPlan?: {
      dailyCalories: string
      protein: string
      carbs: string
      fat: string
      deficiency: string
      notes?: string
      caloriesBurned: string
      exercise: string
      startDate?: string
      endDate?: string
    }
  }
) {
  const { data } = await api.post(`/appointments/${appointmentId}/complete`, {
    dto: payload,
    nutritionistId,
  })
  return data
}

export default function Appointment({appointmentId}:{appointmentId:string}) {
    
    const { addDietPlan } = useDietPlanStore.getState()
    

  const { appointments, fetchAppointments, isLoading,updateAppointmentStatus } = useAppointmentStore()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [isGeneratingAIReport, setIsGeneratingAIReport] = useState(false)
  const [isDownloadingReport, setIsDownloadingReport] = useState(false)
  const [fitnessData, setFitnessData] = useState<FitnessData[]>([])
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [assignedDietPlan, setAssignedDietPlan] = useState<any | null>(null)
  const [referredTests, setReferredTests] = useState<any[]>([])
  const [doctorReport, setDoctorReport] = useState("")
  const [appointmentDone, setAppointmentDone] = useState(false)
  const router=useRouter()

  useEffect(() => {
    if (appointments.length === 0) {
      fetchAppointments(AppointmentStatus.Upcoming)
    }
  }, [appointments.length, fetchAppointments])

  useEffect(() => {
    const foundAppointment = appointments.find((apt) => apt.id === appointmentId)
    if (foundAppointment) setAppointment(foundAppointment)
  }, [appointments, appointmentId])

  useEffect(() => {
    const getData = async () => {
      if (!appointment?.patient?.id) return
      const data = await fetchPatientAnalytics(appointment.patient.id)
      setFitnessData(data.fitness)
      setMedicalRecords(data.medicalRecords)
    }
    if (appointment?.dataShared) getData()
  }, [appointment])

  const handleGenerateAIReport = async() => {
    
    if(!appointment?.dataShared){
      alert("AI Report Cannot be generated because the patient has not shared their data.")
      return
    }
    setIsGeneratingAIReport(true)
    setIsDownloadingReport(true)
    try {
      const report = await generateAIReport(appointment.patient, fitnessData, medicalRecords)
      await generateHealthReportPDF(report, appointment.patient.name)
    } catch (error) {
      console.error("Error generating AI report:", error)
      alert("Failed to generate AI report. Please try again.")
    } finally {
      setIsGeneratingAIReport(false)
      // Keep downloading state for a bit longer to show download completion
      setTimeout(() => setIsDownloadingReport(false), 2000)
    }
  }

  

  const labTestsRef = useRef<HTMLDivElement | null>(null)
  const handleScrollToLabTests = () => {
    labTestsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleAssignDietPlan = (dietPlan: any) => {
    setAssignedDietPlan(dietPlan)
  }

  const handleTestReferral = (referral: any) => {
    setReferredTests((prev) => [...prev, referral])
  }

  const handleMarkAppointmentDone = async() => {
    setAppointmentDone(true)
  await completeNutritionistAppointment(
  appointmentId,
  localStorage.getItem('id')!,
  {
    referredTestIds: referredTests.map(l => l.id), // ✅ use plural
    report: doctorReport,
    dietPlan: assignedDietPlan
  })



    updateAppointmentStatus(appointmentId, AppointmentStatus.Completed)
    // update store reactively
if (assignedDietPlan) {
  addDietPlan({
    ...assignedDietPlan,
    patientId: appointment?.patient.id,
    patientName: appointment?.patient.name
  })
}
    router.push('/nutritionist/appointments')

  }

  const handleRemoveTest = (id: string) => {
    setReferredTests((prev) => prev.filter((t) => t.id !== id))
  }

  const generateHealthReportPDF = async (report: string, patientName: string) => {
    try {
      const { default: jsPDF } = await import("jspdf")
      const autoTable = (await import("jspdf-autotable")).default

      const doc = new jsPDF({ unit: "pt", format: "a4" })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // Primary soft blue color
      const primaryColor: [number, number, number] = [0, 131, 150]
      const softCoral: [number, number, number] = [255, 107, 107]

      // Load logo
      const logoUrl = "/logo/logo.png"
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

      let logoDataUrl: string | null = null
      try {
        logoDataUrl = await getBase64FromUrl(logoUrl)
      } catch (err) {
        console.warn("Logo not loaded:", err)
      }

      // Load watermark
      let watermarkDataUrl: string | null = null
      try {
        watermarkDataUrl = await createWatermarkDataUrl(
          "/logo/logo-2.png",
          0.05,
          pageWidth * 0.5,
          pageHeight * 0.5
        )
      } catch (err) {
        console.warn("Watermark could not be loaded:", err)
      }

      // ===== Header =====
      if (logoDataUrl) {
        doc.addImage(logoDataUrl, "PNG", 40, 25, 50, 50)
      }
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("Nutritionist AI Report", pageWidth / 2, 55, { align: "center" })

      // Subtitle
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(100, 100, 100)
      doc.text("30-Day Data Analysis & Nutritional Insights", pageWidth / 2, 75, { align: "center" })

      // Patient name and date
      doc.setFontSize(11)
      doc.setTextColor(80, 80, 80)
      doc.text(`Patient: ${patientName}`, 40, 95)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 40, 95, { align: "right" })

      // Thin line under header
      doc.setDrawColor(...primaryColor)
      doc.setLineWidth(0.5)
      doc.line(40, 110, pageWidth - 40, 110)

      let cursorY = 130

      // ===== Content =====
      // Split report into sections
      const sections = report.split(/\*\*(.*?)\*\*/g)
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i].trim()
        if (!section) continue

        // Check if this is a section header (odd indices after split)
        if (i % 2 === 1) {
          // Section header with enhanced styling
          doc.setFillColor(240, 248, 255) // Light blue background
          doc.rect(35, cursorY - 10, pageWidth - 70, 25, 'F')
          
          // Border around header
          doc.setDrawColor(...primaryColor)
          doc.setLineWidth(1)
          doc.rect(35, cursorY - 10, pageWidth - 70, 25, 'S')
          
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          doc.setTextColor(...primaryColor)
          doc.text(section, 50, cursorY + 5)
          cursorY += 30
        } else {
          // Section content with better formatting
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(40, 40, 40)
          
          // Process content for better formatting
          const processedContent = processReportContent(section)
          
          for (const paragraph of processedContent) {
            if (paragraph.type === 'bullet') {
              // Bullet points with proper indentation
              doc.setFontSize(8)
              doc.setTextColor(60, 60, 60)
              doc.text('•', 50, cursorY)
              const lines = doc.splitTextToSize(paragraph.text, pageWidth - 120)
              doc.text(lines, 65, cursorY)
              cursorY += lines.length * 10 + 8
            } else if (paragraph.type === 'subheader') {
              // Sub-headers
              doc.setFontSize(10)
              doc.setFont("helvetica", "bold")
              doc.setTextColor(...softCoral)
              doc.text(paragraph.text, 50, cursorY)
              cursorY += 15
            } else {
              // Regular paragraphs
              doc.setFontSize(9)
              doc.setFont("helvetica", "normal")
              doc.setTextColor(40, 40, 40)
              const lines = doc.splitTextToSize(paragraph.text, pageWidth - 100)
              doc.text(lines, 50, cursorY)
              cursorY += lines.length * 11 + 10
            }

            // Check if we need a new page
            if (cursorY > pageHeight - 120) {
              doc.addPage()
              cursorY = 50
            }
          }
          
          cursorY += 15 // Extra space between sections
        }

        // Check if we need a new page
        if (cursorY > pageHeight - 100) {
          doc.addPage()
          cursorY = 50
        }
      }

      // ===== Patient Nutritional Profile =====
      if (appointment?.patient) {
        cursorY += 30
        if (cursorY > pageHeight - 200) {
          doc.addPage()
          cursorY = 50
        }

        // Section separator line
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(1)
        doc.line(40, cursorY - 10, pageWidth - 40, cursorY - 10)

        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(...primaryColor)
        doc.text("Patient Nutritional Profile", 40, cursorY)
        cursorY += 25

        const bmi = (appointment.patient.weight / ((appointment.patient.height / 100) ** 2)).toFixed(1)
        const bmiValue = parseFloat(bmi)
        const bmiCategory = bmiValue < 18.5 ? "Underweight" : bmiValue < 25 ? "Normal" : bmiValue < 30 ? "Overweight" : "Obese"

        const patientData = [
          ["Metric", "Value", "Status"],
          ["Name", appointment.patient.name, ""],
          ["Age", `${new Date().getFullYear() - new Date(appointment.patient.dateOfBirth).getFullYear()} years`, ""],
          ["Gender", appointment.patient.gender, ""],
          ["Weight", `${appointment.patient.weight} kg`, ""],
          ["Height", appointment.patient.height, ""],
          ["BMI", `${bmi}`, bmiCategory],
          ["Blood Type", appointment.patient.bloodType, ""],
          ["Health Score", `${appointment.patient.healthscore}/100`, appointment.patient.healthscore > 70 ? "Good" : "Needs Attention"],
          ["Adherence", appointment.patient.adherence, ""],
          ["Allergies", appointment.patient.allergies || "None", ""],
          ["Conditions", appointment.patient.conditions || "None", ""],
        ]

        autoTable(doc, {
          startY: cursorY,
          body: patientData,
          theme: "grid",
          styles: { 
            fontSize: 9, 
            cellPadding: 6,
            lineColor: [200, 200, 200],
            lineWidth: 0.5
          },
          headStyles: { 
            fillColor: primaryColor, 
            textColor: [255, 255, 255], 
            fontSize: 10,
            fontStyle: 'bold'
          },
          alternateRowStyles: { 
            fillColor: [250, 250, 250] 
          },
          margin: { left: 40, right: 40 },
          tableLineColor: [200, 200, 200],
          tableLineWidth: 0.5
        })

        cursorY = (doc as any).lastAutoTable.finalY + 25
      }

      // ===== 30-Day Data Summary =====
      if (fitnessData && fitnessData.length > 0) {
        cursorY += 20
        if (cursorY > pageHeight - 150) {
          doc.addPage()
          cursorY = 50
        }

        // Section separator line
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(1)
        doc.line(40, cursorY - 10, pageWidth - 40, cursorY - 10)

        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(...primaryColor)
        doc.text("30-Day Data Summary", 40, cursorY)
        cursorY += 25

        // Process fitness data with proper structure
        const fitnessMetrics = [
          {
            name: 'Steps',
            values: fitnessData.map(f => f.steps || 0),
            unit: ' steps'
          },
          {
            name: 'Water Intake',
            values: fitnessData.map(f => f.water || 0),
            unit: ' glasses'
          },
          {
            name: 'Sleep',
            values: fitnessData.map(f => f.sleep || 0),
            unit: ' hours'
          },
          {
            name: 'Calories Burned',
            values: fitnessData.map(f => f.calories_burned || 0),
            unit: ' cal'
          },
          {
            name: 'Calories Intake',
            values: fitnessData.map(f => f.calories_intake || 0),
            unit: ' cal'
          },
          {
            name: 'Protein',
            values: fitnessData.map(f => f.protein || 0),
            unit: 'g'
          },
          {
            name: 'Carbs',
            values: fitnessData.map(f => f.carbs || 0),
            unit: 'g'
          },
          {
            name: 'Fat',
            values: fitnessData.map(f => f.fat || 0),
            unit: 'g'
          }
        ]

        const summaryData = fitnessMetrics.map(metric => {
          const values = metric.values.filter(v => v > 0) // Only non-zero values
          const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : '0.0'
          const min = values.length > 0 ? Math.min(...values).toFixed(1) : '0.0'
          const max = values.length > 0 ? Math.max(...values).toFixed(1) : '0.0'
          
          return [metric.name, `${avg}${metric.unit}`, `${min}-${max}${metric.unit}`, `${fitnessData.length} days`]
        })

        const fitnessSummary = [
          ["Metric Type", "Average", "Range", "Data Points"],
          ...summaryData
        ]

        autoTable(doc, {
          startY: cursorY,
          body: fitnessSummary,
          theme: "grid",
          styles: { 
            fontSize: 9, 
            cellPadding: 6,
            lineColor: [200, 200, 200],
            lineWidth: 0.5
          },
          headStyles: { 
            fillColor: softCoral, 
            textColor: [255, 255, 255], 
            fontSize: 10,
            fontStyle: 'bold'
          },
          alternateRowStyles: { 
            fillColor: [250, 250, 250] 
          },
          margin: { left: 40, right: 40 },
          tableLineColor: [200, 200, 200],
          tableLineWidth: 0.5
        })

        cursorY = (doc as any).lastAutoTable.finalY + 20
      }

      // ===== Footer =====
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        
        // Footer line
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.5)
        doc.line(40, pageHeight - 30, pageWidth - 40, pageHeight - 30)
        
        // Page number
        doc.setFontSize(9)
        doc.setTextColor(120, 120, 120)
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 15, { align: "center" })
        
        // Report generation info
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(`Generated by Hygieia AI • ${new Date().toLocaleString()}`, pageWidth - 40, pageHeight - 15, { align: "right" })
      }

      // ===== Watermark =====
      if (watermarkDataUrl) {
        const wmW = pageWidth * 0.5
        const wmH = pageHeight * 0.5
        const x = (pageWidth - wmW) / 2
        const y = (pageHeight - wmH) / 2

        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.addImage(watermarkDataUrl, "PNG", x, y, wmW, wmH)
        }
      }

      // Save and open in new tab
      const safeName = patientName.replace(/\s+/g, "_")
      const pdfBlob = doc.output("blob")
      const pdfUrl = URL.createObjectURL(pdfBlob)
      
      // Open in new tab
      window.open(pdfUrl, "_blank")
      
      // Also trigger download automatically
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `${safeName}_nutritionist_report_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Show success message
      console.log(`Report generated and downloaded: ${safeName}_nutritionist_report_${new Date().toISOString().split('T')[0]}.pdf`)
      
      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 2000)
      
    } catch (err) {
      console.error("PDF generation error:", err)
      throw err
    }
  }

  // Helper function to process report content for better formatting
  const processReportContent = (content: string) => {
    const paragraphs = content.split('\n').filter(p => p.trim())
    const processed: Array<{type: string, text: string}> = []
    
    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim()
      if (!trimmed) continue
      
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        // Bullet points
        processed.push({
          type: 'bullet',
          text: trimmed.replace(/^[-•]\s*/, '')
        })
      } else if (trimmed.match(/^\d+\.\s/) || trimmed.match(/^[A-Z][^a-z]*:/)) {
        // Sub-headers (numbered items or items ending with colon)
        processed.push({
          type: 'subheader',
          text: trimmed
        })
      } else {
        // Regular paragraphs
        processed.push({
          type: 'paragraph',
          text: trimmed
        })
      }
    }
    
    return processed
  }

  // Helper function to create watermark
  const createWatermarkDataUrl = async (
    imageUrl: string,
    opacity: number,
    width: number,
    height: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }
        
        canvas.width = width
        canvas.height = height
        
        ctx.globalAlpha = opacity
        ctx.drawImage(img, 0, 0, width, height)
        
        resolve(canvas.toDataURL("image/png"))
      }
      img.onerror = reject
      img.src = imageUrl
    })
  }

  if (isLoading) { return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader />
    </div>
  )}

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md hover-lift">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Appointment Not Found</h3>
              <p className="text-sm text-muted-foreground">The requested appointment could not be located.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { patient, date, time, type, notes, dataShared } = appointment

  return (
    <div className="min-h-screen bg-gradient-to-br bg-transparent">
      <div className="container mx-auto  space-y-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className=" w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6  text-soft-coral" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-balance text-soft-coral">Patient Consultation</h1>
                <p className="text-cool-gray text-lg">Comprehensive health overview and analytics</p>
              </div>
            </div>
          </div>

       
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1 space-y-6">
            {/* Patient Profile Card */}
            <Card className="hover-lift bg-white overflow-hidden">
              <div className="p-6">
               <div className="flex items-center justify-center">
  <div className="flex items-center space-x-4">
    <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
      <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
      <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
        {patient.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <h3 className="text-xl font-bold text-soft-coral">{patient.name}</h3>
      <p className="text-cool-gray">
        {patient.gender} • {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
      </p>
      {dataShared && (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium ml-1">Health Score</span>
          </div>
          <Badge variant="secondary" className="bg-secondary/20 text-soft-coral">
            {patient.healthscore}/100
          </Badge>
        </div>
      )}
    </div>
  </div>
</div>

              </div>

              <CardContent className="p-6 pt-0 space-y-6">
                {/* Physical Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-cool-gray/10">
                    <Weight className="w-5 h-5 text-soft-blue mx-auto mb-1" />
                    <p className="text-sm text-dark-slate-gray">Weight</p>
                    <p className="text-lg font-bold text-soft-blue">{patient.weight} kg</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-cool-gray/10">
                    <Ruler className="w-5 h-5 text-soft-blue mx-auto mb-1" />
                    <p className="text-sm text-dark-slate-gray">Height</p>
                    <p className="text-lg font-bold text-soft-blue">{patient.height} </p>
                  </div>
                </div>

              
            

                <Separator />

                {/* Medical Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-soft-coral flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Medical Info
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-cool-gray/10">
                      <span className="text-sm text-soft-blue">Blood Type</span>
                      <Badge variant="outline" className="bg-soft-coral text-cool-gray">{patient.bloodType}</Badge>
                    </div>
                    <div className="p-2 rounded-lg bg-cool-gray/10">
                      <p className="text-sm text-soft-blue mb-1">Allergies</p>
                      <p className="text-sm text-cool-gray">{patient.allergies}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-cool-gray/10">
                      <p className="text-sm text-soft-blue mb-1">Conditions</p>
                      <p className="text-sm text-cool-gray">{patient.conditions}</p>
                    </div>
                  </div>
                </div>

                {dataShared && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-semibold text-soft-coral flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Health Metrics
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-soft-blue ">Adherence Rate</span>
                            <Badge className="bg-secondary/20 text-mint-green">{patient.adherence}</Badge>
                          </div>
                          <Progress
                            value={patient.adherence === "High" ? 85 : patient.adherence === "Medium" ? 60 : 35}
                            className="h-2 text-soft-blue"
                          />
                        </div>
                       
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

             {/* Action Buttons */}
            <Card className="hover-lift border-accent/20">
              <CardHeader className="bg-accent/5">
                <CardTitle className="text-soft-coral flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6  py-0  space-y-3">
                <Button
                  onClick={handleGenerateAIReport}
                  disabled={isGeneratingAIReport || isDownloadingReport}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Bot className="w-4 h-4" />
                  {isGeneratingAIReport ? "Generating..." : isDownloadingReport ? (
    <>
      <Loader /> Downloading...
    </>
  ) : (
    "Generate AI report"
  )}
                </Button>

                <DietPlanDialog patientName={patient.name} onAssign={handleAssignDietPlan} />

                     <Button
                       onClick={handleScrollToLabTests}
                        className="border-soft-coral w-full bg-soft-coral hover:bg-soft-coral/90 hover:text-white text-white"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Refer Test
                      </Button>
               
              </CardContent>
            </Card>

            {/* Appointment Details */}
            <Card className="hover-lift">
              <CardHeader className="bg-white">
                <CardTitle className="text-soft-coral flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="space-y-3 text-soft-blue">
                 

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-cool-gray" />
                    <div>
                      <p className="text-sm font-medium text-soft-blue">{date}</p>
                      <p className="text-xs text-soft-blue">
                        {time} • {appointment.mode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-cool-gray" />
                    <p className="text-sm text-soft-blue">{type}</p>
                  </div>

                  {notes && (
                    <div className="mt-4 p-3 mb-0 rounded-lg bg-cool-gray/10">
                      <p className="text-sm font-medium text-soft-coral mb-1 ">Notes</p>
                      <p className="text-sm text-cool-gray">{notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

<Card className="hover-lift">
  <CardHeader className="bg-white">
    <CardTitle className="text-soft-coral flex items-center gap-2">
      <FileText className="w-5 h-5" />
      Additional Info
    </CardTitle>
  </CardHeader>
  <CardContent className="p-6 pt-0 space-y-4">
    <div className="space-y-3">
      <h4 className="font-semibold text-soft-coral flex items-center gap-2">
        <Activity className="w-4 h-4" />
        Other Health Details
      </h4>

      <div className="space-y-2">
        <div className="p-2 rounded-lg bg-cool-gray/10">
          <p className="text-sm text-soft-blue mb-1">Medications</p>
          <p className="text-sm text-cool-gray">{patient.medications || "N/A"}</p>
        </div>

        <div className="p-2 rounded-lg bg-cool-gray/10">
          <p className="text-sm text-soft-blue mb-1">Ongoing Medications</p>
          <p className="text-sm text-cool-gray">{patient.ongoingMedications || "N/A"}</p>
        </div>

        <div className="p-2 rounded-lg bg-cool-gray/10">
          <p className="text-sm text-soft-blue mb-1">Surgery History</p>
          <p className="text-sm text-cool-gray">{patient.surgeryHistory || "N/A"}</p>
        </div>

        <div className="p-2 rounded-lg bg-cool-gray/10">
          <p className="text-sm text-soft-blue mb-1">Implants</p>
          <p className="text-sm text-cool-gray">{patient.implants || "N/A"}</p>
        </div>

        {patient.gender === "Female" && (
          <>
            <div className="p-2 rounded-lg bg-cool-gray/10">
              <p className="text-sm text-soft-blue mb-1">Pregnancy Status</p>
              <p className="text-sm text-cool-gray">{patient.pregnancyStatus || "N/A"}</p>
            </div>

            <div className="p-2 rounded-lg bg-cool-gray/10">
              <p className="text-sm text-soft-blue mb-1">Menstrual Cycle</p>
              <p className="text-sm text-cool-gray">{patient.menstrualCycle || "N/A"}</p>
            </div>
          </>
        )}

        <div className="p-2 rounded-lg bg-cool-gray/10">
          <p className="text-sm text-soft-blue mb-1">Mental Health</p>
          <p className="text-sm text-cool-gray">{patient.mentalHealth || "N/A"}</p>
        </div>

        <div className="p-2 rounded-lg bg-cool-gray/10">
          <p className="text-sm text-soft-blue mb-1">Family History</p>
          <p className="text-sm text-cool-gray">{patient.familyHistory || "N/A"}</p>
        </div>

        <div className="p-2 rounded-lg bg-cool-gray/10">
          <p className="text-sm text-soft-blue mb-1">Organ Donor</p>
          <p className="text-sm text-cool-gray">{patient.organDonor || "N/A"}</p>
        </div>

        <div className="p-2 rounded-lg bg-cool-gray/10">
          <p className="text-sm text-soft-blue mb-1">Disabilities</p>
          <p className="text-sm text-cool-gray">{patient.disabilities || "N/A"}</p>
        </div>

        <div className="p-2 rounded-lg bg-cool-gray/10">
          <p className="text-sm text-soft-blue mb-1">Lifestyle</p>
          <p className="text-sm text-cool-gray">{patient.lifestyle || "N/A"}</p>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

           
          </div>

          <div className="xl:col-span-3 space-y-8">
             
<>



{(assignedDietPlan || referredTests.length > 0 || doctorReport) && (
  <Card
    className={`hover-lift bg-white border-accent/30 shadow-md rounded-2xl overflow-hidden transition-all ${
      appointmentDone ? "opacity-60 pointer-events-none" : ""
    }`}
  >
    <CardHeader className=" border-b ">
      <CardTitle className="text-soft-coral flex items-center gap-2 text-xl ">
        <ClipboardList className="w-6 h-6" />
        Summary
      </CardTitle>
    </CardHeader>

    <CardContent className="space-y-6">
      {/* Assigned Diet Plan */}
      {assignedDietPlan && (
        <div className="p-4 rounded-xl bg-cool-gray/10 border border-mint-green/30">
          <h4 className="font-semibold text-soft-blue flex items-center gap-2">🥗 Assigned Diet Plan</h4>
          <p className="text-sm text-soft-blue mt-1">
          <span className="text-soft-coral">  Calories:</span> {assignedDietPlan.dailyCalories} | <span className="text-soft-coral"> Protein:</span> {assignedDietPlan.protein}g | <span className="text-soft-coral">Carbs:{" "}</span>
            {assignedDietPlan.carbs}g | <span className="text-soft-coral"> Fat:</span> {assignedDietPlan.fat}g
          </p>
          <p className="text-xs text-muted-foreground">
            {assignedDietPlan.startDate && assignedDietPlan.endDate
              ? `${new Date(assignedDietPlan.startDate).toLocaleDateString()} → ${new Date(
                  assignedDietPlan.endDate
                ).toLocaleDateString()}`
              : "No date range specified"}
          </p>
          {assignedDietPlan.notes && (
            <p className="text-sm italic text-cool-gray mt-2">“{assignedDietPlan.notes}”</p>
          )}
        </div>
      )}

      {/* Referred Tests */}
      {referredTests.length > 0 && (
        <div className="p-4 rounded-xl bg-cool-gray/10 border border-soft-blue/30">
          <h4 className="font-semibold text-soft-blue flex items-center gap-2">🧪 Referred Lab Tests</h4>
          <div className="flex flex-wrap gap-2 mt-3">
            {[...new Map(referredTests.map((t) => [t.id, t])).values()].map((test) => (
              <div
                key={test.id}
                className="flex items-center gap-2 bg-soft-blue/20 text-dark-slate-gray border border-soft-blue/30 px-3 py-1 rounded-lg text-sm"
              >
                {test.name}
                <button
                  onClick={() => handleRemoveTest(test.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Report */}
      <div className="p-4 rounded-xl bg-cool-gray/10 border border-soft-coral/30">
        <h4 className="font-semibold text-soft-blue flex items-center gap-2">📝Report</h4>
        <textarea
          value={doctorReport}
          onChange={(e) => setDoctorReport(e.target.value)}
          placeholder="Write your report here..."
          className="w-full mt-2 p-3 border border-soft-blue/30 rounded-lg text-sm focus:ring-2 focus:ring-soft-coral outline-none"
          rows={4}
        />
      </div>
    </CardContent>

    {/* Mark Appointment Done */}
    {!appointmentDone && (
      <div className="p-4 border-t border-accent/20 flex justify-end gap-3">
        <Button
          className="bg-soft-coral text-white hover:bg-soft-coral/80"
          onClick={handleMarkAppointmentDone}
          disabled={doctorReport.length<10}
        >
          Mark Appointment Done
        </Button>
      </div>
    )}
  </Card>
)}





</>



            {/* Fitness Analytics Section */}
            {dataShared ? (
              <Card className="hover-lift overflow-hidden">
                <CardHeader className=" border-b ">
                                        <CardTitle className="text-soft-coral flex items-center gap-2 text-xl ">
                        <Activity className="w-6 h-6" />
                        Health & Fitness Analytics
                      </CardTitle>

                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <EnhancedFitnessCharts data={fitnessData} />
                </CardContent>
              </Card>
            ) : (
              <Card className="hover-lift border-muted">
                <CardContent className="flex flex-col items-center justify-center h-96 text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center">
                    <ShieldOff className="w-12 h-12 text-soft-coral" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-soft-coral">Health Data Not Available</h3>
                    <p className="text-muted-foreground max-w-md">
                      The patient has not granted permission to share detailed health and fitness data. Only basic
                      profile information is accessible.
                    </p>
                  </div>
                 
                </CardContent>
              </Card>
            )}

            {/* Medical Records Section */}
          {dataShared &&
            <Card className="hover-lift border-secondary/20">
              <CardHeader className="bg-secondary/5 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-soft-coral flex items-center gap-2 text-xl">
                      <FileText className="w-6 h-6" />
                      Medical Records & Documents
                    </CardTitle>
                    <CardDescription className="text-base">
                      Patient&apos;s medical history, test results, and prescriptions
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-secondary text-mint-green">
                    {medicalRecords.length} Records
                  </Badge>
                </div>
              </CardHeader>
           <CardContent className="p-6 pt-0">
  {medicalRecords.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
      <FileText className="w-10 h-10 mb-3 text-soft-blue/70" />
      <p className="text-sm">No medical records available yet.</p>
    </div>
  ) : (
    <div className="grid gap-4">
      {medicalRecords.map((record) => (
        <div
          key={record.id}
          className="group flex items-center justify-between p-4 border border-secondary/20 rounded-xl bg-cool-gray/10 transition-all duration-200"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              <FileText className="w-6 h-6 text-soft-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-soft-coral group-hover:text-soft-coral/90 transition-colors">
                {record.title}
              </h4>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Badge
                    variant="outline"
                    className="text-xs bg-mint-green text-white"
                  >
                    {record.record_type}
                  </Badge>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateOnly(new Date(record.date))}
                </span>
                {record.doctorName && (
                  <span className="flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" />
                    {record.doctorName}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            className="gap-2 ml-4 bg-soft-blue text-snow-white hover:bg-soft-blue/90"
            onClick={() => window.open(record.file_url, "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
            View
          </Button>
        </div>
      ))}
    </div>
  )}
</CardContent>

            </Card>
            }

            <div ref={labTestsRef}>
  <LabTests onReferTest={handleTestReferral} />
</div>

          </div>
        </div>
      </div>
    </div>
  )
}
