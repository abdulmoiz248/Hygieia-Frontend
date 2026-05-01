"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Video,
  MapPin,
  FileText,
  Activity,
  TestTube,
  Brain,
  History,
  CheckCircle,
  Stethoscope,
  Pill,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import api from "@/lib/axios"
import useDoctorStore from "@/store/doctor/doctor-store"
import { EnhancedFitnessCharts } from "@/components/nutritionist/appointments/id/enhanced-fitness-charts"
import LabTests from "@/components/nutritionist/appointments/id/LabTest"
import PreviousAppointmentsCard from "@/components/doctor-portal/appointments/id/DoctorPreviousAppointments"
import { generateDoctorAIReport } from "@/components/doctor-portal/appointments/id/DoctorAiReport"
import type { LabTest } from "@/types/patient/lab"

// ─── Types ────────────────────────────────────────────────────────────────────

interface PatientData {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  dateOfBirth: string
  gender: string
  weight: number
  height: number
  bloodType: string
  healthscore: number
  adherence: number
  allergies: string
  conditions: string
  medications: string
  familyHistory: string
  lifestyle: string
}

interface AppointmentDetail {
  id: string
  date: string
  time: string
  status: string
  type: string
  mode: string
  notes?: string
  report?: string
  data_shared: boolean
  patient: PatientData
  patient_id: string
}

interface FitnessEntry {
  id: string
  created_at: string
  patient_id: string
  steps: number
  water: number
  sleep: number
  calories_burned: number
  calories_intake: number
  fat: number
  protein: number
  carbs: number
}

interface MedicalNote {
  diagnosis: string
  prescription: string
  followUpDate: string
  additionalNotes: string
}

interface ReferredTest {
  test: LabTest
  referredAt: string
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const statusConfig: Record<string, { color: string; label: string }> = {
  upcoming: { color: "bg-soft-blue text-white", label: "Upcoming" },
  completed: { color: "bg-mint-green text-white", label: "Completed" },
  cancelled: { color: "bg-soft-coral text-white", label: "Cancelled" },
  "in-progress": { color: "bg-yellow-400 text-white", label: "In Progress" },
}

const modeIcon = (mode: string) =>
  mode === "online" ? (
    <Video className="w-4 h-4 text-soft-blue" />
  ) : (
    <MapPin className="w-4 h-4 text-mint-green" />
  )

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DoctorAppointment({ appointmentId }: { appointmentId: string }) {
  const router = useRouter()
  const { profile: doctor } = useDoctorStore()

  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null)
  const [fitnessData, setFitnessData] = useState<FitnessEntry[]>([])
  const [medicalRecords, setMedicalRecords] = useState<any[]>([])
  const [referredTests, setReferredTests] = useState<ReferredTest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Medical notes state
  const [notes, setNotes] = useState<MedicalNote>({
    diagnosis: "",
    prescription: "",
    followUpDate: "",
    additionalNotes: "",
  })
  const [savingNotes, setSavingNotes] = useState(false)
  const [notesSaved, setNotesSaved] = useState(false)

  // AI report state
  const [aiReport, setAiReport] = useState<string>("")
  const [generatingReport, setGeneratingReport] = useState(false)
  const [reportExpanded, setReportExpanded] = useState(false)

  // Mark complete state
  const [completing, setCompleting] = useState(false)

  // ─── Fetch appointment + patient data ──────────────────────────────────────

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const apptRes = await api.get(`/appointments/${appointmentId}`)
        const appt: AppointmentDetail = apptRes.data.data || apptRes.data

        setAppointment(appt)

        // Pre-populate notes if they exist
        if (appt.notes) {
          try {
            const parsed = JSON.parse(appt.notes)
            if (parsed && typeof parsed === "object") setNotes(parsed)
            else setNotes((prev) => ({ ...prev, additionalNotes: appt.notes || "" }))
          } catch {
            setNotes((prev) => ({ ...prev, additionalNotes: appt.notes || "" }))
          }
        }

