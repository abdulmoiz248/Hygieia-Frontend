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
import { CheckCircle, FileText, Target, Plus, Trash2 } from "lucide-react"
import { useDoctorAppointmentStore } from "@/store/doctor/appointment-store"
import { useDoctorPrescriptionStore } from "@/store/doctor/doctor-prescription-store"
import { completeAppointment } from "@/api/doctor/appointmentApi"
import { toast } from "sonner"

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  time: string
}

const DEFAULT_MEDICATION: Medication = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
  time: "",
}

export function MarkDoneModal() {
  const { selectedAppointment, setSelectedAppointment, markAppointmentDone } =
    useDoctorAppointmentStore()
  const { addPrescription } = useDoctorPrescriptionStore()

  const [report, setReport] = useState("")
  const [nextAction, setNextAction] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Prescription fields
  const [prescriptionNotes, setPrescriptionNotes] = useState("")
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  )
  const [medications, setMedications] = useState<Medication[]>([
    { ...DEFAULT_MEDICATION },
  ])

  const open = !!selectedAppointment
  const appointment = selectedAppointment

  const addMedication = () => {
    setMedications((prev) => [...prev, { ...DEFAULT_MEDICATION }])
  }

  const removeMedication = (index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index))
  }

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    setMedications((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    )
  }

  const handleMarkDone = async () => {
    if (!appointment) return

    setIsLoading(true)
    try {
      const doctorId = localStorage.getItem("id") || ""

      if (nextAction === "assign-prescription") {
        const hasEmptyMedName = medications.some((m) => !m.name.trim())
        if (hasEmptyMedName) {
          toast.error("Please fill in medication names for all entries.")
          setIsLoading(false)
          return
        }

        await completeAppointment(appointment.id, {
          doctorId,
          dto: {
            report: report.trim(),
            prescription: {
              notes: prescriptionNotes.trim(),
              startDate,
              endDate,
              status: "active",
              medications: medications.map((m) => ({
                name: m.name,
                dosage: m.dosage,
                frequency: m.frequency,
                duration: m.duration,
                instructions: m.instructions,
                time: m.time,
              })),
            },
          },
        })

        // Optimistically add to local prescription store
        addPrescription({
          diagnosis: report.trim(),
          medications: JSON.stringify(medications),
          dosage: medications[0]?.dosage || "",
          frequency: medications[0]?.frequency || "",
          duration: medications[0]?.duration || "",
          notes: prescriptionNotes.trim(),
          followUpDate: endDate,
          startDate,
          patientId: appointment.patient?.id || appointment.id,
          patientName: appointment.patient?.name || "",
          doctorId,
        })

        toast.success("Appointment completed & prescription assigned!", {
          description: `Prescription issued for ${appointment.patient?.name}.`,
        })
      } else {
        // Complete without prescription
        await completeAppointment(appointment.id, {
          doctorId,
          dto: {
            report: report.trim(),
          },
        })

        toast.success("Appointment completed!", {
          description: `Session with ${appointment.patient?.name} marked as done.`,
        })
      }

      markAppointmentDone(appointment.id)
      handleClose()
    } catch (error) {
      console.error("Error completing appointment:", error)
      toast.error("Error completing appointment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedAppointment(null)
    setReport("")
    setNextAction("")
    setPrescriptionNotes("")
    setStartDate(new Date().toISOString().split("T")[0])
    setEndDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    )
    setMedications([{ ...DEFAULT_MEDICATION }])
  }

  const isSubmitDisabled =
    isLoading ||
    !report.trim() ||
    (nextAction === "assign-prescription" &&
      medications.some((m) => !m.name.trim()))

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle
              className="h-5 w-5"
              style={{ color: "var(--color-mint-green)" }}
            />
            <span>Complete Appointment</span>
          </DialogTitle>
          <DialogDescription>
            Mark the appointment with{" "}
            <strong>{appointment.patient?.name}</strong> as completed and add a
            session report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Report */}
          <div className="space-y-2">
            <Label
              htmlFor="session-report"
              className="flex items-center space-x-2"
            >
              <FileText
                className="h-4 w-4"
                style={{ color: "var(--color-soft-blue)" }}
              />
              <span>Session Report / Diagnosis</span>
            </Label>
            <Textarea
              id="session-report"
              placeholder="Document the consultation, diagnosis, patient progress, concerns discussed, and any observations..."
              value={report}
              onChange={(e) => setReport(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Next Action */}
          <div className="space-y-2">
            <Label
              htmlFor="next-action"
              className="flex items-center space-x-2"
            >
              <Target
                className="h-4 w-4"
                style={{ color: "var(--color-soft-coral)" }}
              />
              <span>Next Action Required</span>
            </Label>
            <Select value={nextAction} onValueChange={setNextAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select next action for this patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assign-prescription">
                  Assign Prescription
                </SelectItem>
                <SelectItem value="no-action">
                  No Immediate Action Required
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prescription Form */}
          {nextAction === "assign-prescription" && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center space-x-2 mb-3">
                <Plus
                  className="h-4 w-4"
                  style={{ color: "var(--color-mint-green)" }}
                />
                <h4 className="font-medium">Prescription Details</h4>
              </div>

              {/* Date range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Prescription notes */}
              <div className="space-y-2">
                <Label htmlFor="prescription-notes">
                  Prescription Notes{" "}
                  <span className="text-cool-gray font-normal">(Optional)</span>
                </Label>
                <Textarea
                  id="prescription-notes"
                  placeholder="Additional instructions or notes for the patient..."
                  value={prescriptionNotes}
                  onChange={(e) => setPrescriptionNotes(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
              </div>

              {/* Medications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>
                    Medications{" "}
                    <span className="text-soft-coral">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMedication}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Medication
                  </Button>
                </div>

                {medications.map((med, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-white/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-cool-gray uppercase tracking-wide">
                        Medication {index + 1}
                      </span>
                      {medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="text-soft-coral hover:text-soft-coral/80 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">
                          Name <span className="text-soft-coral">*</span>
                        </Label>
                        <Input
                          placeholder="e.g., Amoxicillin"
                          value={med.name}
                          onChange={(e) =>
                            updateMedication(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Dosage</Label>
                        <Input
                          placeholder="e.g., 500mg"
                          value={med.dosage}
                          onChange={(e) =>
                            updateMedication(index, "dosage", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Frequency</Label>
                        <Input
                          placeholder="e.g., Twice daily"
                          value={med.frequency}
                          onChange={(e) =>
                            updateMedication(
                              index,
                              "frequency",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Duration</Label>
                        <Input
                          placeholder="e.g., 7 days"
                          value={med.duration}
                          onChange={(e) =>
                            updateMedication(index, "duration", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Time</Label>
                        <Input
                          placeholder="e.g., After meals"
                          value={med.time}
                          onChange={(e) =>
                            updateMedication(index, "time", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Instructions</Label>
                        <Input
                          placeholder="e.g., Take with water"
                          value={med.instructions}
                          onChange={(e) =>
                            updateMedication(
                              index,
                              "instructions",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patient Info Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Patient Information</h4>
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
                    <span className="font-medium text-muted-foreground">
                      Weight:
                    </span>
                    <p>{appointment.patient.weight} kg</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Height:
                    </span>
                    <p>{appointment.patient.height} cm</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium text-muted-foreground">
                      Conditions:
                    </span>
                    <p>{appointment.patient.conditions || "None"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium text-muted-foreground">
                      Allergies:
                    </span>
                    <p>{appointment.patient.allergies || "None"}</p>
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
            disabled={isSubmitDisabled}
            className="bg-[var(--color-mint-green)] hover:bg-[var(--color-mint-green)]/90 w-full sm:w-auto"
          >
            {isLoading
              ? "Completing..."
              : nextAction === "assign-prescription"
                ? "Complete & Assign Prescription"
                : "Complete Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
