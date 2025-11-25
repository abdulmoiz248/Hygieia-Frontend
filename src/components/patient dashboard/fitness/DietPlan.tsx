"use client"

import type React from "react"
import { ChefHat, Target, Utensils, Sparkles,  TrendingUp, Zap, Apple, File, Loader2, Trash2, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Loader from "@/components/loader/loader"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useDiet } from "@/hooks/useDiet"
import type { MealPreferences } from "@/types/patient/dietSlice"
import {  useSelector } from "react-redux"
import {  RootState } from "@/store/patient/store"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface FormData {
  goal: string

}

export default function DietPlan() {
  const {
    currentDietPlan,
    todayMealSuggestions,
  
    isLoadingPlan,
    isLoadingMeals,
    generateAIDietPlan,
    generateMealSuggestions,
    saveDietPlan,
   getDietPlan,
    saveMealSuggestions,
    saveMealPreferences,
    deleteAIDietPlan,
  } = useDiet()


  console.log("currentDietPlan:", currentDietPlan )


useEffect(() => {
  getDietPlan()
}, [])

  const fitness=useSelector((store:RootState)=>store.fitness)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMealModalOpen, setIsMealModalOpen] = useState(false)
  const [showConfirmReplace, setShowConfirmReplace] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const profile=useSelector((store:RootState)=>store.profile)
 const patientName=profile?.name



  // Utility: create watermark dataUrl
