"use client"

import type React from "react"
import { ChefHat, Target, Utensils, Sparkles,  TrendingUp, Zap, Apple, File } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

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
  } = useDiet()



useEffect(() => {
  getDietPlan()
}, [])

  const fitness=useSelector((store:RootState)=>store.fitness)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMealModalOpen, setIsMealModalOpen] = useState(false)
  const [showConfirmReplace, setShowConfirmReplace] = useState(false)
 const patientName=useSelector((store:RootState)=>store.profile.name)



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


const handleDownloadDietPdf = async (
  dietPlan: any,

) => {
  try {
    dietPlan = {
      id: dietPlan?.id,
      dailyCalories: dietPlan.daily_calories ||dietPlan.dailyCalories,
      protein: dietPlan.protein,
      carbs: dietPlan.carbs,
      fat: dietPlan.fat,
      deficiency: dietPlan.deficiency,
      notes: dietPlan.notes,
      caloriesBurned: dietPlan.calories_burned || dietPlan.caloriesBurned,
      exercise: dietPlan.exercise,
      startDate: new Date(dietPlan.start_date),
      endDate: new Date(dietPlan.end_date),
      patientId: dietPlan.patient_id,
      patientName: dietPlan.patientName,
      nutritionistId: dietPlan.nutritionist_id,
    }

    console.log(dietPlan)
    const { default: jsPDF } = await import("jspdf")
    const autoTable = (await import("jspdf-autotable")).default

    const doc = new jsPDF({ unit: "pt", format: "a4" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    const primaryColor: [number, number, number] = [0, 131, 150]
    const grayText: [number, number, number] = [80, 80, 80]

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

    // Load logo
    let logoDataUrl: string | null = null
    try {
      logoDataUrl = await getBase64FromUrl("/logo/logo.png")
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

    // Get today’s date in format: 13 Sep 2025
    const today = new Date()
    const dateStr = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })

    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...primaryColor)
    doc.text(`Diet Plan (${dateStr})`, pageWidth / 2, 55, { align: "center" })

    // Patient name
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...grayText)
    doc.text(`Patient: ${patientName}`, pageWidth / 2, 75, { align: "center" })

    // Divider
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.7)
    doc.line(40, 95, pageWidth - 40, 95)

    let cursorY = 120

    // ===== Nutrition Summary =====
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...primaryColor)
    doc.text("Nutrition Summary", 40, cursorY)
    cursorY += 10

    autoTable(doc, {
      startY: cursorY,
      head: [["Nutrient", "Value"]],
      body: [
        ["Daily Calories", dietPlan.dailyCalories],
        ["Protein", dietPlan.protein],
        ["Carbohydrates", dietPlan.carbs],
        ["Fat", dietPlan.fat],
        ["Deficiency", dietPlan.deficiency],
      ],
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 6 },
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
      margin: { left: 40, right: 40 },
    })

    
    cursorY = (doc as any).lastAutoTable.finalY + 40

    // ===== Exercise Plan =====
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...primaryColor)
    doc.text("Exercise Plan", 40, cursorY)
    cursorY += 10

    autoTable(doc, {
      startY: cursorY,
      body: [
        ["Calories To Burn", dietPlan.caloriesBurned],
        ["Exercise", dietPlan.exercise],
      ],
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 6 },
      columnStyles: { 0: { fontStyle: "bold", textColor: primaryColor } },
      margin: { left: 40, right: 40 },
    })

   
    cursorY = (doc as any).lastAutoTable.finalY + 40

    // ===== Notes =====
    if (dietPlan.notes) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("Notes", 40, cursorY)
      cursorY += 15

      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(...grayText)

      const splitNotes = doc.splitTextToSize(dietPlan.notes, pageWidth - 80)
      doc.text(splitNotes, 60, cursorY)

      cursorY += splitNotes.length * 14 + 20
    }

    // ===== Today's Progress =====
    if (fitness) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("Today's Progress", 40, cursorY)
      cursorY += 15

      // Summary table (Calories + Macros)
      autoTable(doc, {
        startY: cursorY,
        head: [["Metric", "Value"]],
        body: [
          ["Calories Consumed", fitness.caloriesConsumed],
          ["Calories Burned", fitness.caloriesBurned],
          ["Protein (g)", fitness.proteinConsumed],
          ["Fat (g)", fitness.fatConsumed],
          ["Carbs (g)", fitness.carbsConsumed],
        ],
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 6 },
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
        margin: { left: 40, right: 40 },
      })

    
      cursorY = (doc as any).lastAutoTable.finalY + 40

      // Goals Table
      if (fitness.goals?.length > 0) {
        doc.setFontSize(13)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(...primaryColor)
        doc.text("Goals", 40, cursorY)
        cursorY += 10

        autoTable(doc, {
          startY: cursorY,
          head: [["Type", "Current", "Target", "Unit"]],
          body: fitness.goals.map((g) => [
            g.type,
            g.current,
            g.target,
            g.unit,
          ]),
          theme: "grid",
          styles: { fontSize: 11, cellPadding: 6 },
          headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
          margin: { left: 40, right: 40 },
        })

      
        cursorY = (doc as any).lastAutoTable.finalY + 40
      }

      // Activity Log for Today
      const todayDate = new Date().toISOString().split("T")[0]
      const todayStatus = fitness.activityLog.find(
        (d) => d.date === todayDate
      )

      if (todayStatus) {
        doc.setFontSize(13)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(...primaryColor)
        doc.text("Activity Log (Today)", 40, cursorY)
        cursorY += 10

        autoTable(doc, {
          startY: cursorY,
          head: [["Date", "Completed"]],
          body: [[todayStatus.date, todayStatus.completed ? "✅ Yes" : "❌ No"]],
          theme: "grid",
          styles: { fontSize: 11, cellPadding: 6 },
          headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
          margin: { left: 40, right: 40 },
        })

        cursorY = (doc as any).lastAutoTable.finalY + 40
      }
    }

    // ===== Footer =====
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 20, {
        align: "center",
      })
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
    const daily = Number.parseInt(currentDietPlan?.dailyCalories || "0")
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
               
              {
                currentDietPlan && 
                   <Button
                               size="sm"
                               className="text-snow-white bg-soft-blue border border-soft-blue hover:bg-soft-blue/90 hover:text-snow-white w-full sm:w-auto"
                              
                               onClick={()=>{
                    handleDownloadDietPdf(currentDietPlan!)
                  }}>
                
                    <File className="w-4 h-4 mr-2" />
                   
                   Downalod as Pdf
                </Button>
              }
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
                      <p className="text-xs text-cool-gray">of {currentDietPlan.dailyCalories} kcal</p>
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
                        {isLoadingMeals ? "Generating..." : "Get Meal Ideas"}
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
                    {isLoadingPlan ? "Generating..." : "Generate AI Plan"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Plan Generation Modal */}
      <Dialog open={isModalOpen} onOpenChange={resetModal}>
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[850px] xl:max-w-[1000px] 2xl:max-w-[1100px] max-h-[90vh] overflow-y-auto px-4 md:px-6 pt-6 pb-8 bg-snow-white rounded-3xl shadow-2xl border-0">
          <DialogHeader className="mb-6 relative">
            <DialogTitle className="flex items-center gap-3 text-soft-coral text-2xl font-bold relative z-10">
              <div className="p-2 bg-gradient-to-br from-soft-coral/10 to-soft-coral/20 rounded-xl">
                <ChefHat className="w-7 h-7 text-soft-coral" />
              </div>
              <span className="bg-gradient-to-r from-soft-coral to-soft-blue bg-clip-text text-transparent">
                Generate AI Diet Plan
              </span>
              <Sparkles className="w-5 h-5 text-mint-green animate-pulse" />
            </DialogTitle>
          </DialogHeader>

          {isLoadingPlan ? (
            <div className="flex flex-col items-center justify-center py-20 relative">
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 border-4 border-mint-green/30 border-t-mint-green rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-dark-slate-gray to-soft-blue bg-clip-text text-transparent">
                  Generating Your Personalized Plan
                </h3>
                <p className="text-cool-gray text-center max-w-md leading-relaxed">
                  Our AI is analyzing your preferences and creating a customized diet plan just for you...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-8">
             
              <div className="">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-soft-blue" />
                    <Label htmlFor="goal" className="text-soft-blue font-semibold">
                      Primary Goal
                    </Label>
                  </div>
                  <Select
                    value={formData.goal}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, goal: value }))}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 border-cool-gray/20 hover:border-soft-blue/50 transition-all">
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent className="bg-snow-white rounded-xl border-2 shadow-xl">
                      {["weight-loss", "weight-gain", "muscle-gain", "maintenance", "general-health"].map((goal) => (
                        <SelectItem
                          key={goal}
                          value={goal}
                          className="hover:text-snow-white hover:bg-mint-green rounded-lg m-1 capitalize font-medium"
                        >
                          {goal.replace("-", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

             
              </div>

              <div className="flex g pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-soft-blue to-soft-blue/90 hover:from-soft-blue/90 hover:to-soft-blue text-snow-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  disabled={isLoadingPlan}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isLoadingPlan ? "Generating..." : "Generate Plan"}
                </Button>
                <Button
                  type="button"
                  onClick={resetModal}
                  className="hover:bg-soft-coral/90 hover:text-white bg-soft-coral hover:border-soft-coral transition-all duration-300 py-3 px-6 rounded-xl font-semibold"
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
                {isLoadingMeals ? "Generating..." : "Get Meal Suggestions"}
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
    </>
  )
}
