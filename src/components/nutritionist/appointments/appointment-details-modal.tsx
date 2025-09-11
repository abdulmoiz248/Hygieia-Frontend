"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin,  Mail, Calendar, FileText, User, Heart } from "lucide-react"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"

export function AppointmentDetailsModal() {
  const { selectedAppointment, setSelectedAppointment } = useAppointmentStore()

  const open = !!selectedAppointment
  const appointment = selectedAppointment

  const handleClose = () => {
    setSelectedAppointment(null)
  }

  if (!appointment) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "var(--color-mint-green)"
      case "scheduled":
        return "var(--color-soft-blue)"
      case "cancelled":
        return "var(--color-soft-coral)"
      case "no-show":
        return "var(--color-cool-gray)"
      default:
        return "var(--color-cool-gray)"
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={appointment.patient?.avatar || "/placeholder.svg"} />
              <AvatarFallback style={{ backgroundColor: "var(--color-soft-blue)", color: "white" }}>
                {appointment.patient?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-xl font-semibold">{appointment.patient?.name}</span>
              <Badge
                variant="outline"
                className="ml-2"
                style={{ borderColor: getStatusColor(appointment.status), color: getStatusColor(appointment.status) }}
              >
                {appointment.status}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>Appointment details and patient information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appointment Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" style={{ color: "var(--color-soft-blue)" }} />
              Appointment Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {appointment.time} 
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.mode}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.type}</span>
              </div>
            
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" style={{ color: "var(--color-mint-green)" }} />
              Contact Information
            </h3>
            <div className="space-y-2 text-sm">
             
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.patient?.email}</span>
              </div>
            </div>
          </div>

          {/* Patient Information */}
        {appointment.patient && (
  <>
    <Separator />
    <div>
      <h3 className="font-semibold mb-3 flex items-center">
        <Heart className="h-4 w-4 mr-2" style={{ color: "var(--color-soft-coral)" }} />
        Patient Information
      </h3>
      <div className="bg-muted/50 p-4 rounded-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Age:</span>
            <p className="font-medium">
              {appointment.patient.dateOfBirth
                ? new Date().getFullYear() - new Date(appointment.patient.dateOfBirth).getFullYear()
                : "N/A"}{" "}
              years
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Weight:</span>
            <p className="font-medium">{appointment.patient.weight || "N/A"} kg</p>
          </div>
          <div>
            <span className="text-muted-foreground">Height:</span>
            <p className="font-medium">{appointment.patient.height || "N/A"} cm</p>
          </div>
          <div>
            <span className="text-muted-foreground">Emergency Contact:</span>
            <p className="font-medium">{appointment.patient.emergencyContact || "N/A"}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Medical Conditions:</span>
            <p className="font-medium">{appointment.patient.conditions || "None"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Allergies:</span>
            <p className="font-medium">{appointment.patient.allergies || "None"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Current Medications:</span>
            <p className="font-medium">{appointment.patient.medications || "None"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Ongoing Medications:</span>
            <p className="font-medium">{appointment.patient.ongoingMedications || "None"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Dietary / Lifestyle:</span>
            <p className="font-medium">{appointment.patient.lifestyle || "None"}</p>
          </div>
        </div>
      </div>
    </div>
  </>
)}


          <Separator />

          {/* Notes */}
          {appointment.notes && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" style={{ color: "var(--color-soft-coral)" }} />
                Notes
              </h3>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{appointment.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
