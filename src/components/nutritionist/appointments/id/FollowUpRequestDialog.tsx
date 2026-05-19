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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarComponent as Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CalendarClock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useFollowUpRequest } from "@/hooks/nutritionist/useFollowUpRequest"

interface FollowUpRequestDialogProps {
  patientId: string
  patientName: string
  providerId: string
  /** Controls the visual style of the trigger button */
  variant?: "default" | "outline" | "ghost"
  className?: string
}

export function FollowUpRequestDialog({
  patientId,
  patientName,
  providerId,
  variant = "default",
  className,
}: FollowUpRequestDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [suggestedDate, setSuggestedDate] = useState<Date | undefined>(undefined)

  const { mutate: requestFollowUp, isPending } = useFollowUpRequest()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!suggestedDate || !reason.trim()) return

    requestFollowUp(
      {
        patientId,
        providerId,
        providerRole: "nutritionist",
        reason: reason.trim(),
        suggestedDate: format(suggestedDate, "yyyy-MM-dd"),
      },
      {
        onSuccess: () => {
          setOpen(false)
          setReason("")
          setSuggestedDate(undefined)
        },
      }
    )
  }

  const isDisabled = isPending || !reason.trim() || !suggestedDate

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            variant === "default" &&
              "bg-soft-blue hover:bg-soft-blue/90 text-white w-full shadow-md",
            className
          )}
        >
          <CalendarClock className="w-4 h-4 mr-2" />
          Request Follow-up
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-soft-blue text-xl">
            Request Follow-up Appointment
          </DialogTitle>
          <DialogDescription className="text-dark-slate-gray/70">
            Send a follow-up request to{" "}
            <span className="font-semibold text-soft-coral">{patientName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="follow-up-reason" className="text-soft-blue">
              Reason for Follow-up <span className="text-soft-coral">*</span>
            </Label>
            <Textarea
              id="follow-up-reason"
              placeholder="e.g., Review diet plan progress, reassess nutritional targets..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="rounded-lg resize-none"
              required
            />
          </div>

          {/* Suggested Date */}
          <div className="space-y-2">
            <Label className="text-soft-blue">
              Suggested Date <span className="text-soft-coral">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-lg border border-soft-blue/50",
                    !suggestedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {suggestedDate ? format(suggestedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-lg shadow-lg">
                <Calendar
                  mode="single"
                  selected={suggestedDate}
                  onSelect={setSuggestedDate}
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

          <DialogFooter className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl px-5"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-soft-blue hover:bg-soft-blue/90 text-white rounded-xl px-6"
              disabled={isDisabled}
            >
              {isPending ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}