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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CheckCircle, FileText, Target, Plus } from "lucide-react"
import { useDoctorAppointmentStore } from "@/store/doctor/doctor-appointment-store"
import { useDoctorPrescriptionStore } from "@/store/doctor/doctor-prescription-store"
import { completeAppointment } from "@/api/doctor/appointmentApi"
import { toast } from "sonner"

export function MarkDoneModal() {
  const { selectedAppointment, setSelectedAppointment, markAppointmentDone } = useDoctorAppointmentStore()
  // ✅ Fixed: was `usePrescriptionStore` which doesn't exist — correct hook name
  const { addPrescription } = useDoctorPrescriptionStore()

  const [sessionNotes, setSessionNotes] = useState("")
  const [nextAction, setNextAction] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Prescription fields
  const [diagnosis, setDiagnosis] = useState("")
  const [medicationName, setMedicationName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [duration, setDuration] = useState("7")
  const [instructions, setInstructions] = useState("")
  const [prescriptionNotes, setPrescriptionNotes] = useState("")

  const open = !!selectedAppointment
  const appointment = selectedAppointment

  const handleMarkDone = async () => {
    if (!appointment) return

    // ✅ Validate before hitting API
    if (nextAction === "write-prescription") {
      if (!diagnosis.trim() || !medicationName.trim()) {
        toast.error("Missing Prescription Details", {
          description: "Please enter a diagnosis and at least one medication.",
        })
        return
      }
    }

    setIsLoading(true)

    try {
      // ✅ Fixed: calculate real start/end dates for the prescription
      const durationDays = parseInt(duration, 10)
      const startDate = new Date().toISOString().split("T")[0]
      const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]

      // ✅ Fixed: call the real backend API — POST /appointments/{id}/complete-doctor
      await completeAppointment(appointment.id, {
        report: sessionNotes.trim() || undefined,
        ...(nextAction === "write-prescription" && {
          prescription: {
            notes: prescriptionNotes.trim() || undefined,
            startDate,
            endDate,
            status: "active",
            // ✅ Fixed: backend expects medications as an array of objects, not flat fields
            medications: [
              {
                name: medicationName.trim(),
                dosage: dosage.trim(),
                frequency: frequency.trim(),
                duration: `${duration} days`,
                instructions: instructions.trim() || undefined,
              },
            ],
          },
        }),
      })

      // ✅ Update local store only after successful API call
      markAppointmentDone(appointment.id)

      // ✅ Also add to local prescription store for immediate UI reflection
      if (nextAction === "write-prescription") {
        addPrescription({
          id: `rx-${Date.now()}`,
          patientId: appointment.patient?.id,
          patientName: appointment.patient?.name ?? "",
          doctorId: localStorage.getItem("id") ?? undefined,
          diagnosis: diagnosis.trim(),
          // Store as JSON string to match backend shape; adjust if store type changes
          medications: JSON.stringify([
            {
              name: medicationName.trim(),
              dosage: dosage.trim(),
              frequency: frequency.trim(),
              duration: `${duration} days`,
              instructions: instructions.trim(),
            },
          ]),
          dosage: dosage.trim(),
          frequency: frequency.trim(),
          duration: `${duration} days`,
          notes: prescriptionNotes.trim(),
          startDate,
          followUpDate: endDate,
        })

        // ✅ Fixed: use toast instead of alert()
        toast.success("Prescription Issued", {
          description: `Prescription for "${diagnosis}" has been issued for ${appointment.patient?.name}.`,
        })
      } else {
        toast.success("Appointment Completed", {
          description: `Appointment with ${appointment.patient?.name} has been marked as done.`,
        })
      }

      handleClose()
    } catch (error: any) {
      console.error("Error completing appointment:", error)
      // ✅ Fixed: use toast instead of alert()
      toast.error("Failed to Complete Appointment", {
        description: error?.response?.data?.message ?? "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedAppointment(null)
    setSessionNotes("")
    setNextAction("")
    setDiagnosis("")
    setMedicationName("")
    setDosage("")
    setFrequency("")
    setDuration("7")
    setInstructions("")
    setPrescriptionNotes("")
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" style={{ color: "var(--color-mint-green)" }} />
            <span>Complete Appointment</span>
          </DialogTitle>
          <DialogDescription>
            Mark the appointment with <strong>{appointment.patient?.name}</strong> as completed and add clinical notes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session / Clinical Notes */}
          <div className="space-y-2">
            <Label htmlFor="session-notes" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" style={{ color: "var(--color-soft-blue)" }} />
              <span>Clinical Notes</span>
            </Label>
            <Textarea
              id="session-notes"
              placeholder="Document symptoms, diagnosis, treatment plan, observations, and patient progress..."
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Next Action */}
          <div className="space-y-2">
            <Label htmlFor="next-action" className="flex items-center space-x-2">
              <Target className="h-4 w-4" style={{ color: "var(--color-soft-coral)" }} />
              <span>Next Action Required</span>
            </Label>
            <Select value={nextAction} onValueChange={setNextAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select next action for this patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="write-prescription">Write Prescription</SelectItem>
                <SelectItem value="refer-specialist">Refer to Specialist</SelectItem>
                <SelectItem value="schedule-followup">Schedule Follow-up</SelectItem>
                <SelectItem value="no-action">No Immediate Action Required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prescription Form */}
          {nextAction === "write-prescription" && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center space-x-2 mb-3">
                <Plus className="h-4 w-4" style={{ color: "var(--color-mint-green)" }} />
                <h4 className="font-medium">Prescription Details</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    placeholder="e.g., Hypertension, Type 2 Diabetes, Upper Respiratory Infection"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medication-name">Medication Name</Label>
                  <Input
                    id="medication-name"
                    placeholder="e.g., Amoxicillin 500mg"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 1 tablet"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once-daily">Once daily</SelectItem>
                      <SelectItem value="twice-daily">Twice daily</SelectItem>
                      <SelectItem value="three-times-daily">Three times daily</SelectItem>
                      <SelectItem value="four-times-daily">Four times daily</SelectItem>
                      <SelectItem value="as-needed">As needed (PRN)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rx-duration">Duration (days)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days (chronic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* ✅ Added instructions field to match backend MedicationPayload */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Input
                    id="instructions"
                    placeholder="e.g., Take with food, avoid alcohol, store below 25°C"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="rx-notes">Prescription Notes</Label>
                  <Input
                    id="rx-notes"
                    placeholder="e.g., Review after 1 week"
                    value={prescriptionNotes}
                    onChange={(e) => setPrescriptionNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Patient Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Patient Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Type:</span>
                <p>{appointment.type}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Mode:</span>
                <p>{appointment.mode}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Date:</span>
                <p>{appointment.date}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Time:</span>
                <p>{appointment.time}</p>
              </div>
              {appointment.patient && (
                <>
                  <div>
                    <span className="font-medium text-muted-foreground">Weight:</span>
                    <p>{appointment.patient.weight ?? "N/A"} kg</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Height:</span>
                    <p>{appointment.patient.height ?? "N/A"} cm</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium text-muted-foreground">Conditions:</span>
                    <p>{appointment.patient.conditions || "None"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium text-muted-foreground">Allergies:</span>
                    <p>{appointment.patient.allergies || "None"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium text-muted-foreground">Current Medications:</span>
                    <p>{appointment.patient.medications || "None"}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full sm:w-auto bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleMarkDone}
            disabled={
              isLoading ||
              !sessionNotes.trim() ||
              (nextAction === "write-prescription" && (!diagnosis.trim() || !medicationName.trim()))
            }
            className="bg-[var(--color-mint-green)] hover:bg-[var(--color-mint-green)]/90 w-full sm:w-auto"
          >
            {isLoading
              ? "Completing..."
              : nextAction === "write-prescription"
                ? "Complete & Issue Prescription"
                : "Complete Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