const createWatermarkDataUrl = async (
  url: string,
  opacity = 0.06,
  maxW = 600,
  maxH = 600
) => {
  return await new Promise<string>((resolve, reject) => {
    try {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
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






 const handleDownloadDietPdf = async (dietPlan: any) => {
    try {
      // Normalize known shapes/keys
      dietPlan = {
        id: dietPlan?.id,
        dailyCalories: dietPlan.daily_calories ?? dietPlan.dailyCalories,
        protein: dietPlan.protein,
        carbs: dietPlan.carbs,
        fat: dietPlan.fat,
        deficiency: dietPlan.deficiency,
        notes: dietPlan.notes,
        caloriesBurned: dietPlan.calories_burned ?? dietPlan.caloriesBurned,
        exercise: dietPlan.exercise,
        startDate: dietPlan.startDate ? new Date(dietPlan.startDate) : new Date(dietPlan.start_date),
        endDate: dietPlan.endDate ? new Date(dietPlan.endDate) : new Date(dietPlan.end_date),
        patientId: dietPlan.patient_id ?? dietPlan.patientId,
        patientName: dietPlan.patientName ?? patientName,
        nutritionistId: dietPlan.nutritionist_id ?? dietPlan.nutritionistId,
      }

      const { default: jsPDF } = await import("jspdf")
      const autoTable = (await import("jspdf-autotable")).default

      const doc = new jsPDF({ unit: "pt", format: "a4" })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // Brand + neutrals
      const primaryColor: [number, number, number] = [0, 131, 150]
      const grayText: [number, number, number] = [60, 60, 60]
      // const lightRule: [number, number, number] = [220, 220, 220]

      // Layout
      const M = { left: 48, right: 48, top: 160, bottom: 72 }
      const headerHeight = 120

      // ===== Helper: load image as base64 =====
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
        logoDataUrl = await getBase64FromUrl("/logo/logo.png")
      } catch (err) {
        console.warn("Logo not loaded:", err)
      }

      let watermarkDataUrl: string | null = null
      try {
        watermarkDataUrl = await createWatermarkDataUrl("/logo/logo.png", 0.05, pageWidth * 0.5, pageHeight * 0.5)
      } catch (err) {
        console.warn("Watermark could not be loaded:", err)
      }

      // Meta: date strings
      const now = new Date()
      const dateStr = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

      // Hospital identity (customize as needed)
      const hospitalName = "Hygieia"
      const hospitalTagline = "From Past to Future of Healthcare"
      const hospitalAddress = "www.hygieia-frontend.vercel.app"
      const hospitalContact = "+92 80 1234 5678 • hygieia.fyp@gmail.com"

      // Header/Footer/Watermark helpers
      const drawHeader = () => {
        // Brand rule
     
        // Logo
        if (logoDataUrl) {
          doc.addImage(logoDataUrl, "PNG", M.left, 44, 56, 56)
        }

        // Hospital identity
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

        // Document title + generation time
        doc.setFont("helvetica", "bold")
        doc.setFontSize(18)
        doc.setTextColor(...primaryColor)
        doc.text("Diet Plan Report", pageWidth - M.right, 64, { align: "right" })

        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Generated: ${dateStr} • ${timeStr}`, pageWidth - M.right, 80, { align: "right" })

        doc.setDrawColor(...primaryColor)
        doc.setLineWidth(2)
        // doc.line(M.left, 36, pageWidth - M.right, 36)

        doc.line(M.left,  headerHeight, pageWidth - M.right,headerHeight)
      }

      const drawFooter = (pageNumber: number, pageCount: number) => {
        // Top rule of footer

         doc.setDrawColor(...primaryColor)
        doc.setLineWidth(2)
        doc.line(M.left, pageHeight - M.bottom, pageWidth - M.right, pageHeight - M.bottom)

        // Disclaimer
        const disclaimer =
          "This document is computer-generated from the hospital information system and does not require a physical signature. " +
          "It may contain confidential medical information. If you are not the intended recipient, please notify the sender and delete this report."

        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(110, 110, 110)

        const wrapped = doc.splitTextToSize(disclaimer, pageWidth - M.left - M.right - 140)
        doc.text(wrapped, M.left, pageHeight - M.bottom + 18)

        // Page number (center)
        doc.setFontSize(9)
        doc.text(`Page ${pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 16, { align: "center" })

      }

      const drawWatermark = () => {
        if (!watermarkDataUrl) return
        const wmW = pageWidth * 0.45
        const wmH = pageHeight * 0.45
        const x = (pageWidth - wmW) / 2
        const y = (pageHeight - wmH) / 2
        doc.addImage(watermarkDataUrl, "PNG", x, y, wmW, wmH)
      }

      // ============ CONTENT ============
      let cursorY = M.top

      // Patient Information
      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.setTextColor(...primaryColor)
      doc.text("Patient Information", M.left, cursorY - 16)

      autoTable(doc, {
        startY: cursorY,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 6 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        margin: { left: M.left, right: M.right },
        head: [["Field", "Details"]],
        body: [
          ["Patient Name", dietPlan.patientName || "-"],
          [
            "Patient Email",
            `${profile.email || "-"}`,
          ],
          ["Patient Contact", profile.phone || "-"],
        ],
      })
      cursorY = (doc as any).lastAutoTable.finalY + 30

      // Nutrition Summary
      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.setTextColor(...primaryColor)
      doc.text("Nutrition Summary", M.left, cursorY - 10)

      autoTable(doc, {
        startY: cursorY,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 6 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        margin: { left: M.left, right: M.right },
        head: [["Nutrient", "Value"]],
        body: [
          ["Daily Calories", dietPlan.dailyCalories ?? "-"],
          ["Protein (g)", dietPlan.protein ?? "-"],
          ["Carbohydrates (g)", dietPlan.carbs ?? "-"],
          ["Fat (g)", dietPlan.fat ?? "-"],
          ["Deficiency", dietPlan.deficiency ?? "-"],
        ],
      })
      cursorY = (doc as any).lastAutoTable.finalY + 30

      // Exercise Plan
      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.setTextColor(...primaryColor)
      doc.text("Exercise Plan", M.left, cursorY - 10)

      autoTable(doc, {
        startY: cursorY,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 6 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        margin: { left: M.left, right: M.right },
        head: [["Metric", "Value"]],
        body: [
          ["Calories To Burn", dietPlan.caloriesBurned ?? "-"],
          ["Exercise", dietPlan.exercise ?? "-"],
        ],
      })
      cursorY = (doc as any).lastAutoTable.finalY + 30
      // Notes
      if (dietPlan.notes) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(13)
        doc.setTextColor(...primaryColor)
        doc.text("Clinical Notes", M.left, cursorY - 10)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        doc.setTextColor(...grayText)

        const splitNotes = doc.splitTextToSize(dietPlan.notes, pageWidth - M.left - M.right)
        autoTable(doc, {
          startY: cursorY,
          theme: "plain",
          styles: { fontSize: 11, cellPadding: 0, textColor: grayText },
          margin: { left: M.left, right: M.right },
          body: splitNotes.map((line: string) => [line]),
          columns: [{ header: "", dataKey: "text" }],
        })
        cursorY = (doc as any).lastAutoTable.finalY + 24
      }

      // ============ HEADER / FOOTER / WATERMARK ON EVERY PAGE ============
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        drawWatermark() // draw under text
        drawHeader()
        drawFooter(i, pageCount)
      }

      const safeName = (dietPlan.patientName || "patient").replace(/\s+/g, "_")
      doc.save(`${safeName}_diet_plan.pdf`)
    } catch (err) {
      console.error("PDF generation error:", err)
    }
  }



  const [formData, setFormData] = useState<FormData>({
    goal: ""
   
  })

  const [mealPrefs, setMealPrefs] = useState<MealPreferences>({
    budget: "medium",
    cuisine: [],
    cookingTime: "medium",
    difficulty: "easy",
    dietaryRestrictions: [],
  })

  const handleGenerateAIPlan = () => {
    setIsModalOpen(true)
  }

const [pendingPlan, setPendingPlan] = useState<any>(null)

const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    const newPlan = await generateAIDietPlan(formData.goal)
    setPendingPlan(newPlan)

    if (currentDietPlan) {
      setShowConfirmReplace(true)
      return
    }

    saveDietPlan(newPlan)
    setIsModalOpen(false)
    resetForm()
  } catch (error) {
    console.error("Error generating diet plan:", error)
  }
}

