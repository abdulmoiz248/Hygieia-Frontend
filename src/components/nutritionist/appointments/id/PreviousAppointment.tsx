"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Dumbbell,
  FileText,
  Flame,
  Utensils,
  ClipboardList,
  CalendarClock,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import api from "@/lib/axios"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── API helper ───────────────────────────────────────────────────────────────

export const getPreviousAppointments = async (
  nutritionistId: string,
  patientId: string
): Promise<AppointmentWithDietPlan[]> => {
  const res = await api.get(`/appointments/previous/${nutritionistId}/${patientId}`)
  // Backend may return null / undefined on no data — normalise to array
  return Array.isArray(res.data) ? res.data : []
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PreviousAppointmentsCard({
  nutritionistId,
  patientId,
}: {
  nutritionistId: string
  patientId: string
}) {
  const [appointments, setAppointments] = useState<AppointmentWithDietPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Resolve the nutritionist ID:
   * 1. Use the prop if non-empty (comes from the Zustand store)
   * 2. Fall back to localStorage "id" — covers the case where the store
   *    hasn't hydrated yet when the component first mounts
   */
  const resolvedNutritionistId =
    nutritionistId && nutritionistId.trim() !== ""
      ? nutritionistId
      : typeof window !== "undefined"
      ? (localStorage.getItem("id") ?? "")
      : ""

  const fetchData = useCallback(async () => {
    // Guard: don't fire the request if either ID is still missing
    if (!resolvedNutritionistId || !patientId) {
      setLoading(false)
      setError("Could not determine nutritionist ID. Please refresh.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await getPreviousAppointments(resolvedNutritionistId, patientId)
      setAppointments(res)
    } catch (err: any) {
      console.error("Failed to fetch previous appointments", err)
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to load previous appointments."
      )
    } finally {
      setLoading(false)
    }
  }, [resolvedNutritionistId, patientId])

  // Re-run whenever the resolved ID becomes available (store hydration may be async)
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Card className="hover-lift">
        <CardHeader className="bg-white">
          <CardTitle className="text-soft-coral flex items-center gap-2">
            <CalendarClock className="w-5 h-5" />
            Previous Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center gap-2 text-cool-gray text-sm animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading previous appointments…
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <Card className="hover-lift">
        <CardHeader className="bg-white">
          <CardTitle className="text-soft-coral flex items-center gap-2">
            <CalendarClock className="w-5 h-5" />
            Previous Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2 text-soft-coral text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchData}
              className="w-fit border-soft-blue text-soft-blue hover:bg-soft-blue/10"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Empty ────────────────────────────────────────────────────────────────
  if (!appointments.length) {
    return (
      <Card className="hover-lift">
        <CardHeader className="bg-white">
          <CardTitle className="text-soft-coral flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Previous Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 text-soft-blue text-sm">
          No previous appointments found.
        </CardContent>
      </Card>
    )
  }

  // ── Data ─────────────────────────────────────────────────────────────────
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
            const diet =
              appt.diet_plan && appt.diet_plan.length > 0 ? appt.diet_plan[0] : null

            const formattedDate = (() => {
              try {
                return new Intl.DateTimeFormat("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(new Date(appt.date))
              } catch {
                return appt.date
              }
            })()

            const formattedTime = (() => {
              try {
                const [h, m] = appt.time.split(":")
                const d = new Date()
                d.setHours(Number(h), Number(m))
                return new Intl.DateTimeFormat("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }).format(d)
              } catch {
                return appt.time
              }
            })()

            const typeColor =
              appt.type === "follow-up"
                ? "bg-mint-green"
                : appt.type === "consultation"
                ? "bg-soft-blue"
                : "bg-soft-coral"

            const statusStyle =
              appt.status === "completed"
                ? "bg-mint-green/15 text-mint-green border border-mint-green/30"
                : appt.status === "cancelled"
                ? "bg-soft-coral/15 text-soft-coral border border-soft-coral/30"
                : "bg-soft-blue/15 text-soft-blue border border-soft-blue/30"

            return (
              <AccordionItem
                key={appt.id}
                value={`item-${i}`}
                className="border border-cool-gray/20 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline px-0 py-0 [&>svg]:mr-3 [&>svg]:text-cool-gray [&>svg]:flex-shrink-0">
                  <div className="flex items-stretch w-full text-left">
                    {/* Colored left stripe by type */}
                    <div className={`w-1 flex-shrink-0 ${typeColor}`} />
                    <div className="flex-1 px-3 py-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-soft-coral leading-tight">
                          {formattedDate}
                        </p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle}`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-cool-gray mt-1">
                        {formattedTime} · {appt.type.charAt(0).toUpperCase() + appt.type.slice(1)} · {appt.mode}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="space-y-4 p-4">
                  <div className="space-y-3">
                    {/* Notes */}
                    <div className="p-2 rounded-lg bg-cool-gray/10">
                      <p className="text-sm text-soft-blue mb-1 flex items-center gap-1">
                        <ClipboardList className="w-4 h-4" />
                        Notes
                      </p>
                      <p className="text-sm text-cool-gray">{appt.notes || "N/A"}</p>
                    </div>

                    {/* Report */}
                    {appt.report && (
                      <div className="p-2 rounded-lg bg-cool-gray/10">
                        <p className="text-sm text-soft-blue mb-1 flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          Nutritionist Report
                        </p>
                        <p className="text-sm text-cool-gray">{appt.report}</p>
                      </div>
                    )}

                    {diet ? (
                      <>
                        {/* Diet plan summary */}
                        <div className="p-2 rounded-lg bg-cool-gray/10">
                          <p className="text-sm text-soft-blue mb-2 flex items-center gap-1">
                            <Utensils className="w-4 h-4" />
                            Diet Plan Summary
                          </p>
                          <div className="flex flex-col gap-2 text-sm text-cool-gray">
                            <div>
                              <span className="text-soft-blue">Calories:</span>{" "}
                              {diet.daily_calories} kcal
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
                            {diet.deficiency && (
                              <div>
                                <span className="text-soft-blue">Deficiency:</span>{" "}
                                {diet.deficiency}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Exercise plan */}
                        {diet.exercise && (
                          <div className="p-2 rounded-lg bg-cool-gray/10">
                            <p className="text-sm text-soft-blue mb-2 flex items-center gap-1">
                              <Dumbbell className="w-4 h-4" />
                              Exercise Plan
                            </p>
                            <p className="text-sm text-cool-gray">{diet.exercise}</p>
                          </div>
                        )}

                        {/* Calories burned */}
                        {diet.calories_burned && (
                          <div className="p-2 rounded-lg bg-cool-gray/10 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-soft-blue">
                              <Flame className="w-4 h-4" /> Calories Burned
                            </div>
                            <p className="text-sm text-cool-gray">{diet.calories_burned} kcal</p>
                          </div>
                        )}

                        {/* Plan duration */}
                        {(diet.start_date || diet.end_date) && (
                          <div className="p-2 rounded-lg bg-cool-gray/10 flex flex-col text-sm">
                            <div className="flex items-center gap-1 text-soft-blue mb-1">
                              <Activity className="w-4 h-4" /> Plan Duration
                            </div>
                            <p className="text-cool-gray">
                              {diet.start_date || "N/A"} → {diet.end_date || "N/A"}
                            </p>
                          </div>
                        )}

                        {/* Nutritionist notes */}
                        {diet.notes && (
                          <div className="p-2 rounded-lg bg-cool-gray/10">
                            <p className="text-sm text-soft-blue mb-1">Nutritionist Notes</p>
                            <p className="text-sm text-cool-gray">{diet.notes}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-cool-gray italic">No diet plan assigned.</p>
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