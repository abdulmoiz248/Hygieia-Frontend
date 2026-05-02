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
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Prescription } from "@/store/doctor/doctor-prescription-store"

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  time: string
}

interface EditPrescriptionDialogProps {
  prescription: Prescription
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedPrescription: Prescription) => void
}

export function EditPrescriptionDialog({
  prescription,
  open,
  onOpenChange,
  onSave,
}: EditPrescriptionDialogProps) {
  const parseMedications = (): Medication[] => {
    if (!prescription.medications) return [emptyMedication()]
    try {
      const parsed = JSON.parse(prescription.medications as string)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [emptyMedication()]
    } catch {
      return [emptyMedication()]
    }
  }

  const emptyMedication = (): Medication => ({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    time: "",
  })

  const [formData, setFormData] = useState<Prescription>(prescription)
  const [medications, setMedications] = useState<Medication[]>(parseMedications)

  const frequencySuggestions = ["Once daily", "Twice daily", "Three times daily", "Every 8 hours", "As needed", "With meals"]
  const durationSuggestions = ["3 days", "5 days", "7 days", "10 days", "14 days", "1 month"]

  const handleSave = () => {
    const updatedPrescription: Prescription = {
      ...formData,
      medications: JSON.stringify(medications),
    }
    onSave(updatedPrescription)
    onOpenChange(false)
  }

  const handleInputChange = (field: keyof Prescription, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    setMedications((prev) => prev.map((med, i) => (i === index ? { ...med, [field]: value } : med)))
  }

  const addMedication = () => {
    setMedications((prev) => [...prev, emptyMedication()])
  }

  const removeMedication = (index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index))
  }

  const isFormIncomplete =
    !formData.diagnosis ||
    !formData.startDate ||
    !formData.followUpDate ||
    medications.some((m) => !m.name || !m.dosage)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="scrollbar-hidden sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl [&::-webkit-scrollbar]:hidden">
        <DialogHeader>
          <DialogTitle className="text-soft-blue text-xl">Edit Prescription</DialogTitle>
          <DialogDescription className="text-dark-slate-gray/70">
            Update the prescription for{" "}
            <span className="font-semibold text-soft-coral">{prescription.patientName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Diagnosis */}
          <div className="space-y-2">
            <Label className="text-soft-blue">Diagnosis</Label>
            <Textarea
              placeholder="Enter diagnosis..."
              value={formData.diagnosis}
              onChange={(e) => handleInputChange("diagnosis", e.target.value)}
              rows={2}
              className="rounded-lg"
              required
            />
          </div>

          {/* Medications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-soft-blue">Medications</Label>
              <Button
                type="button"
                size="sm"
                onClick={addMedication}
                className="rounded-full px-3 py-1 text-xs bg-soft-blue/10 text-dark-slate-gray border border-soft-blue/50 hover:bg-soft-blue hover:text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Medication
              </Button>
            </div>

            {medications.map((med, index) => (
              <div key={index} className="p-4 rounded-xl border border-soft-blue/20 bg-white/60 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-soft-blue">Medication {index + 1}</p>
                  {medications.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeMedication(index)}
                      className="h-7 w-7 p-0 text-soft-coral hover:bg-soft-coral/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Name *</Label>
                    <Input
                      placeholder="e.g., Amoxicillin"
                      value={med.name}
                      onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Dosage *</Label>
                    <Input
                      placeholder="e.g., 500mg"
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Frequency</Label>
                    <Input
                      placeholder="e.g., Twice daily"
                      value={med.frequency}
                      onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Duration</Label>
                    <Input
                      placeholder="e.g., 7 days"
                      value={med.duration}
                      onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Time</Label>
                    <Input
                      placeholder="e.g., After meals"
                      value={med.time}
                      onChange={(e) => handleMedicationChange(index, "time", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Instructions</Label>
                    <Input
                      placeholder="e.g., With water"
                      value={med.instructions}
                      onChange={(e) => handleMedicationChange(index, "instructions", e.target.value)}
                    />
                  </div>
                </div>

                {/* Frequency suggestions */}
                <div className="flex flex-wrap gap-2">
                  {frequencySuggestions.map((freq) => (
                    <Button
                      key={freq}
                      type="button"
                      className="rounded-full px-3 py-1 text-xs bg-soft-blue/10 text-dark-slate-gray border border-soft-blue/50 hover:bg-soft-blue hover:text-white"
                      onClick={() => handleMedicationChange(index, "frequency", freq)}
                    >
                      {freq}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Duration suggestions */}
          <div className="space-y-2">
            <Label className="text-soft-blue">Quick Duration Presets</Label>
            <div className="flex flex-wrap gap-2">
              {durationSuggestions.map((dur) => (
                <Button
                  key={dur}
                  type="button"
                  className="rounded-full px-3 py-1 text-xs bg-mint-green/10 text-dark-slate-gray border border-soft-blue/50 hover:bg-mint-green"
                  onClick={() =>
                    setMedications((prev) => prev.map((m) => ({ ...m, duration: dur })))
                  }
                >
                  {dur}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-4 block">
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
              <Label className="text-soft-blue">Follow-up / End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-lg border border-soft-blue/50",
                      !formData.followUpDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.followUpDate
                      ? format(new Date(formData.followUpDate), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-lg shadow-lg">
                  <Calendar
                    mode="single"
                    selected={formData.followUpDate as Date}
                    onSelect={(date) => handleInputChange("followUpDate", date as Date)}
                    disabled={(date) =>
                      !formData.startDate || date < (formData.startDate as Date)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-soft-blue">Notes</Label>
            <Textarea
              placeholder="Additional notes or instructions..."
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
