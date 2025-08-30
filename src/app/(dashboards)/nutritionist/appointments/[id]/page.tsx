"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
 
  Calendar,

  Heart,
  FileText,
  ExternalLink,
  Bot,

  ShieldOff,
  Activity,
  Weight,
  Ruler,
  Clock,

  Stethoscope,

  BarChart3,
  Star,
  Target,
  CheckCircle,
  ClipboardList,
} from "lucide-react"
import type { Appointment } from "@/types/patient/appointment"
import { EnhancedFitnessCharts, FitnessData } from "@/components/nutritionist/appointments/id/enhanced-fitness-charts"
import { MedicalRecord } from "@/types"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"
import { DietPlanDialog } from "@/components/nutritionist/appointments/id/diet-plan-dialog"
import { formatDateOnly } from "@/helpers/date"
import LabTests from "@/components/nutritionist/appointments/id/LabTest"


// Mock fitness data for the last 30 days
const generateMockFitnessData = (patientId: string): FitnessData[] => {
  const data: FitnessData[] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      id: `fitness-${patientId}-${i}`,
      created_at: date.toISOString(),
      patient_id: patientId,
      steps: Math.floor(Math.random() * 5000) + 5000,
      water: Math.random() * 2 + 1.5,
      sleep: Math.random() * 2 + 6.5,
      calories_burned: Math.floor(Math.random() * 800) + 1200,
      calories_intake: Math.floor(Math.random() * 600) + 1800,
      fat: Math.random() * 30 + 50,
      protein: Math.random() * 50 + 100,
      carbs: Math.random() * 100 + 150,
    })
  }
  return data
}

// Mock medical records
const generateMockMedicalRecords = (patientId: string): MedicalRecord[] => [
  {
    id: "med-1",
   // patientid: patientId,
    title: "Blood Test Results",
    type: "lab-result",
    date: "2025-08-15T10:00:00Z",
    fileUrl: "https://res.cloudinary.com/demo/image/upload/sample.pdf",
    doctorName: "Dr. Smith",
  },
  {
    id: "med-2",
   // patient_id: patientId,
    title: "Nutrition Prescription",
    type: "prescription",
    date: "2025-08-10T14:30:00Z",
    fileUrl: "https://res.cloudinary.com/demo/image/upload/prescription.pdf",
    doctorName: "Dr. Carter",
  }
]