const handleConfirmReplace = () => {
  if (pendingPlan) {
    saveDietPlan(pendingPlan)
    setPendingPlan(null)
  }
  setShowConfirmReplace(false)
  setIsModalOpen(false)
  resetForm()
}


  const handleGenerateMeals = () => {
    setIsMealModalOpen(true)
  }

  const handleDeleteAIPlan = () => {
    setShowConfirmDelete(true)
  }

  const confirmDeleteAIPlan = () => {
    deleteAIDietPlan()
    setShowConfirmDelete(false)
  }

  const handleMealPreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const meals = await generateMealSuggestions(mealPrefs)
      saveMealSuggestions(meals)
      saveMealPreferences(mealPrefs)
      setIsMealModalOpen(false)
    } catch (error) {
      console.error("Error generating meal suggestions:", error)
    }
  }




  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    setMealPrefs((prev) => ({
      ...prev,
      cuisine: checked ? [...prev.cuisine, cuisine] : prev.cuisine.filter((c) => c !== cuisine),
    }))
  }

  const resetForm = () => {
    setFormData({
      goal: "",
     
    })
  }

  const resetModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const getTodaysCaloriesConsumed = () => {
    return fitness.caloriesConsumed
  }

  const getRemainingCalories = () => {
    // @ts-expect-error type mismatch picked up
    const daily = Number.parseInt(currentDietPlan?.dailyCalories ||( currentDietPlan?.daily_calories  || "0"))
    const consumed = getTodaysCaloriesConsumed()
    return daily - consumed
  }

  return (
    <>
      <motion.div variants={itemVariants}>
        <Card className="bg-white/40">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-mint-green" />
                <span className="text-base sm:text-lg">Diet Plan Dashboard</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
               
              {currentDietPlan && (
                <Button
                  size="sm"
                  className="text-snow-white bg-soft-blue border border-soft-blue hover:bg-soft-blue/90 hover:text-snow-white w-full sm:w-auto"
                  onClick={() => {
                    handleDownloadDietPdf(currentDietPlan!)
                  }}
                >
                  <File className="w-4 h-4 mr-2" />
                  Download as Pdf
                </Button>
              )}
              
              {currentDietPlan?.isAIGenerated && (
                <Button
                  size="sm"
                  className="text-white bg-red-500 border border-red-500 hover:bg-red-600 hover:text-white w-full sm:w-auto"
                  onClick={handleDeleteAIPlan}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Plan
                </Button>
              )}
              
                <Button
                  size="sm"
                  className="text-mint-green bg-transparent border-1 border-mint-green hover:bg-mint-green hover:text-snow-white w-full sm:w-auto"
                  onClick={handleGenerateAIPlan}
                >
                  {currentDietPlan ? "Update Plan" : "Generate AI Plan"}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentDietPlan?.isAIGenerated && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800 mb-1">AI-Generated Diet Plan</h4>
                  <p className="text-sm text-yellow-700">
                    This diet plan was generated by AI and may contain errors. It is stored locally for 24 hours. 
                    For personalized and medically-reviewed diet plans, please consult with a nutritionist.
                  </p>
                </div>
              </div>
            )}
            
           
            
            {currentDietPlan ? (
              <>
                {/* Today's Nutrition Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gradient-to-br from-mint-green/10 to-mint-green/5 rounded-xl border border-mint-green/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-mint-green" />
                      <span className="text-sm font-medium text-cool-gray">Calories</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-soft-coral">{getTodaysCaloriesConsumed()}</p>
                      
                      <p className="text-xs text-cool-gray">of {
                        // @ts-expect-error type mismatch picked up
                      currentDietPlan.dailyCalories || currentDietPlan.daily_calories
                      } kcal</p>
                      <p className="text-xs text-mint-green">{getRemainingCalories()} remaining</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-soft-blue/10 to-soft-blue/5 rounded-xl border border-soft-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-soft-blue" />
                      <span className="text-sm font-medium text-cool-gray">Protein</span>
                    </div>
                    <p className="text-2xl font-bold text-soft-blue">{currentDietPlan.protein}</p>
                    <p className="text-xs text-cool-gray">daily target</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-soft-coral/10 to-soft-coral/5 rounded-xl border border-soft-coral/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Apple className="w-4 h-4 text-soft-coral" />
                      <span className="text-sm font-medium text-cool-gray">Carbs</span>
                    </div>
                    <p className="text-2xl font-bold text-soft-coral">{currentDietPlan.carbs}</p>
                    <p className="text-xs text-cool-gray">daily target</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-cool-gray">Fat</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{currentDietPlan.fat}</p>
                    <p className="text-xs text-cool-gray">daily target</p>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="p-4 bg-gradient-to-r from-mint-green/10 to-soft-blue/10 rounded-xl border border-mint-green/20">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-soft-blue mb-2">Exercise Plan</h4>
                      <p className="text-sm text-cool-gray mb-1">{currentDietPlan.exercise}</p>
                      <p className="text-sm text-mint-green">
                        Target: {currentDietPlan.caloriesBurned} calories burned
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-soft-coral mb-2">Nutritional Focus</h4>
                      <p className="text-sm text-cool-gray mb-1">Deficiencies: {currentDietPlan.deficiency}</p>
                      <p className="text-sm text-cool-gray">{currentDietPlan.notes}</p>
                    </div>
                  </div>
                </div>

                {/* Meal Suggestions Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-soft-blue">Today&apos;s Meal Suggestions</h4>
                   
                  </div>

                  {todayMealSuggestions.length > 0 ? (
                    <div className="space-y-3">
                      {todayMealSuggestions.map((meal) => (
                        <div
                          key={meal.id}
                          className="flex items-center justify-between p-4 bg-cool-gray/10 rounded-2xl border border-border bg-muted/50 hover:shadow-md transition-shadow"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-soft-blue border-soft-blue capitalize">
                                {meal.type}
                              </Badge>
                              <Badge variant="outline" className="text-mint-green border-mint-green">
                                {meal.cookingTime}
                              </Badge>
                              <Badge variant="outline" className="text-soft-coral border-soft-coral capitalize">
                                {meal.budget} budget
                              </Badge>
                            </div>
                            <p className="text-base font-semibold text-foreground">{meal.name}</p>
                            <p className="text-sm text-cool-gray">
                              {meal.cuisine} • {meal.difficulty}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <span className="text-base font-bold text-soft-coral">{meal.calories} cal</span>
                            <div className="text-xs text-cool-gray">
                              P: {meal.protein} | C: {meal.carbs} | F: {meal.fat}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gradient-to-r from-soft-coral/5 to-mint-green/5 rounded-xl border border-soft-coral/20">
                      <Utensils className="w-12 h-12 text-soft-coral mx-auto mb-3" />
                      <p className="text-soft-coral font-medium mb-2">Get Today&apos;s Meal Suggestions</p>
                      <p className="text-cool-gray text-sm mb-4">
                        Get personalized meal recommendations based on your diet plan and preferences
                      </p>
                      <Button
                        onClick={handleGenerateMeals}
                        className="bg-soft-coral hover:bg-soft-coral/90 text-white"
                        disabled={isLoadingMeals}
                      >
                        {isLoadingMeals  ? (
    <>
      <Loader /> Generating...
    </>
  ) : (
    <>
    Get Meal Ideas
    </>
  )}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <ChefHat className="w-16 h-16 text-soft-coral mx-auto mb-4" />
                <h3 className="text-lg font-medium text-soft-coral mb-2">No Active Diet Plan</h3>
                <p className="text-cool-gray mb-4">Get started with a personalized nutrition plan from AI</p>
                <div className="flex gap-2 justify-center">
                  <Button className="bg-soft-blue hover:bg-soft-blue/90 text-snow-white" asChild>
                    <Link href="/nutritionists">Find Nutritionist</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border border-soft-blue bg-transparent"
                    onClick={handleGenerateAIPlan}
                    disabled={isLoadingPlan}
                  >
                    {isLoadingPlan ? (
    <>
      <Loader2  className="w-4 h-4 animate-spin"/> Generating...
    </>
  ) : (
    "Generate AI Plan"
  )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Plan Generation Modal */}
     <Dialog open={isModalOpen} onOpenChange={resetModal}>
  <DialogContent className="w-[90vw] max-w-[600px] max-h-[85vh] overflow-y-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
    <DialogHeader className="mb-4">
      <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-soft-coral">
        <ChefHat className="w-5 h-5 text-soft-coral" />
        <span>Generate AI Diet Plan</span>
        <Sparkles className="w-4 h-4 text-mint-green animate-pulse" />
      </DialogTitle>
    </DialogHeader>

    {isLoadingPlan ? (
      <div className="flex flex-col items-center justify-center py-14">
        <div className="w-12 h-12 border-4 border-mint-green/30 border-t-mint-green rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-semibold text-dark-slate-gray mb-1">Generating Your Plan</h3>
        <p className="text-sm text-cool-gray text-center max-w-sm">
          Analyzing preferences and crafting your personalized diet plan...
        </p>
      </div>
    ) : (
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="goal" className="flex items-center gap-2 text-soft-blue font-medium">
            <Target className="w-4 h-4 text-soft-blue" />
            Primary Goal
          </Label>
          <Select
            value={formData.goal}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, goal: value }))}
          >
            <SelectTrigger className="h-10 rounded-lg border border-cool-gray/20 hover:border-soft-blue/40 transition-all">
              <SelectValue placeholder="Select goal" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-lg border shadow-md">
              {["weight-loss", "weight-gain", "muscle-gain", "maintenance", "general-health"].map((goal) => (
                <SelectItem
                  key={goal}
                  value={goal}
                  className="hover:bg-mint-green/90 hover:text-white rounded-md capitalize text-sm"
                >
                  {goal.replace("-", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-white font-medium py-2.5 rounded-lg shadow-md transition-all duration-200"
            disabled={isLoadingPlan}
          >
            {isLoadingPlan ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" /> Generate Plan
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={resetModal}
            className="bg-soft-coral text-white hover:bg-soft-coral/90 px-5 rounded-lg font-medium transition-all duration-200"
          >
            Cancel
          </Button>
        </div>
      </form>
    )}
  </DialogContent>
</Dialog>


      {/* Meal Preferences Modal */}
      <Dialog open={isMealModalOpen} onOpenChange={setIsMealModalOpen}>
        <DialogContent className="max-w-2xl bg-snow-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-soft-coral text-xl font-bold">
              <Utensils className="w-6 h-6 text-soft-coral" />
              Meal Preferences
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleMealPreferencesSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-soft-blue font-semibold">Budget</Label>
                <Select
                  value={mealPrefs.budget}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setMealPrefs((prev) => ({ ...prev, budget: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Budget</SelectItem>
                    <SelectItem value="medium">Medium Budget</SelectItem>
                    <SelectItem value="high">High Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-soft-blue font-semibold">Cooking Time</Label>
                <Select
                  value={mealPrefs.cookingTime}
                  onValueChange={(value: "quick" | "medium" | "long") =>
                    setMealPrefs((prev) => ({ ...prev, cookingTime: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quick">Quick (under 15 min)</SelectItem>
                    <SelectItem value="medium">Medium (15-30 min)</SelectItem>
                    <SelectItem value="long">Long (30+ min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-soft-blue font-semibold">Preferred Cuisines</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["Mediterranean", "Asian", "Mexican", "Italian", "Pakistani", "American"].map((cuisine) => (
                  <label
                    key={cuisine}
                    className="flex items-center gap-2 p-3 rounded-lg bg-cool-gray/10 hover:bg-cool-gray/20 cursor-pointer"
                  >
                    <Checkbox
                      checked={mealPrefs.cuisine.includes(cuisine)}
                      onCheckedChange={(checked: boolean) => handleCuisineChange(cuisine, checked)}
                    />
                    <span className="text-sm font-medium">{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-soft-coral hover:bg-soft-coral/90 text-white"
                disabled={isLoadingMeals}
              >
                {isLoadingMeals ?  (
    <>
      <Loader2 className="w-4 h-4 animate-spin" /> Generating...
    </>
  ) : (
    "Suggesting meals"
  )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsMealModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Replace Dialog */}
      <Dialog open={showConfirmReplace} onOpenChange={setShowConfirmReplace}>
        <DialogContent className="max-w-md bg-snow-white">
          <DialogHeader>
            <DialogTitle className="text-soft-coral">Replace Current Diet Plan?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-cool-gray">
              You currently have an active diet plan. Starting a new plan will replace your current progress. Are you
              sure you want to continue?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleConfirmReplace}
                className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
              >
                Yes, Replace Plan
              </Button>
              <Button
                onClick={() => setShowConfirmReplace(false)}
                className="hover:bg-soft-coral/90 hover:text-white bg-soft-coral hover:border-soft-coral transition-all duration-300 py-3 px-6 rounded-xl font-semibold"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete AI Plan Dialog */}
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent className="max-w-md bg-snow-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <Trash2 className="w-5 h-5" />
              Delete AI-Generated Diet Plan?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-cool-gray">
              This will permanently delete your AI-generated diet plan from local storage. This action cannot be undone. Are you sure?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={confirmDeleteAIPlan}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Yes, Delete Plan
              </Button>
              <Button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-cool-gray text-white hover:bg-cool-gray/90"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
