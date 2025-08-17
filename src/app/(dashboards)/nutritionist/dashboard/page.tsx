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

export default function DashboardPage() {
  const { stats, isLoading, refreshStats } = useDashboardStore()
  const { appointments } = useAppointmentStore()
  const { dietPlans } = useDietPlanStore()

  useEffect(() => {
    refreshStats()
  }, [refreshStats])

  const todayAppointments = appointments.filter((apt) => apt.status === "scheduled" || apt.status === "completed")
  const completedToday = appointments.filter((apt) => apt.status === "completed").length
  const upcomingToday = appointments.filter((apt) => apt.status === "scheduled").length
  const activePlans = dietPlans.filter((plan) => plan.status === "active").length
  const totalPatients = new Set(appointments.map((apt) => apt.patientInfo?.id)).size
  const successRate = Math.round((completedToday / Math.max(todayAppointments.length, 1)) * 100)

  return (
   
      <div className="space-y-4 md:space-y-6 fade-in p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight font-serif"
              style={{ color: "var(--color-dark-slate-gray)" }}
            >
              Welcome, Dr. Johnson
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Here's what's happening with your patients today.
            </p>
          </div>
          <Button
            onClick={refreshStats}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="self-start md:self-auto bg-transparent w-fit"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "var(--color-soft-blue)" }}>
                {isLoading ? "..." : totalPatients}
              </div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "var(--color-mint-green)" }}>
                {todayAppointments.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {completedToday} completed, {upcomingToday} upcoming
              </p>
            </CardContent>
          </Card>

          <Card className="slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Diet Plans</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "var(--color-soft-coral)" }}>
                {activePlans}
              </div>
              <p className="text-xs text-muted-foreground">+8 new this week</p>
            </CardContent>
          </Card>

          <Card className="slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "var(--color-mint-green)" }}>
                {isLoading ? "..." : `${successRate}%`}
              </div>
              <p className="text-xs text-muted-foreground">Patient goal achievement</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-2">
          <PatientMetricsChart />
          <AppointmentTrendsChart />
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-2">
          <SuccessRateChart />
          <NutritionGoalsChart />
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-2">
          {/* Today's Schedule */}
          <Card className="scale-in">
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
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
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
                      <p className="font-medium truncate">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground truncate">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-medium">{appointment.time}</p>
                    <Badge
                      variant={appointment.status === "completed" ? "outline" : "secondary"}
                      className="text-xs mt-1"
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
