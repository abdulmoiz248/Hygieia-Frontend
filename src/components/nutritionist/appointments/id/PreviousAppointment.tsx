"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Activity, Dumbbell, FileText, Flame, Utensils, ClipboardList, CalendarClock } from "lucide-react"
import api from "@/lib/axios"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type AppointmentWithDietPlan = {
  id: string
  date: string
  time: string
  status: string
  type: string
  notes?: string
  report?: string
  mode: string
  data_shared: boolean
  created_at: string
  updated_at: string
  diet_plan_id?: string
  diet_plan?: {
    id: string
    daily_calories: string
    protein: string
    carbs: string
    fat: string
    deficiency: string
    notes?: string
    calories_burned: string
    exercise: string
    start_date?: string
    end_date?: string
    created_at: string
  }[]
}

export const getPreviousAppointments = async (nutritionistId: string, patientId: string) => {
  const res = await api.get(`/appointments/previous/${nutritionistId}/${patientId}`)
  return res.data as AppointmentWithDietPlan[]
}

export default function PreviousAppointmentsCard({
  nutritionistId,
  patientId
}: {
  nutritionistId: string
  patientId: string
}) {
  const [appointments, setAppointments] = useState<AppointmentWithDietPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPreviousAppointments(nutritionistId, patientId)
        setAppointments(res)
      } catch (err) {
        console.error("Failed to fetch previous appointments", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [nutritionistId, patientId])

  if (loading) return <p>Loading previous appointments...</p>

  if (!appointments.length) {
    return (
      <Card className="hover-lift">
        <CardHeader className="bg-white">
          <CardTitle className="text-soft-coral flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Previous Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 text-soft-blue">No previous appointments found.</CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover-lift">
      <CardHeader className="bg-white">
        <CardTitle className="text-soft-coral flex items-center gap-2">
          <CalendarClock className="w-5 h-5" />
          Previous Appointments
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <Accordion type="single" collapsible className="space-y-3">
          {appointments.map((appt, i) => {
            const diet = appt.diet_plan && appt.diet_plan.length > 0 ? appt.diet_plan[0] : null

            return (
              <AccordionItem key={appt.id} value={`item-${i}`} className="border border-cool-gray/20 rounded-xl">
                <AccordionTrigger className="text-soft-blue hover:text-soft-coral px-3 py-2">
                  <div className="flex flex-col items-start w-full text-left">
                    <p className="font-semibold text-base text-soft-coral">
                      {appt.date} at {appt.time}
                    </p>
                    <p className="text-sm text-cool-gray">
                      {appt.type.charAt(0).toUpperCase() + appt.type.slice(1)} • {appt.mode} • {appt.status}
                    </p>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="space-y-4 p-4">
                  <div className="space-y-3">
                    <div className="p-2 rounded-lg bg-cool-gray/10">
                      <p className="text-sm text-soft-blue mb-1 flex items-center gap-1">
                        <ClipboardList className="w-4 h-4" />
                        Notes
                      </p>
                      <p className="text-sm text-cool-gray">{appt.notes || "N/A"}</p>
                    </div>

                    {diet && (
                      <>
                        <div className="p-2 rounded-lg bg-cool-gray/10">
                          <p className="text-sm text-soft-blue mb-2 flex items-center gap-1">
                            <Utensils className="w-4 h-4" />
                            Diet Plan Summary
                          </p>
                         <div className="flex flex-col gap-2 text-sm text-cool-gray">
  <div>
    <span className="text-soft-blue">Calories:</span> {diet.daily_calories} kcal
  </div>
  <div>
    <span className="text-soft-blue">Protein:</span> {diet.protein} g
  </div>
  <div>
    <span className="text-soft-blue">Carbs:</span> {diet.carbs} g
  </div>
  <div>
    <span className="text-soft-blue">Fat:</span> {diet.fat} g
  </div>
  <div>
    <span className="text-soft-blue">Deficiency:</span> {diet.deficiency}
  </div>
</div>

                        </div>

                        <div className="p-2 rounded-lg bg-cool-gray/10">
                          <p className="text-sm text-soft-blue mb-2 flex items-center gap-1">
                            <Dumbbell className="w-4 h-4" />
                            Exercise Plan
                          </p>
                          <p className="text-sm text-cool-gray">{diet.exercise}</p>
                        </div>

                        <div className="p-2 rounded-lg bg-cool-gray/10 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-soft-blue">
                            <Flame className="w-4 h-4" /> Calories Burned
                          </div>
                          <p className="text-sm text-cool-gray">{diet.calories_burned} kcal</p>
                        </div>

                        <div className="p-2 rounded-lg bg-cool-gray/10 flex flex-col text-sm">
                          <div className="flex items-center gap-1 text-soft-blue mb-1">
                            <Activity className="w-4 h-4" /> Plan Duration
                          </div>
                          <p className="text-cool-gray">
                            {diet.start_date || "N/A"} → {diet.end_date || "N/A"}
                          </p>
                        </div>

                        <div className="p-2 rounded-lg bg-cool-gray/10">
                          <p className="text-sm text-soft-blue mb-1">Nutritionist Notes</p>
                          <p className="text-sm text-cool-gray">{diet.notes || "N/A"}</p>
                        </div>
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  )
}
