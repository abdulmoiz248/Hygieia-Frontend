"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Edit, Calendar, Pill, FileText, AlertTriangle } from "lucide-react"
import { EditPrescriptionDialog } from "./EditPrescriptionDialog"
import { Prescription } from "@/store/doctor/doctor-prescription-store"

interface PrescriptionCardProps {
  prescription: Prescription
  onUpdate: (updatedPrescription: Prescription) => void
}

export function PrescriptionCard({ prescription, onUpdate }: PrescriptionCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const calculateProgress = () => {
    if (!prescription.startDate || !prescription.followUpDate) return 0
    const now = new Date()
    const start = new Date(prescription.startDate)
    const end = new Date(prescription.followUpDate)
    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    return Math.min(Math.max((elapsed / total) * 100, 0), 100)
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Not set"
    return new Date(date).toLocaleDateString()
  }

  const getDaysRemaining = () => {
    if (!prescription.followUpDate) return null
    const now = new Date()
    const end = new Date(prescription.followUpDate)
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  const getMedications = (): { name: string; dosage: string; frequency: string; duration: string; instructions?: string; time?: string }[] => {
    if (!prescription.medications) return []
    try {
      const parsed = JSON.parse(prescription.medications as string)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const progress = calculateProgress()
  const daysRemaining = getDaysRemaining()
  const medications = getMedications()

  return (
    <>
      <Card
        className="w-full hover:shadow-lg transition-shadow duration-200 border-l-4 bg-cool-gray/10"
        style={{ borderLeftColor: "var(--color-soft-blue)" }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg font-semibold text-soft-coral">{prescription.patientName}</CardTitle>
            <Button
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="hover:bg-soft-blue/90 bg-soft-blue text-snow-white"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-dark-slate-gray" />
              <span>
                {formatDate(prescription.startDate)} - {formatDate(prescription.followUpDate)}
              </span>
            </span>
            {daysRemaining !== null && (
              <Badge className="ml-2 bg-mint-green p-2">{daysRemaining} days left</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-soft-blue">Treatment Progress</span>
              <span className="font-medium text-soft-coral">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Diagnosis */}
          {prescription.diagnosis && (
            <div className="p-3 rounded-lg border bg-snow-white">
              <p className="text-sm font-medium mb-1 text-soft-blue">Diagnosis</p>
              <p className="text-sm text-muted-foreground">{prescription.diagnosis}</p>
            </div>
          )}

          {/* Medications Overview */}
          {medications.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4" style={{ color: "var(--color-mint-green)" }} />
                <p className="text-sm font-medium">Medications ({medications.length})</p>
              </div>
              <div className="grid gap-2">
                {medications.slice(0, 2).map((med, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/40">
                    <span className="text-sm font-semibold">{med.name}</span>
                    <span className="text-xs text-muted-foreground">{med.dosage} · {med.frequency}</span>
                  </div>
                ))}
                {medications.length > 2 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{medications.length - 2} more medication{medications.length - 2 > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Duration & Frequency Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-white/40">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{prescription.duration || "—"}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/40">
              <p className="text-sm text-muted-foreground">Frequency</p>
              <p className="font-semibold">{prescription.frequency || "—"}</p>
            </div>
          </div>

          {/* Notes */}
          {prescription.notes && (
            <div className="p-3 rounded-lg border bg-snow-white">
              <p className="text-sm font-medium mb-1 text-soft-blue">
                <FileText className="h-4 w-4 inline mr-1" />
                Notes
              </p>
              <p className="text-sm text-muted-foreground">{prescription.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EditPrescriptionDialog
        prescription={prescription}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={onUpdate}
      />
    </>
  )
}
