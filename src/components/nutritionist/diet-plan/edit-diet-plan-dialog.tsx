"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarComponent as Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DietPlan } from "@/store/nutritionist/diet-plan-store"

interface EditDietPlanDialogProps {
  dietPlan: DietPlan
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedPlan: DietPlan) => void
}

export function EditDietPlanDialog({ dietPlan, open, onOpenChange, onSave }: EditDietPlanDialogProps) {
  const [formData, setFormData] = useState<DietPlan>(dietPlan)

  const deficiencySuggestions = ["Iron", "Vitamin D", "Calcium", "Magnesium", "Vitamin B12", "Zinc"]
  const exerciseSuggestions = ["Cardio", "Strength Training", "Yoga", "Cycling", "Swimming", "HIIT"]

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  const handleInputChange = (field: keyof DietPlan, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormIncomplete =
    !formData.dailyCalories || !formData.protein || !formData.carbs || !formData.fat || !formData.startDate || !formData.endDate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="scrollbar-hidden sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl [&::-webkit-scrollbar]:hidden">
        <DialogHeader>
          <DialogTitle className="text-soft-blue text-xl">Edit Diet Plan</DialogTitle>
          <DialogDescription className="text-dark-slate-gray/70">
            Update the plan for <span className="font-semibold text-soft-coral">{dietPlan.patientName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Calories + Protein */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-soft-blue">Daily Calories</Label>
              <Input
                type="number"
                placeholder="2000"
                value={formData.dailyCalories}
                onChange={(e) => handleInputChange("dailyCalories", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-soft-blue">Protein (g)</Label>
              <Input
                type="number"
                placeholder="150"
                value={formData.protein}
                onChange={(e) => handleInputChange("protein", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Carbs + Fat */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-soft-blue">Carbs (g)</Label>
              <Input
                type="number"
                placeholder="200"
                value={formData.carbs}
                onChange={(e) => handleInputChange("carbs", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-soft-blue">Fat (g)</Label>
              <Input
                type="number"
                placeholder="70"
                value={formData.fat}
                onChange={(e) => handleInputChange("fat", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Calories Burned */}
          <div className="space-y-2">
            <Label className="text-soft-blue">Calories Burned</Label>
            <Input
              type="number"
              placeholder="500"
              value={formData.caloriesBurned}
              onChange={(e) => handleInputChange("caloriesBurned", e.target.value)}
            />
          </div>

          {/* Exercise */}
          <div className="space-y-2">
            <Label className="text-soft-blue">Exercise Recommendations</Label>
            <Textarea
              placeholder="e.g., 30 min cardio, strength training 3x/week"
              value={formData.exercise}
              onChange={(e) => handleInputChange("exercise", e.target.value)}
              rows={2}
              className="rounded-lg"
            />
            <div className="flex flex-wrap gap-2 pt-2">
              {exerciseSuggestions.map((ex) => (
                <Button
                  key={ex}
                  type="button"
                  className="rounded-full px-3 py-1 text-xs bg-soft-blue/10 text-dark-slate-gray border border-soft-blue/50 hover:bg-soft-blue hover:text-white"
                  onClick={() => setFormData((prev) => ({ ...prev, exercise: prev.exercise ? prev.exercise + ", " + ex : ex }))}
                >
                  {ex}
                </Button>
              ))}
            </div>
          </div>

          {/* Deficiency */}
          <div className="space-y-2">
            <Label className="text-soft-blue">Deficiency</Label>
            <Input
              type="text"
              placeholder="Iron, Vitamin D, etc."
              value={formData.deficiency}
              onChange={(e) => handleInputChange("deficiency", e.target.value)}
            />
            <div className="flex flex-wrap gap-2 pt-2">
              {deficiencySuggestions.map((def) => (
                <Button
                  key={def}
                  type="button"
                  className="rounded-full px-3 py-1 text-xs bg-mint-green/10 text-dark-slate-gray border border-soft-blue/50 hover:bg-mint-green"
                  onClick={() => setFormData((prev) => ({ ...prev, deficiency: prev.deficiency ? prev.deficiency + ", " + def : def }))}
                >
                  {def}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-soft-blue">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-lg border border-soft-blue/50",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(new Date(formData.startDate), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-lg shadow-lg">
                  <Calendar
                    mode="single"
                    selected={formData.startDate as Date}
                    onSelect={(date) => handleInputChange("startDate", date as Date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-soft-blue">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-lg border border-soft-blue/50",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(new Date(formData.endDate), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-lg shadow-lg">
                  <Calendar
                    mode="single"
                    selected={formData.endDate as Date}
                    onSelect={(date) => handleInputChange("endDate", date as Date)}
                    disabled={(date) => !formData.startDate || date < (formData.startDate as Date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-soft-blue">Notes</Label>
            <Textarea
              placeholder="Additional notes or restrictions..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="rounded-lg"
            />
          </div>
        </div>

        <DialogFooter className="pt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-mint-green hover:bg-mint-green/90 rounded-xl px-6"
            disabled={isFormIncomplete}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