export default function AppointmentPage() {
  const params = useParams()
  const appointmentId = params.id as string
  const { appointments } = useAppointmentStore()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [fitnessData, setFitnessData] = useState<FitnessData[]>([])
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [assignedDietPlan, setAssignedDietPlan] = useState<any | null>(null)
const [referredTests, setReferredTests] = useState<any[]>([])


  useEffect(() => {
    const foundAppointment = appointments.find((apt) => apt.id === appointmentId)
    if (foundAppointment) {
      setAppointment(foundAppointment)
      setFitnessData(generateMockFitnessData(foundAppointment.patient.id))
      setMedicalRecords(generateMockMedicalRecords(foundAppointment.patient.id))
    }
  }, [appointmentId, appointments])

  const handleGenerateAIReport = () => {
    console.log("[v0] Generating AI report for patient:", appointment?.patient.name)
    // This would typically call an AI service to generate a comprehensive report
    alert("AI Report generation started. You will receive the report shortly.")
  }

  const labTestsRef = useRef<HTMLDivElement | null>(null)

const handleScrollToLabTests = () => {
  labTestsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
}

const handleAssignDietPlan = (dietPlan: any) => {
  setAssignedDietPlan(dietPlan)
}

const handleTestReferral = (referral: any) => {
  setReferredTests((prev) => [...prev, referral])
}


const [doctorReport, setDoctorReport] = useState("")
 const [appointmentDone, setAppointmentDone] = useState(false)

  const handleMarkAppointmentDone = () => {
    setAppointmentDone(true)
    // 🔒 here you can also dispatch Redux action or call API to update backend
  }

  const handleRemoveTest = (id:string) => {
    setReferredTests((prev) => prev.filter((t) => t.id !== id))
    // 🗑️ also update backend if required
  }


  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md hover-lift">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Appointment Not Found</h3>
              <p className="text-sm text-muted-foreground">The requested appointment could not be located.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { patient, doctor, date, time, status, type, notes, dataShared } = appointment

  return (
    <div className="min-h-screen bg-gradient-to-br bg-transparent">
      <div className="container mx-auto  space-y-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className=" w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6  text-soft-coral" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-balance text-soft-coral">Patient Consultation</h1>
                <p className="text-cool-gray text-lg">Comprehensive health overview and analytics</p>
              </div>
            </div>
          </div>

       
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1 space-y-6">
            {/* Patient Profile Card */}
            <Card className="hover-lift bg-white overflow-hidden">
              <div className="p-6">
               <div className="flex items-center justify-center">
  <div className="flex items-center space-x-4">
    <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
      <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
      <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
        {patient.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <h3 className="text-xl font-bold text-soft-coral">{patient.name}</h3>
      <p className="text-cool-gray">
        {patient.gender} • {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
      </p>
      {dataShared && (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium ml-1">Health Score</span>
          </div>
          <Badge variant="secondary" className="bg-secondary/20 text-soft-coral">
            {patient.healthscore}/100
          </Badge>
        </div>
      )}
    </div>
  </div>
</div>

              </div>

              <CardContent className="p-6 pt-0 space-y-6">
                {/* Physical Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-cool-gray/10">
                    <Weight className="w-5 h-5 text-soft-blue mx-auto mb-1" />
                    <p className="text-sm text-dark-slate-gray">Weight</p>
                    <p className="text-lg font-bold text-soft-blue">{patient.weight} kg</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-cool-gray/10">
                    <Ruler className="w-5 h-5 text-soft-blue mx-auto mb-1" />
                    <p className="text-sm text-dark-slate-gray">Height</p>
                    <p className="text-lg font-bold text-soft-blue">{patient.height} </p>
                  </div>
                </div>

              
            

                <Separator />

                {/* Medical Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-soft-coral flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Medical Info
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-cool-gray/10">
                      <span className="text-sm text-soft-blue">Blood Type</span>
                      <Badge variant="outline" className="bg-soft-coral text-cool-gray">{patient.bloodType}</Badge>
                    </div>
                    <div className="p-2 rounded-lg bg-cool-gray/10">
                      <p className="text-sm text-soft-blue mb-1">Allergies</p>
                      <p className="text-sm text-cool-gray">{patient.allergies}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-cool-gray/10">
                      <p className="text-sm text-soft-blue mb-1">Conditions</p>
                      <p className="text-sm text-cool-gray">{patient.conditions}</p>
                    </div>
                  </div>
                </div>

                {dataShared && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-semibold text-soft-coral flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Health Metrics
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-soft-blue ">Adherence Rate</span>
                            <Badge className="bg-secondary/20 text-mint-green">{patient.adherence}</Badge>
                          </div>
                          <Progress
                            value={patient.adherence === "High" ? 85 : patient.adherence === "Medium" ? 60 : 35}
                            className="h-2 text-soft-blue"
                          />
                        </div>
                       
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

             {/* Action Buttons */}
            <Card className="hover-lift border-accent/20">
              <CardHeader className="bg-accent/5">
                <CardTitle className="text-soft-coral flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6  py-0  space-y-3">
                <Button
                  onClick={handleGenerateAIReport}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Bot className="w-4 h-4" />
                  Generate AI Report
                </Button>

                <DietPlanDialog patientName={patient.name} onAssign={handleAssignDietPlan} />

                     <Button
                       onClick={handleScrollToLabTests}
                        className="border-soft-coral w-full bg-soft-coral hover:bg-soft-coral/90 hover:text-white text-white"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Refer Test
                      </Button>
               
              </CardContent>
            </Card>

            {/* Appointment Details */}
            <Card className="hover-lift">
              <CardHeader className="bg-white">
                <CardTitle className="text-soft-coral flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="space-y-3 text-soft-blue">
                  <div className="flex items-start gap-3">
                    <Stethoscope className="w-4 h-4  mt-1 text-cool-gray" />
                    <div>
                      <p className="text-sm font-medium ">{doctor.name}</p>
                
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-cool-gray" />
                    <div>
                      <p className="text-sm font-medium text-soft-blue">{date}</p>
                      <p className="text-xs text-soft-blue">
                        {time} • {appointment.mode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-cool-gray" />
                    <p className="text-sm text-soft-blue">{type}</p>
                  </div>

                  {notes && (
                    <div className="mt-4 p-3 mb-0 rounded-lg bg-cool-gray/10">
                      <p className="text-sm font-medium text-soft-coral mb-1 ">Notes</p>
                      <p className="text-sm text-cool-gray">{notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

           
          </div>

          <div className="xl:col-span-3 space-y-8">
             
<>



{(assignedDietPlan || referredTests.length > 0 || doctorReport) && (
  <Card
    className={`hover-lift bg-white border-accent/30 shadow-md rounded-2xl overflow-hidden transition-all ${
      appointmentDone ? "opacity-60 pointer-events-none" : ""
    }`}
  >
    <CardHeader className=" border-b ">
      <CardTitle className="text-soft-coral flex items-center gap-2 text-xl ">
        <ClipboardList className="w-6 h-6" />
        Summary
      </CardTitle>
    </CardHeader>

    <CardContent className="space-y-6">
      {/* Assigned Diet Plan */}
      {assignedDietPlan && (
        <div className="p-4 rounded-xl bg-cool-gray/10 border border-mint-green/30">
          <h4 className="font-semibold text-soft-blue flex items-center gap-2">🥗 Assigned Diet Plan</h4>
          <p className="text-sm text-soft-blue mt-1">
            Calories: {assignedDietPlan.dailyCalories} | Protein: {assignedDietPlan.protein}g | Carbs:{" "}
            {assignedDietPlan.carbs}g | Fat: {assignedDietPlan.fat}g
          </p>
          <p className="text-xs text-muted-foreground">
            {assignedDietPlan.startDate && assignedDietPlan.endDate
              ? `${new Date(assignedDietPlan.startDate).toLocaleDateString()} → ${new Date(
                  assignedDietPlan.endDate
                ).toLocaleDateString()}`
              : "No date range specified"}
          </p>
          {assignedDietPlan.notes && (
            <p className="text-sm italic text-cool-gray mt-2">“{assignedDietPlan.notes}”</p>
          )}
        </div>
      )}

      {/* Referred Tests */}
      {referredTests.length > 0 && (
        <div className="p-4 rounded-xl bg-cool-gray/10 border border-soft-blue/30">
          <h4 className="font-semibold text-soft-blue flex items-center gap-2">🧪 Referred Lab Tests</h4>
          <div className="flex flex-wrap gap-2 mt-3">
            {[...new Map(referredTests.map((t) => [t.id, t])).values()].map((test) => (
              <div
                key={test.id}
                className="flex items-center gap-2 bg-soft-blue/20 text-soft-blue border border-soft-blue/30 px-3 py-1 rounded-lg text-sm"
              >
                {test.name}
                <button
                  onClick={() => handleRemoveTest(test.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Report */}
      <div className="p-4 rounded-xl bg-cool-gray/10 border border-soft-coral/30">
        <h4 className="font-semibold text-soft-blue flex items-center gap-2">📝Report</h4>
        <textarea
          value={doctorReport}
          onChange={(e) => setDoctorReport(e.target.value)}
          placeholder="Write your report here..."
          className="w-full mt-2 p-3 border border-soft-blue/30 rounded-lg text-sm focus:ring-2 focus:ring-soft-coral outline-none"
          rows={4}
        />
      </div>
    </CardContent>

    {/* Mark Appointment Done */}
    {!appointmentDone && (
      <div className="p-4 border-t border-accent/20 flex justify-end gap-3">
        <Button
          className="bg-soft-coral text-white hover:bg-soft-coral/80"
          onClick={handleMarkAppointmentDone}
        >
          Mark Appointment Done
        </Button>
      </div>
    )}
  </Card>
)}





</>



            {/* Fitness Analytics Section */}
            {dataShared ? (
              <Card className="hover-lift overflow-hidden">
                <CardHeader className=" border-b ">
                                        <CardTitle className="text-soft-coral flex items-center gap-2 text-xl ">
                        <Activity className="w-6 h-6" />
                        Health & Fitness Analytics
                      </CardTitle>

                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <EnhancedFitnessCharts data={fitnessData} />
                </CardContent>
              </Card>
            ) : (
              <Card className="hover-lift border-muted">
                <CardContent className="flex flex-col items-center justify-center h-96 text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center">
                    <ShieldOff className="w-12 h-12 text-soft-coral" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-soft-coral">Health Data Not Available</h3>
                    <p className="text-muted-foreground max-w-md">
                      The patient has not granted permission to share detailed health and fitness data. Only basic
                      profile information is accessible.
                    </p>
                  </div>
                 
                </CardContent>
              </Card>
            )}

            {/* Medical Records Section */}
          {dataShared &&
            <Card className="hover-lift border-secondary/20">
              <CardHeader className="bg-secondary/5 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-soft-coral flex items-center gap-2 text-xl">
                      <FileText className="w-6 h-6" />
                      Medical Records & Documents
                    </CardTitle>
                    <CardDescription className="text-base">
                      Patient's medical history, test results, and prescriptions
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-secondary text-secondary">
                    {medicalRecords.length} Records
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid gap-4">
                  {medicalRecords.map((record) => (
                    <div
                      key={record.id}
                      className="group flex  items-center justify-between p-4 border border-secondary/20 rounded-xl  bg-cool-gray/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                          <FileText className="w-6 h-6 text-soft-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-soft-coral group-hover:text-soft-coral/90 transition-colors">
                            {record.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs bg-mint-green text-white">
                                {record.type}
                              </Badge>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDateOnly( new Date(record.date))}
                            </span>
                            {record.doctorName && (
                              <span className="flex items-center gap-1">
                                <Stethoscope className="w-3 h-3" />
                                {record.doctorName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                       
                        size="sm"
                        className=" gap-2 ml-4 bg-soft-blue text-snow-white hover:bg-soft-blue/90 "
                        onClick={() => window.open(record.fileUrl, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            }

            <div ref={labTestsRef}>
  <LabTests onReferTest={handleTestReferral} />
</div>

          </div>
        </div>
      </div>
    </div>
  )
}
