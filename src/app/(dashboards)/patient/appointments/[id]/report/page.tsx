"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { usePatientAppointmentsStore } from "@/store/patient/appointments-store"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { AppointmentStatus } from "@/types/patient/appointment"
import { useProviderReport, type ReportProviderRole } from "@/hooks/patient/useProviderReport"
import Loader from "@/components/loader/loader"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertTriangle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  X,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Constants ────────────────────────────────────────────────────────────────

const REPORT_REASONS = [
  "Unprofessional behavior",
  "Incorrect diagnosis",
  "Privacy violation",
  "Disrespectful / rude conduct",
  "No-show / late without notice",
  "Inappropriate communication",
  "Fraud or billing issue",
  "Other",
] as const

const MAX_IMAGES = 3
const MAX_IMAGE_SIZE_MB = 5

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ReportPage() {
  const params         = useParams()
  const router         = useRouter()
  const id             = params?.id as string

  const { appointments } = usePatientAppointmentsStore()
  const patientProfile   = usePatientProfileStore((s) => s.profile)

  // Wait one tick for store hydration
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])

  // Form state
  const [reason, setReason]             = useState("")
  const [description, setDescription]   = useState("")
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageBase64s, setImageBase64s]   = useState<string[]>([])
  const [imageError, setImageError]       = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: submitReport, isPending, isSuccess } = useProviderReport()

  // ── Guards ──────────────────────────────────────────────────────────────────

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  }

  const appointment = appointments.find((a) => a.id === id)

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-soft-coral/10">
          <AlertTriangle className="w-8 h-8 text-soft-coral" />
        </div>
        <h2 className="text-2xl font-bold text-dark-slate-gray">Appointment not found</h2>
        <p className="text-cool-gray max-w-sm">
          We couldn&apos;t find this appointment. It may have been removed or the link is incorrect.
        </p>
        <Button onClick={() => router.push("/patient/appointments")}
          className="bg-soft-blue hover:bg-soft-blue/90 text-white">
          Back to Appointments
        </Button>
      </div>
    )
  }

  if (appointment.status !== AppointmentStatus.Completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-dark-slate-gray">Report not available</h2>
        <p className="text-cool-gray max-w-sm">
          You can only report providers for completed appointments.
        </p>
        <Button onClick={() => router.push("/patient/appointments")}
          className="bg-soft-blue hover:bg-soft-blue/90 text-white">
          Back to Appointments
        </Button>
      </div>
    )
  }

  const doctor = appointment.doctor as any

  // ── Image handlers ──────────────────────────────────────────────────────────

  const handleImageAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("")
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const remaining = MAX_IMAGES - imagePreviews.length
    const toProcess = files.slice(0, remaining)
    if (files.length > remaining) setImageError(`You can only attach up to ${MAX_IMAGES} images.`)

    const oversized = toProcess.find((f) => f.size > MAX_IMAGE_SIZE_MB * 1024 * 1024)
    if (oversized) { setImageError(`Each image must be under ${MAX_IMAGE_SIZE_MB} MB.`); return }

    const base64s = await Promise.all(toProcess.map(fileToBase64))
    setImagePreviews((prev) => [...prev, ...base64s])
    setImageBase64s((prev) => [...prev, ...base64s])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeImage = (idx: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx))
    setImageBase64s((prev) => prev.filter((_, i) => i !== idx))
    setImageError("")
  }

  const handleSubmit = () => {
    if (!reason) return
    submitReport({
      patientId: patientProfile?.id ?? "",
      reportedProviderId: doctor.id,
      reportedProviderRole: (doctor.role ?? "doctor") as ReportProviderRole,
      reason,
      description: description.trim() || undefined,
      images: imageBase64s.length ? imageBase64s : undefined,
    })
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (isSuccess) {
    return (
      <div className="min-h-screen custom-gradient flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-snow-white rounded-2xl shadow-2xl p-8 text-center space-y-5">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-mint-green/15 mx-auto">
            <CheckCircle2 className="h-10 w-10 text-mint-green" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-dark-slate-gray mb-1">Report Submitted</h2>
            <p className="text-cool-gray text-sm leading-relaxed max-w-sm mx-auto">
              Thank you for letting us know. Our team will review your report and take the necessary steps.
            </p>
          </div>
          <Button
            onClick={() => router.push("/patient/appointments")}
            className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
          >
            Back to Appointments
          </Button>
        </div>
      </div>
    )
  }

  // ── Main form ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen custom-gradient">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-2xl mx-auto space-y-6">

          {/* Back button */}
          <button
            type="button"
            onClick={() => router.push("/patient/appointments")}
            className="flex items-center gap-2 text-sm text-cool-gray hover:text-soft-blue transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Appointments
          </button>

          {/* Page header */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-soft-coral/10">
              <ShieldAlert className="h-5 w-5 text-soft-coral" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-dark-slate-gray">Report Provider</h1>
              <p className="text-sm text-cool-gray">All reports are confidential and reviewed by our Trust &amp; Safety team.</p>
            </div>
          </div>

          {/* Provider info card */}
          <div className="flex items-center gap-4 rounded-xl border border-cool-gray/20 bg-white/60 p-4 shadow-sm">
            {doctor.img ? (
              <Image
                src={doctor.img}
                alt={doctor.name}
                width={56}
                height={56}
                className="rounded-full object-cover border border-cool-gray/20 flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-soft-blue/10 flex items-center justify-center text-soft-blue font-bold text-xl flex-shrink-0">
                {doctor.name?.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-dark-slate-gray">{doctor.name}</p>
              <p className="text-sm text-cool-gray capitalize">
                {doctor.role ?? "Doctor"}
                {doctor.specialization ? ` · ${doctor.specialization}` : ""}
              </p>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white/60 rounded-2xl shadow-sm border border-cool-gray/10 p-6 space-y-6">

            {/* Reason */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-dark-slate-gray">
                Reason <span className="text-soft-coral">*</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {REPORT_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className={cn(
                      "text-sm px-4 py-2 rounded-full border transition-all duration-200 font-medium",
                      reason === r
                        ? "bg-soft-coral text-snow-white border-soft-coral shadow-sm"
                        : "border-cool-gray/40 text-cool-gray hover:border-soft-coral/60 hover:text-soft-coral bg-snow-white",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="report-description" className="text-sm font-semibold text-dark-slate-gray">
                Additional details <span className="text-cool-gray font-normal">(optional)</span>
              </Label>
              <Textarea
                id="report-description"
                placeholder="Describe what happened in as much detail as you're comfortable sharing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none border-2 border-cool-gray/30 focus:border-soft-blue focus:ring-soft-blue/20 focus:ring-4 transition-all duration-200 text-sm"
              />
              <p className="text-xs text-cool-gray text-right">{description.length} / 1000</p>
            </div>

            {/* Image upload */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-dark-slate-gray">
                Proof images <span className="text-cool-gray font-normal">(optional, max {MAX_IMAGES})</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-cool-gray/30">
                    <img src={src} alt={`proof-${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black/80 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
                {imagePreviews.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-cool-gray/40 hover:border-soft-blue flex flex-col items-center justify-center gap-1 text-cool-gray hover:text-soft-blue transition-colors"
                  >
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Add photo</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageAdd}
              />
              {imageError && (
                <p className="text-xs text-soft-coral flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {imageError}
                </p>
              )}
            </div>

            {/* Disclaimer */}
            <div className="rounded-lg bg-soft-coral/8 border border-soft-coral/25 p-4 flex gap-3 text-sm text-dark-slate-gray">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-soft-coral" />
              <p>
                Filing a false report is a violation of our Terms of Service. Only submit if you have
                genuine concerns about this provider.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/patient/appointments")}
                disabled={isPending}
                className="flex-1 border-cool-gray/40 text-cool-gray hover:text-dark-slate-gray hover:border-cool-gray"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!reason || isPending}
                className="flex-1 bg-soft-coral hover:bg-soft-coral/90 text-snow-white disabled:opacity-50"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Submit Report
                  </span>
                )}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}