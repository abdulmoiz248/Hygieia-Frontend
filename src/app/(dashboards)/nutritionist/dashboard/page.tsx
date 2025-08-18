"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calendar, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { PatientMetricsChart } from "@/components/nutritionist/dashboard/patient-metrics-chart"
import { AppointmentTrendsChart } from "@/components/nutritionist/dashboard/appointment-trends-chart"
import { SuccessRateChart } from "@/components/nutritionist/dashboard/success-rate-chart"
import { NutritionGoalsChart } from "@/components/nutritionist/dashboard/nutrition-goals-chart"
import { useDashboardStore } from "@/store/nutritionist/dashboard-store"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"
import { useDietPlanStore } from "@/store/nutritionist/diet-plan-store"
import WelcomeSection from "@/components/nutritionist/dashboard/WelcomeSection"
import NutritionistStats from "@/components/nutritionist/dashboard/StatsCards"
import { AppointmentStatus } from "@/types/patient/appointment"

export default function DashboardPage() {
  const { stats, isLoading, refreshStats } = useDashboardStore()
  const { appointments } = useAppointmentStore()
  const { dietPlans } = useDietPlanStore()

  useEffect(() => {
    refreshStats()
  }, [refreshStats])

  const todayAppointments = appointments.filter((apt) => apt.status === AppointmentStatus.Upcoming || apt.status === "completed")
 
  return (
   
      <div className="space-y-4 md:space-y-6 fade-in">
        {/* Header */}
         <WelcomeSection/>
          <NutritionistStats/>

        <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-2">
          <PatientMetricsChart />
          <AppointmentTrendsChart />
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-2">
          <SuccessRateChart />
          <NutritionGoalsChart />
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-2 bg-white/60">
          {/* Today's Schedule */}
          <Card className="scale-in bg-white/60">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Clock className="h-5 w-5" style={{ color: "var(--color-soft-blue)" }} />
                <span>Today's Schedule</span>
              </CardTitle>
              <CardDescription>Your upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayAppointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-cool-gray/10 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          appointment.status === "completed" ? "var(--color-mint-green)" : "var(--color-soft-coral)",
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-soft-coral">{appointment.patient?.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-medium">{appointment.time}</p>
                    <Badge
                    
                      className="text-xs mt-1 text-snow-white bg-soft-blue"
                    >
                      {appointment.status === "completed" ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Upcoming
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full bg-transparent">
                View All Appointments
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="scale-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingUp className="h-5 w-5" style={{ color: "var(--color-mint-green)" }} />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest patient updates and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div
                  className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: "var(--color-mint-green)" }}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">Sarah Davis</span> completed her 30-day meal plan
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: "var(--color-soft-blue)" }}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">John Martinez</span> lost 5 lbs this week
                  </p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: "var(--color-soft-coral)" }}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    New diet plan assigned to <span className="font-medium">Lisa Thompson</span>
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
  
  )
}
