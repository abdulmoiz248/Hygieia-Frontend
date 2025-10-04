"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Dumbbell, Plus, Building, File } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { WorkoutRoutine, WorkoutPreferences } from "@/types/patient/workoutSlice"
import { useWorkout } from "@/hooks/useWorkout"
import RoutineCard from "./RoutineCard"
import RoutineForm from "./RoutineForm"
import CompletionDialog from "./CompletionDialog"
import AIRecommendationDialog from "./AIRecommendationDialog"
import { addCalories } from "@/types/patient/fitnessSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/patient/store"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function WorkoutDashboard() {
  const {
    routines,
    preferences,
    fetchWorkouts,
    isLoadingRoutines,
    generateAIWorkoutPlan,
    saveWorkoutRoutine,
    updateWorkoutPreferences,
    deleteWorkoutRoutine,
    updateWorkoutRoutine,
  } = useWorkout()



    const dispatch = useDispatch<AppDispatch>()
    const profile=useSelector((store:RootState)=>store.profile)
  const [isAddRoutineOpen, setIsAddRoutineOpen] = useState(false)
  const [isAIRecommendationOpen, setIsAIRecommendationOpen] = useState(false)
  const [isRoutineDetailsOpen, setIsRoutineDetailsOpen] = useState(false)
  const [isCompletionOpen, setIsCompletionOpen] = useState(false)

  const [aiPrefs, setAiPrefs] = useState<WorkoutPreferences>(preferences)
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null)

  useEffect(() => {
    if (routines.length === 0) fetchWorkouts()
  }, [])

  const handleSaveRoutine = (routine: WorkoutRoutine) => {
    if (selectedRoutine) {
      updateWorkoutRoutine(routine)
    } else {
      saveWorkoutRoutine(routine)
    }
    setIsAddRoutineOpen(false)
    setIsRoutineDetailsOpen(false)
  }



// create watermark dataUrl by drawing image to canvas with low alpha
const createWatermarkDataUrl = async (url: string, opacity = 0.06, maxW = 600, maxH = 600) => {
  return await new Promise<string>(async (resolve, reject) => {
    try {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        // scale to fit limits while keeping aspect ratio
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1)
        const w = img.width * ratio
        const h = img.height * ratio

        const canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject("no-canvas-context")
        ctx.clearRect(0, 0, w, h)
        ctx.globalAlpha = opacity
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL("image/png"))
      }
      img.onerror = (e) => reject(e)
      img.src = url
    } catch (err) {
      reject(err)
    }
  })
}