        // Fetch patient fitness data (last 30 days)
        if (appt.patient_id) {
          try {
            const fitnessRes = await api.get(`/fitness/${appt.patient_id}`)
            setFitnessData(fitnessRes.data.data || fitnessRes.data || [])
          } catch {
            setFitnessData([])
          }

          // Fetch medical records
          try {
            const recordsRes = await api.get(`/medical-records/${appt.patient_id}`)
            setMedicalRecords(recordsRes.data.data || recordsRes.data || [])
          } catch {
            setMedicalRecords([])
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load appointment")
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [appointmentId])

  // ─── Actions ───────────────────────────────────────────────────────────────

  const handleSaveNotes = async () => {
    if (!appointment) return
    setSavingNotes(true)
    try {
      await api.put(`/appointments/${appointmentId}`, {
        notes: JSON.stringify(notes),
      })
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 3000)
    } catch (err) {
      console.error("Failed to save notes", err)
    } finally {
      setSavingNotes(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!appointment) return
    setCompleting(true)
    try {
      await api.put(`/appointments/${appointmentId}`, { status: "completed" })
      setAppointment((prev) => (prev ? { ...prev, status: "completed" } : null))
    } catch (err) {
      console.error("Failed to mark complete", err)
    } finally {
      setCompleting(false)
    }
  }

  const handleReferTest = async (test: LabTest) => {
    if (!appointment) return
    try {
      await api.post(`/appointments/${appointmentId}/lab-tests`, {
        testId: test.id,
        patientId: appointment.patient_id,
      })
      setReferredTests((prev) => [...prev, { test, referredAt: new Date().toISOString() }])
    } catch (err) {
      console.error("Failed to refer test", err)
    }
  }

  const handleGenerateReport = async () => {
    if (!appointment?.patient) return
    setGeneratingReport(true)
    setReportExpanded(true)
    try {
      const report = await generateDoctorAIReport(
        appointment.patient,
        fitnessData,
        medicalRecords
      )
      setAiReport(report)
      // Optionally persist the report
      await api.put(`/appointments/${appointmentId}`, { report })
    } catch (err) {
      console.error("Failed to generate report", err)
      setAiReport("Failed to generate report. Please try again.")
    } finally {
      setGeneratingReport(false)
    }
  }

  // ─── Render helpers ────────────────────────────────────────────────────────

  const calcAge = (dob: string) =>
    dob ? new Date().getFullYear() - new Date(dob).getFullYear() : "—"

  const bmi = appointment?.patient
    ? (
        appointment.patient.weight /
        ((appointment.patient.height / 100) ** 2)
      ).toFixed(1)
    : "—"

  // ─── Loading / Error ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-cool-gray">
          <Loader2 className="w-8 h-8 animate-spin text-soft-blue" />
          <p className="text-sm">Loading appointment details…</p>
        </div>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-10 h-10 text-soft-coral" />
        <p className="text-soft-coral font-medium">{error || "Appointment not found"}</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  const { patient } = appointment
  const statusCfg = statusConfig[appointment.status] ?? { color: "bg-gray-400 text-white", label: appointment.status }

  // ─── Main render ───────────────────────────────────────────────────────────

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-4 md:p-6 bg-snow-white min-h-screen"
    >
      {/* ── Back + Header ── */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full hover:bg-soft-blue/10"
        >
          <ArrowLeft className="w-5 h-5 text-soft-blue" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-soft-coral">Appointment Details</h1>
          <p className="text-sm text-cool-gray">
            {new Date(appointment.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {appointment.time}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge className={statusCfg.color}>{statusCfg.label}</Badge>
          {appointment.status !== "completed" && (
            <Button
              size="sm"
              onClick={handleMarkComplete}
              disabled={completing}
              className="bg-mint-green hover:bg-mint-green/90 text-white gap-1.5"
            >
              {completing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Mark Complete
            </Button>
          )}
        </div>
      </motion.div>

      {/* ── Patient + Appointment Summary Cards ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Patient Card */}
        <Card className="lg:col-span-2 rounded-3xl border border-gray-100 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Avatar className="w-20 h-20 border-4 border-soft-blue/20 shadow-lg shrink-0">
                <AvatarImage src={patient?.avatar} />
                <AvatarFallback className="text-xl font-semibold text-soft-blue bg-soft-blue/10">
                  {patient?.name?.split(" ").map((n) => n[0]).join("") ?? "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-dark-slate-gray">{patient?.name}</h2>
                <p className="text-sm text-cool-gray">{patient?.email}</p>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-dark-slate-gray/80">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-soft-blue" />
                    {calcAge(patient?.dateOfBirth)} yrs · {patient?.gender}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-mint-green" />
                    BMI {bmi}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-soft-coral" />
                    Blood {patient?.bloodType}
                  </span>
                </div>

                {/* Quick clinical flags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {patient?.allergies && patient.allergies !== "None" && (
                    <Badge className="bg-soft-coral/10 text-soft-coral border border-soft-coral/30 text-xs">
                      ⚠ {patient.allergies}
                    </Badge>
                  )}
                  {patient?.conditions && patient.conditions !== "None" && (
                    <Badge className="bg-soft-blue/10 text-soft-blue border border-soft-blue/30 text-xs">
                      {patient.conditions}
                    </Badge>
                  )}
                  {patient?.medications && patient.medications !== "None" && (
                    <Badge className="bg-mint-green/10 text-mint-green border border-mint-green/30 text-xs">
                      Rx: {patient.medications}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Meta Card */}
        <Card className="rounded-3xl border border-gray-100 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-soft-blue flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Appointment Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-dark-slate-gray/80">
                <Calendar className="w-4 h-4 text-soft-blue" />
                <span>{new Date(appointment.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-dark-slate-gray/80">
                <Clock className="w-4 h-4 text-soft-blue" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center gap-2 text-dark-slate-gray/80">
                {modeIcon(appointment.mode)}
                <span className="capitalize">{appointment.mode}</span>
              </div>
              <div className="flex items-center gap-2 text-dark-slate-gray/80">
                <FileText className="w-4 h-4 text-soft-blue" />
                <span className="capitalize">{appointment.type}</span>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-cool-gray mb-1">Health Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-soft-blue to-mint-green rounded-full transition-all"
                      style={{ width: `${patient?.healthscore ?? 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-soft-blue">
                    {patient?.healthscore ?? "—"}/100
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-cool-gray mb-1">Adherence</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-mint-green to-soft-blue rounded-full transition-all"
                      style={{ width: `${patient?.adherence ?? 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-mint-green">
                    {patient?.adherence ?? "—"}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Tabs ── */}
      <motion.div variants={fadeUp}>
        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="flex flex-wrap gap-1 h-auto bg-white border border-gray-200 rounded-2xl p-1 shadow-sm mb-6">
            {[
              { value: "notes", icon: <FileText className="w-4 h-4" />, label: "Medical Notes" },
              { value: "health", icon: <Activity className="w-4 h-4" />, label: "Health Data" },
              { value: "labs", icon: <TestTube className="w-4 h-4" />, label: "Lab Tests" },
              { value: "report", icon: <Brain className="w-4 h-4" />, label: "AI Report" },
              { value: "history", icon: <History className="w-4 h-4" />, label: "History" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 text-sm rounded-xl data-[state=active]:bg-soft-blue data-[state=active]:text-white"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Medical Notes Tab ── */}
          <TabsContent value="notes">
            <Card className="rounded-3xl border border-gray-100 shadow-md">
              <CardHeader className="border-b">
                <CardTitle className="text-soft-blue flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Clinical Notes & Prescription
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-soft-blue font-medium">Diagnosis</Label>
                    <Textarea
                      placeholder="Primary diagnosis and clinical findings…"
                      value={notes.diagnosis}
                      onChange={(e) => setNotes((p) => ({ ...p, diagnosis: e.target.value }))}
                      rows={4}
                      className="rounded-xl resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-soft-blue font-medium">Prescription / Treatment Plan</Label>
                    <Textarea
                      placeholder="Medications, dosage, treatment instructions…"
                      value={notes.prescription}
                      onChange={(e) => setNotes((p) => ({ ...p, prescription: e.target.value }))}
                      rows={4}
                      className="rounded-xl resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-soft-blue font-medium">Follow-up Date</Label>
                  <Input
                    type="date"
                    value={notes.followUpDate}
                    onChange={(e) => setNotes((p) => ({ ...p, followUpDate: e.target.value }))}
                    min={new Date().toISOString().split("T")[0]}
                    className="rounded-xl max-w-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-soft-blue font-medium">Additional Notes</Label>
                  <Textarea
                    placeholder="Any additional clinical observations, patient history updates, or recommendations…"
                    value={notes.additionalNotes}
                    onChange={(e) => setNotes((p) => ({ ...p, additionalNotes: e.target.value }))}
                    rows={4}
                    className="rounded-xl resize-none"
                  />
                </div>

                {/* Patient background for quick reference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl text-sm">
                  <div>
                    <p className="text-xs text-cool-gray mb-0.5">Known Allergies</p>
                    <p className="text-dark-slate-gray font-medium">{patient?.allergies || "None"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cool-gray mb-0.5">Current Medications</p>
                    <p className="text-dark-slate-gray font-medium">{patient?.medications || "None"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cool-gray mb-0.5">Medical Conditions</p>
                    <p className="text-dark-slate-gray font-medium">{patient?.conditions || "None"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cool-gray mb-0.5">Family History</p>
                    <p className="text-dark-slate-gray font-medium">{patient?.familyHistory || "None"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="bg-soft-blue hover:bg-soft-blue/90 text-white gap-2"
                  >
                    {savingNotes ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Notes
                  </Button>
                  {notesSaved && (
                    <span className="text-sm text-mint-green flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Saved successfully
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Referred Tests Summary */}
            {referredTests.length > 0 && (
              <Card className="mt-4 rounded-3xl border border-gray-100 shadow-md">
                <CardHeader>
                  <CardTitle className="text-soft-coral flex items-center gap-2 text-base">
                    <TestTube className="w-4 h-4" />
                    Referred Lab Tests This Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {referredTests.map(({ test }, i) => (
                      <Badge
                        key={i}
                        className="bg-soft-coral/10 text-soft-coral border border-soft-coral/30"
                      >
                        {test.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Health Data Tab ── */}
          <TabsContent value="health">
            {fitnessData.length > 0 ? (
              <EnhancedFitnessCharts data={fitnessData} />
            ) : (
              <Card className="rounded-3xl border border-gray-100 shadow-md">
                <CardContent className="flex flex-col items-center justify-center py-16 text-cool-gray gap-3">
                  <Activity className="w-10 h-10 opacity-40" />
                  <p>No fitness data available for this patient</p>
                  <p className="text-sm opacity-70">
                    The patient hasn&apos;t logged any health data yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Lab Tests Tab ── */}
          <TabsContent value="labs">
            <div className="space-y-4">
              <LabTests onReferTest={handleReferTest} />

              {referredTests.length > 0 && (
                <Card className="rounded-3xl border border-gray-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-soft-blue text-base flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-mint-green" />
                      Referred Tests ({referredTests.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {referredTests.map(({ test, referredAt }, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-mint-green/5 border border-mint-green/20 rounded-xl text-sm"
                        >
                          <div>
                            <p className="font-medium text-dark-slate-gray">{test.name}</p>
                            <p className="text-xs text-cool-gray">{test.category}</p>
                          </div>
                          <span className="text-xs text-cool-gray">
                            {new Date(referredAt).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* ── AI Report Tab ── */}
          <TabsContent value="report">
            <Card className="rounded-3xl border border-gray-100 shadow-md">
              <CardHeader className="border-b">
                <CardTitle className="text-soft-blue flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Clinical Report
                  </span>
                  <Button
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                    className="bg-gradient-to-r from-soft-blue to-mint-green hover:opacity-90 text-white gap-2 text-sm"
                  >
                    {generatingReport ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analysing…
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        {aiReport ? "Regenerate Report" : "Generate Report"}
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                {!aiReport && !generatingReport && (
                  <div className="flex flex-col items-center justify-center py-16 text-cool-gray gap-3">
                    <Brain className="w-12 h-12 opacity-30" />
                    <p className="font-medium">No report generated yet</p>
                    <p className="text-sm opacity-70 text-center max-w-sm">
                      Click &quot;Generate Report&quot; to produce an AI-powered clinical summary based on
                      the patient&apos;s 30-day health data and profile.
                    </p>
                  </div>
                )}

                {generatingReport && (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-soft-blue" />
                    <p className="text-cool-gray text-sm">Analysing patient data…</p>
                  </div>
                )}

                {aiReport && !generatingReport && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-cool-gray">
                        Based on {fitnessData.length} days of health data
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReportExpanded((p) => !p)}
                        className="text-soft-blue gap-1"
                      >
                        {reportExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" /> Collapse
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" /> Expand
                          </>
                        )}
                      </Button>
                    </div>

                    <ScrollArea className={reportExpanded ? "h-[600px]" : "h-[300px]"}>
                      <div className="prose prose-sm max-w-none text-dark-slate-gray/90 whitespace-pre-wrap leading-relaxed pr-4">
                        {aiReport}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── History Tab ── */}
          <TabsContent value="history">
            {doctor?.id ? (
              <PreviousAppointmentsCard
                doctorId={doctor.id}
                patientId={appointment.patient_id}
              />
            ) : (
              <Card className="rounded-3xl border border-gray-100 shadow-md">
                <CardContent className="flex flex-col items-center justify-center py-12 text-cool-gray gap-2">
                  <History className="w-10 h-10 opacity-40" />
                  <p>Unable to load history — doctor ID not found.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}