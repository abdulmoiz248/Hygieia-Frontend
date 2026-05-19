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
import { CheckCircle, FileText, Target, Plus, CalendarIcon } from "lucide-react"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"
import { useDietPlanStore } from "@/store/nutritionist/diet-plan-store"
import { useFollowUpRequest } from "@/hooks/nutritionist/useFollowUpRequest"
import { CalendarComponent as Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function MarkDoneModal() {
  const { selectedAppointment, setSelectedAppointment, markAppointmentDone } = useAppointmentStore()
  const { addDietPlan } = useDietPlanStore()
  const [sessionNotes, setSessionNotes] = useState("")
  const [nextAction, setNextAction] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Follow-up state
  const [followUpReason, setFollowUpReason] = useState("")
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined)
  const { mutate: requestFollowUp, isPending: isFollowUpPending } = useFollowUpRequest()

  const [planName, setPlanName] = useState("")
  const [planDuration, setPlanDuration] = useState("90")
  const [calorieTarget, setCalorieTarget] = useState("2000")
  const [goals, setGoals] = useState("")

  const open = !!selectedAppointment
  const appointment = selectedAppointment

  const handleMarkDone = async () => {
    if (!appointment) return

    setIsLoading(true)

    try {
      console.log("[v0] Starting appointment completion for:", appointment.patient?.name)
      console.log("[v0] Next action selected:", nextAction)

      markAppointmentDone(appointment.id)

      // Fire follow-up request if selected
      if (nextAction === "request-follow-up" && followUpReason.trim() && followUpDate) {
        const nutritionistId = localStorage.getItem("id") || ""
        requestFollowUp({
          patientId: appointment.patient?.id || appointment.id,
          providerId: nutritionistId,
          providerRole: "nutritionist",
          reason: followUpReason.trim(),
          suggestedDate: format(followUpDate, "yyyy-MM-dd"),
        })
      }

      if (nextAction === "assign-diet-plan") {
        if (!planName.trim()) {
          alert("Please enter a plan name")
          setIsLoading(false)
          return
        }

        const newDietPlan:any = {
          id: `diet-${Date.now()}`,
          patientId: appointment.patient?.id || appointment.id,
          patientName: appointment.patient?.name || "",
          //patientAvatar: appointment.patient?.avatar,
          planName: planName.trim(),
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + Number.parseInt(planDuration) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          status: "active" as const,
          compliance: 0,
          lastUpdate: "Just created",
          goals: goals
            ? goals
                .split(",")
                .map((g) => g.trim())
                .filter((g) => g.length > 0)
            : ["Improve overall health", "Follow nutritional guidelines"],
          restrictions: appointment.patient?.allergies ? [appointment.patient.allergies] : [],
          calories: Number.parseInt(calorieTarget) || 2000,
          macros: { protein: 25, carbs: 45, fat: 30 },
          meals: {
            breakfast: ["Oatmeal with fruits", "Greek yogurt", "Green tea"],
            lunch: ["Grilled chicken salad", "Quinoa", "Vegetables"],
            dinner: ["Baked fish", "Brown rice", "Steamed broccoli"],
            snacks: ["Mixed nuts", "Apple", "Herbal tea"],
          },
          progress: [],
          sessionNotes: sessionNotes.trim(),
        }

        console.log("[v0] Creating diet plan:", newDietPlan)
        addDietPlan(newDietPlan)
        console.log("[v0] Diet plan added to store for:", appointment.patient?.name)

        alert(`Diet plan "${planName}" has been created for ${appointment.patient?.name}!`)
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("[v0] Appointment completion successful")

      handleClose()
    } catch (error) {
      console.error("[v0] Error completing appointment:", error)
      alert("Error completing appointment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedAppointment(null)
    setSessionNotes("")
    setNextAction("")
    setFollowUpReason("")
    setFollowUpDate(undefined)
    setPlanName("")
    setPlanDuration("90")
    setCalorieTarget("2000")
    setGoals("")
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
            Mark the appointment with <strong>{appointment.patient?.name}</strong> as completed and add session notes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Notes */}
          <div className="space-y-2">
            <Label htmlFor="session-notes" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" style={{ color: "var(--color-soft-blue)" }} />
              <span>Session Notes</span>
            </Label>
            <Textarea
              id="session-notes"
              placeholder="Document the consultation, patient progress, concerns discussed, and any observations..."
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
                <SelectItem value="assign-diet-plan">Assign New Diet Plan</SelectItem>
                <SelectItem value="request-follow-up">Request Follow-up Appointment</SelectItem>
                <SelectItem value="no-action">No Immediate Action Required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {nextAction === "assign-diet-plan" && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center space-x-2 mb-3">
                <Plus className="h-4 w-4" style={{ color: "var(--color-mint-green)" }} />
                <h4 className="font-medium">Diet Plan Details</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    placeholder="e.g., Weight Loss Plan, Diabetes Management"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan-duration">Duration (days)</Label>
                  <Select value={planDuration} onValueChange={setPlanDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">6 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calorie-target">Daily Calorie Target</Label>
                  <Input
                    id="calorie-target"
                    type="number"
                    placeholder="2000"
                    value={calorieTarget}
                    onChange={(e) => setCalorieTarget(e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="goals">Goals (comma-separated)</Label>
                  <Input
                    id="goals"
                    placeholder="Lose weight, Improve energy, Lower cholesterol"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Follow-up Form */}
          {nextAction === "request-follow-up" && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-soft-blue/20">
              <div className="flex items-center space-x-2 mb-1">
                <CalendarIcon
                  className="h-4 w-4"
                  style={{ color: "var(--color-soft-blue)" }}
                />
                <h4 className="font-medium">Follow-up Details</h4>
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow-up-reason">
                  Reason <span className="text-soft-coral">*</span>
                </Label>
                <Textarea
                  id="follow-up-reason"
                  placeholder="e.g., Review diet plan progress, reassess nutritional targets..."
                  value={followUpReason}
                  onChange={(e) => setFollowUpReason(e.target.value)}
                  className="min-h-[80px] resize-none rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Suggested Date <span className="text-soft-coral">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-lg border border-soft-blue/50",
                        !followUpDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {followUpDate ? format(followUpDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-lg shadow-lg">
                    <Calendar
                      mode="single"
                      selected={followUpDate}
                      onSelect={setFollowUpDate}
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
            </div>
          )}

          {/* Patient Info */}
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
                    <span className="font-medium text-muted-foreground">Weight:</span>
                    <p>{appointment.patient.weight} kg</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Height:</span>
                    <p>{appointment.patient.height} cm</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium text-muted-foreground">Conditions:</span>
                    <p>{appointment.patient.conditions || "None"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium text-muted-foreground">Allergies:</span>
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
            disabled={
              isLoading ||
              isFollowUpPending ||
              !sessionNotes.trim() ||
              (nextAction === "assign-diet-plan" && !planName.trim()) ||
              (nextAction === "request-follow-up" && (!followUpReason.trim() || !followUpDate))
            }
            className="bg-[var(--color-mint-green)] hover:bg-[var(--color-mint-green)]/90 w-full sm:w-auto"
          >
            {isLoading
              ? "Completing..."
              : nextAction === "assign-diet-plan"
                ? "Complete & Assign Diet Plan"
                : nextAction === "request-follow-up"
                  ? "Complete & Request Follow-up"
                  : "Complete Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}