const handleDownloadPdf = async () => {
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

   
    let logoDataUrl: string | null = null
    let watermarkDataUrl: string | null = null
    try {
      logoDataUrl = await getBase64FromUrl("/logo/logo.png")
      watermarkDataUrl = await createWatermarkDataUrl("/logo/logo.png", 0.05, pageWidth * 0.5, pageHeight * 0.5)
    } catch {}

    const now = new Date()
    const dateStr = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    const timeStr = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })

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
      doc.text("Workout Schedule Report", pageWidth - M.right, 64, { align: "right" })
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
    doc.text("Workout Routines", M.left, cursorY - 10)

    if (!gymRoutines || gymRoutines.length === 0) {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      doc.setTextColor(...grayText)
      doc.text("No workout routines available.", M.left, cursorY + 10)
    } else {
      gymRoutines.forEach((routine, index) => {
        const title = `${index + 1}. ${routine.name} — ${routine.category} (${routine.totalDuration ?? 0} min • ${
          routine.totalCalories ?? 0
        } kcal)`
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.setTextColor(...primaryColor)
        doc.text(title, M.left, cursorY + 15)
        cursorY += 10

        const body = (routine.exercises || []).map((ex: any) => [
          ex.name ?? "-",
          `${ex.sets ?? "-"} x ${ex.reps ?? "-"}`,
          ex.rest ?? "-",
          ex.calories ? `${ex.calories} kcal` : "-",
        ])

        autoTable(doc, {
          startY: cursorY + 8,
          theme: "grid",
          styles: { fontSize: 11, cellPadding: 6 },
          headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: M.top, bottom: M.bottom + 50, left: M.left, right: M.right },
          head: [["Exercise", "Sets x Reps", "Rest", "Calories"]],
          body,
          didDrawPage: pageContentHook,
        })

        cursorY = jsDoc.lastAutoTable.finalY + 28
      })
    }

    const safeName = (profile?.name || "patient").replace(/\s+/g, "_")
    doc.save(`${safeName}_workout_report.pdf`)
  } catch (err) {
    console.error("PDF generation error:", err)
  }
}











  const handleCompleteRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine)
    
         dispatch(addCalories({ 
        type:'burned', 
        amount: routine?.totalCalories || 0, 
        carbs: 0, 
        protein: 0, 
        fat: 0
      }))

    setIsCompletionOpen(true)
  }

  const gymRoutines = routines.filter((r) => r.type === "gym")

  return (
    <motion.div variants={itemVariants} className="mt-6">
      <Card className="bg-white/40">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-soft-blue" />
              <span className="text-base sm:text-lg">Workout Dashboard</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {gymRoutines.length>0 &&

              
               <Button
                size="sm"
                className="text-snow-white bg-soft-blue border border-soft-blue hover:bg-soft-blue/90 hover:text-snow-white w-full sm:w-auto"
                onClick={async () => {
                await handleDownloadPdf()
                }}
              >
                <File className="w-4 h-4 mr-2" />
               Download as Pdf
              </Button>

            }
           
              <Button
                size="sm"
                className="text-soft-blue bg-transparent border border-soft-blue hover:bg-soft-blue hover:text-snow-white w-full sm:w-auto"
                onClick={() => {
                  setSelectedRoutine(null)
                  setIsAddRoutineOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Routine
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          

      
              {gymRoutines.length > 0 ? (
                gymRoutines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    onComplete={() => handleCompleteRoutine(routine)}
                    onView={() => {
                      setSelectedRoutine(routine)
                      setIsRoutineDetailsOpen(true)
                    }}
                    onDelete={() => deleteWorkoutRoutine(routine.id)}
                  />
                ))
              ) : (
                <div className="text-center py-6 bg-gradient-to-r from-soft-blue/5 to-soft-coral/5 rounded-xl border border-soft-blue/20">
                  <Building className="w-12 h-12 text-soft-blue mx-auto mb-3" />
                  <p className="text-soft-blue font-medium mb-2">No Workout Routines Yet</p>
                  <p className="text-cool-gray text-sm">Add structured routines like Chest Day, Leg Day, Yoga, Morning walk etc.</p>
                </div>
              )}
          
        </CardContent>
      </Card>

      {/* Add/Edit Routine Modal */}
      <Dialog open={isAddRoutineOpen || isRoutineDetailsOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddRoutineOpen(false)
          setIsRoutineDetailsOpen(false)
        }
      }}>
        <DialogContent className="max-w-2xl bg-snow-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-soft-blue">
              {selectedRoutine ? "Edit Routine" : "Add Routine"}
            </DialogTitle>
          </DialogHeader>
          <RoutineForm
            routine={
              selectedRoutine || {
                id: Date.now().toString(),
                name: "",
                type: "gym",
                category: "full-body",
                exercises: [],
                totalDuration: 0,
                totalCalories: 0,
                createdAt: new Date().toISOString(),
              }
            }
            onSave={handleSaveRoutine}
            onCancel={() => {
              setIsAddRoutineOpen(false)
              setIsRoutineDetailsOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* AI Recommendations */}
      <AIRecommendationDialog
        open={isAIRecommendationOpen}
        onClose={() => setIsAIRecommendationOpen(false)}
        prefs={aiPrefs}
        setPrefs={setAiPrefs}
        isLoading={isLoadingRoutines}
        onGenerate={async () => {
          const aiRoutines = await generateAIWorkoutPlan(aiPrefs)
          aiRoutines.forEach((routine) => saveWorkoutRoutine(routine))
          updateWorkoutPreferences(aiPrefs)
          setIsAIRecommendationOpen(false)
        }}
      />

      {/* Completion Modal */}
      <CompletionDialog
        open={isCompletionOpen}
        onClose={() => setIsCompletionOpen(false)}
        routine={selectedRoutine}
      />
    </motion.div>
  )
}
