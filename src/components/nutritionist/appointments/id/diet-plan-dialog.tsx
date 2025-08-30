"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarComponent as Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Utensils } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DietPlan } from "@/store/nutritionist/diet-plan-store"


interface DietPlanDialogProps {
  patientName: string
  onAssign: (dietPlan: DietPlan) => void
}

export function DietPlanDialog({ patientName, onAssign }: DietPlanDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<DietPlan>({
    dailyCalories: "",
    protein: "",
    carbs: "",
    fat: "",
    deficiency: "",
    notes: "",
    caloriesBurned: "",
    exercise: "",
    startDate: new Date(),
    endDate: new Date(),
    patientName: patientName,
  })

  const deficiencySuggestions = ["Iron", "Vitamin D", "Calcium", "Magnesium", "Vitamin B12", "Zinc"]
  const exerciseSuggestions = ["Cardio", "Strength Training", "Yoga", "Cycling", "Swimming", "HIIT"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAssign(formData)
    setOpen(false)
    setFormData({
      dailyCalories: "",
      protein: "",
      carbs: "",
      fat: "",
      deficiency: "",
      notes: "",
      caloriesBurned: "",
      exercise: "",
      startDate: new Date(),
      endDate: new Date(),
      patientName,
    })
  }


  const today = new Date().toISOString().split("T")[0];

  const isFormIncomplete =
    !formData.dailyCalories || !formData.protein || !formData.carbs || !formData.fat || !formData.startDate || !formData.endDate

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button className="bg-mint-green hover:bg-mint-green/90 text-white w-full shadow-md">
          <Utensils className="w-4 h-4 mr-2" />
          Assign Diet Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="scrollbar-hidden sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl [&::-webkit-scrollbar]:hidden
">
        <DialogHeader>
          <DialogTitle className="text-soft-blue text-xl">Assign Diet & Exercise Plan</DialogTitle>
          <DialogDescription className="text-dark-slate-gray/70">
            Create a personalized diet & workout plan for <span className="font-semibold text-soft-coral">{patientName}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories" className="text-soft-blue">Daily Calories</Label>
              <Input
                id="calories"
                type="number"
                min={1}
                placeholder="2000"
                value={formData.dailyCalories}
                onChange={(e) => setFormData((prev) => ({ ...prev, dailyCalories: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein" className="text-soft-blue">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                min={1}
                placeholder="150"
                value={formData.protein}
                onChange={(e) => setFormData((prev) => ({ ...prev, protein: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carbs" className="text-soft-blue">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number" min={1}
                placeholder="200"
                value={formData.carbs}
                onChange={(e) => setFormData((prev) => ({ ...prev, carbs: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat" className="text-soft-blue">Fat (g)</Label>
              <Input
                id="fat"
                min={1}
                type="number"
                placeholder="70"
                value={formData.fat}
                onChange={(e) => setFormData((prev) => ({ ...prev, fat: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caloriesBurned" className="text-soft-blue">Calories Burned (target)</Label>
            <Input
              id="caloriesBurned"
              type="number"
min={1}
              placeholder="500"
              value={formData.caloriesBurned}
              onChange={(e) => setFormData((prev) => ({ ...prev, caloriesBurned: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exercise" className="text-soft-blue">Exercise Recommendations</Label>
            <Textarea
              id="exercise"
              placeholder="e.g., 30 min cardio, strength training 3x/week"
              value={formData.exercise}
              onChange={(e) => setFormData((prev) => ({ ...prev, exercise: e.target.value }))}
              rows={2}
              className="rounded-lg"
            />
            <div className="flex flex-wrap gap-2 pt-2">
              {exerciseSuggestions.map((ex) => (
                <Button
                  key={ex}
                  type="button"
                  className="rounded-full px-3 py-1 text-xs bg-soft-blue/10 text-dark-slate-gray border-2 border-black hover:bg-soft-blue hover:text-white"
                  onClick={() => setFormData((prev) => ({ ...prev, exercise: prev.exercise ? prev.exercise + ", " + ex : ex }))}
                >
                  {ex}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deficiency" className="text-soft-blue">Deficiency (if any)</Label>
            <Input
              id="deficiency"
              type="text"
              placeholder="e.g., Iron, Vitamin D, Calcium"
              value={formData.deficiency}
              onChange={(e) => setFormData((prev) => ({ ...prev, deficiency: e.target.value }))}
            />
            <div className="flex flex-wrap gap-2 pt-2">
              {deficiencySuggestions.map((def) => (
                <Button
                  key={def}
                  type="button"
                  className="rounded-full px-3 py-1 text-xs bg-mint-green/10 text-dark-slate-gray border-2 border-black hover:bg-mint-green"
                  onClick={() => setFormData((prev) => ({ ...prev, deficiency: prev.deficiency ? prev.deficiency + ", " + def : def }))}
                >
                  {def}
                </Button>
              ))}
            </div>
          </div>

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
          {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-lg shadow-lg">
        <Calendar
          mode="single"
          selected={formData.startDate as Date}
          onSelect={(date) => setFormData((prev) => ({ ...prev, startDate: date as Date, endDate: date as Date }))} 
          disabled={(date) => date < new Date()} // disable past dates
          initialFocus
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
          {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-lg shadow-lg">
        <Calendar
          mode="single"
          selected={formData.endDate as Date}
          onSelect={(date) => setFormData((prev) => ({ ...prev, endDate: date as Date}))} 
          disabled={(date) => !formData.startDate || date < formData.startDate} // disable before start
          initialFocus
        />
      </PopoverContent>
    </Popover>
  </div>
</div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-soft-blue">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Special dietary instructions, restrictions, or recommendations..."
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="rounded-lg"
            />
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-mint-green hover:bg-mint-green/90 rounded-xl px-6"
              disabled={isFormIncomplete}
            >
              Assign Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
