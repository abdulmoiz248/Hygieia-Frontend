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
import { CalendarIcon, Plus, Trash2, Pill } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  time?: string
}

export interface PrescriptionFormData {
  notes: string
  startDate: Date
  endDate: Date
  medications: Medication[]
}

interface PrescriptionDialogProps {
  patientName: string
  onAssign: (prescription: PrescriptionFormData) => void
}

const emptyMedication = (): Medication => ({
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
  time: "",
})

const frequencySuggestions = ["Once daily", "Twice daily", "Three times daily", "Every 8 hours", "Every 12 hours", "As needed"]
const timeSuggestions = ["Morning", "Afternoon", "Evening", "Before meals", "After meals", "At bedtime"]

export function PrescriptionDialog({ patientName, onAssign }: PrescriptionDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<PrescriptionFormData>({
    notes: "",
    startDate: new Date(),
    endDate: new Date(),
    medications: [emptyMedication()],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAssign(formData)
    setOpen(false)
    setFormData({
      notes: "",
      startDate: new Date(),
      endDate: new Date(),
      medications: [emptyMedication()],
    })
  }

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }))
  }

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, emptyMedication()],
    }))
  }

  const removeMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }))
  }

  const isFormIncomplete =
    !formData.startDate ||
    !formData.endDate ||
    formData.medications.some((m) => !m.name || !m.dosage || !m.frequency || !m.duration)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-mint-green hover:bg-mint-green/90 text-white w-full shadow-md">
          <Pill className="w-4 h-4 mr-2" />
          Assign Prescription
        </Button>
      </DialogTrigger>
      <DialogContent className="scrollbar-hidden sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl [&::-webkit-scrollbar]:hidden">
        <DialogHeader>
          <DialogTitle className="text-soft-blue text-xl">Assign Prescription</DialogTitle>
          <DialogDescription className="text-dark-slate-gray/70">
            Create a prescription for{" "}
            <span className="font-semibold text-soft-coral">{patientName}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
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
                    {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-lg shadow-lg">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: date as Date,
                        endDate: date as Date,
                      }))
                    }
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
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
                    selected={formData.endDate}
                    onSelect={(date) =>
                      setFormData((prev) => ({ ...prev, endDate: date as Date }))
                    }
                    disabled={(date) => !formData.startDate || date < formData.startDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Medications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-soft-blue font-semibold">Medications</Label>
              <Button
                type="button"
                size="sm"
                onClick={addMedication}
                className="bg-soft-blue/10 text-soft-blue border border-soft-blue hover:bg-soft-blue hover:text-white rounded-lg"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Medication
              </Button>
            </div>

            {formData.medications.map((med, index) => (
              <div
                key={index}
                className="border border-soft-blue/20 rounded-xl p-4 space-y-3 bg-cool-gray/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-soft-coral">
                    Medication {index + 1}
                  </span>
                  {formData.medications.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeMedication(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-soft-blue">Drug Name *</Label>
                    <Input
                      placeholder="e.g., Amoxicillin"
                      value={med.name}
                      onChange={(e) => updateMedication(index, "name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-soft-blue">Dosage *</Label>
                    <Input
                      placeholder="e.g., 500mg"
                      value={med.dosage}
                      onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-soft-blue">Frequency *</Label>
                    <Input
                      placeholder="e.g., Twice daily"
                      value={med.frequency}
                      onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                      required
                    />
                    <div className="flex flex-wrap gap-1 pt-1">
                      {frequencySuggestions.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => updateMedication(index, "frequency", f)}
                          className="text-xs px-2 py-0.5 rounded-full border border-soft-blue/30 text-soft-blue hover:bg-soft-blue hover:text-white transition-colors"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-soft-blue">Duration *</Label>
                    <Input
                      placeholder="e.g., 7 days"
                      value={med.duration}
                      onChange={(e) => updateMedication(index, "duration", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-soft-blue">Timing</Label>
                    <Input
                      placeholder="e.g., After meals"
                      value={med.time}
                      onChange={(e) => updateMedication(index, "time", e.target.value)}
                    />
                    <div className="flex flex-wrap gap-1 pt-1">
                      {timeSuggestions.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => updateMedication(index, "time", t)}
                          className="text-xs px-2 py-0.5 rounded-full border border-mint-green/30 text-mint-green hover:bg-mint-green hover:text-white transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-soft-blue">Special Instructions</Label>
                    <Input
                      placeholder="e.g., Avoid alcohol"
                      value={med.instructions}
                      onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-soft-blue">
              Prescription Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional instructions, warnings, or follow-up details..."
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
              Assign Prescription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
