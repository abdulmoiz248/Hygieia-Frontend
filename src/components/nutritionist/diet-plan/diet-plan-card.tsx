"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Edit, Calendar, Activity, Target, AlertTriangle } from "lucide-react"
import { EditDietPlanDialog } from "./edit-diet-plan-dialog"
import { DietPlan } from "@/store/nutritionist/diet-plan-store"




interface DietPlanCardProps {
  dietPlan: DietPlan
  onUpdate: (updatedPlan: DietPlan) => void
}

export function DietPlanCard({ dietPlan, onUpdate }: DietPlanCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const calculateProgress = () => {
    if (!dietPlan.startDate || !dietPlan.endDate) return 0
    const now = new Date()
    const start = new Date(dietPlan.startDate)
    const end = new Date(dietPlan.endDate)
    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    return Math.min(Math.max((elapsed / total) * 100, 0), 100)
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not set"
    return new Date(date).toLocaleDateString()
  }

  const getDaysRemaining = () => {
    if (!dietPlan.endDate) return null
    const now = new Date()
    const end = new Date(dietPlan.endDate)
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  const progress = calculateProgress()
  const daysRemaining = getDaysRemaining()

  return (
    <>
      <Card
        className="w-full hover:shadow-lg transition-shadow duration-200 border-l-4"
        style={{ borderLeftColor: "var(--color-soft-blue)" }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-balance">{dietPlan.patientName}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="hover:bg-soft-blue/10">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(dietPlan.startDate as Date)} - {formatDate(dietPlan.endDate as Date)}
            </span>
            {daysRemaining !== null && (
              <Badge variant="secondary" className="ml-2">
                {daysRemaining} days left
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Nutrition Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" style={{ color: "var(--color-mint-green)" }} />
                <span className="text-sm font-medium">Daily Calories</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: "var(--color-mint-green)" }}>
                {dietPlan.dailyCalories}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" style={{ color: "var(--color-soft-coral)" }} />
                <span className="text-sm font-medium">Calories Burned</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: "var(--color-soft-coral)" }}>
                {dietPlan.caloriesBurned}
              </p>
            </div>
          </div>

          {/* Macronutrients */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "var(--color-snow-white)" }}>
              <p className="text-sm text-muted-foreground">Protein</p>
              <p className="font-semibold">{dietPlan.protein}g</p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "var(--color-snow-white)" }}>
              <p className="text-sm text-muted-foreground">Carbs</p>
              <p className="font-semibold">{dietPlan.carbs}g</p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "var(--color-snow-white)" }}>
              <p className="text-sm text-muted-foreground">Fat</p>
              <p className="font-semibold">{dietPlan.fat}g</p>
            </div>
          </div>

          {/* Exercise */}
          {dietPlan.exercise && (
            <div className="p-3 rounded-lg border">
              <p className="text-sm font-medium mb-1">Exercise Plan</p>
              <p className="text-sm text-muted-foreground">{dietPlan.exercise}</p>
            </div>
          )}

          {/* Deficiency Alert */}
          {dietPlan.deficiency && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg"
              style={{ backgroundColor: "var(--color-soft-coral)", opacity: 0.1 }}
            >
              <AlertTriangle className="h-4 w-4 mt-0.5" style={{ color: "var(--color-soft-coral)" }} />
              <div>
                <p className="text-sm font-medium">Nutritional Deficiency</p>
                <p className="text-sm text-muted-foreground">{dietPlan.deficiency}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {dietPlan.notes && (
            <div className="p-3 rounded-lg border">
              <p className="text-sm font-medium mb-1">Notes</p>
              <p className="text-sm text-muted-foreground">{dietPlan.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EditDietPlanDialog dietPlan={dietPlan} open={isEditOpen} onOpenChange={setIsEditOpen} onSave={onUpdate} />
    </>
  )
}
