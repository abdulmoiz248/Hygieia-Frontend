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
    const patientName=useSelector((store:RootState)=>store.profile.name)
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
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Primary soft blue
    const primaryColor: [number, number, number] = [0, 131, 150]

    // Load logo (for header)
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
      doc.addImage(logoDataUrl, "PNG", 40, 25, 50, 50) // logo left
    }
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold") // make header bold
    doc.setTextColor(...primaryColor)
    doc.text("Workout Schedule", pageWidth / 2, 55, { align: "center" })

    // Thin line under header
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(40, 80, pageWidth - 40, 80)

    let cursorY = 130

    // ===== Content =====
    if (!gymRoutines || gymRoutines.length === 0) {
      doc.text("No workout routines available.", 40, cursorY)
    } else {
      gymRoutines.forEach((routine, index) => {
        // Routine header
        doc.setFontSize(13)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(...primaryColor)
        doc.text(
          `${index + 1}. ${routine.name} — ${routine.category} (${routine.totalDuration ?? 0} min • ${routine.totalCalories ?? 0} kcal)`,
          40,
          cursorY
        )
        cursorY += 15

        // Table body
        const body = (routine.exercises || []).map((ex: any) => [
          ex.name ?? "-",
          `${ex.sets ?? "-"} x ${ex.reps ?? "-"}`,
          ex.rest ?? "-",
          ex.calories ? `${ex.calories} kcal` : "-",
        ])

        autoTable(doc, {
          startY: cursorY,
          head: [["Exercise", "Sets x Reps", "Rest", "Calories"]],
          body,
          theme: "grid",
          styles: { fontSize: 10, cellPadding: 6 },
          headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { left: 40, right: 40 },
        })

       
        cursorY = (doc as any).lastAutoTable.finalY + 30
      })
    }

    // ===== Footer =====
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 20, { align: "center" })
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

    // Save
    const safeName = patientName.replace(/\s+/g, "_")
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
                onClick={() => {
                handleDownloadPdf()
                }}
              >
                <File className="w-4 h-4 mr-2" />
               Downalod as Pdf
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
