"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { PatientMetricsChart } from "@/components/nutritionist/dashboard/patient-metrics-chart"
import { AppointmentTrendsChart } from "@/components/nutritionist/dashboard/appointment-trends-chart"

import { useAppointmentStore } from "@/store/nutritionist/appointment-store"

import WelcomeSection from "@/components/nutritionist/dashboard/WelcomeSection"
import NutritionistStats from "@/components/nutritionist/dashboard/StatsCards"
import { AppointmentStatus } from "@/types/patient/appointment"
import RecentDietPlans from "@/components/nutritionist/dashboard/Recent"

export default function DashboardPage() {

  const { appointments,isLoading:isLoading2 } = useAppointmentStore()




 

  const todayAppointments = appointments.filter((apt) => apt.status === AppointmentStatus.Upcoming || apt.status === "completed")
  if( isLoading2){
    return <>loading....</>
  }

  return (
   
      <div className="space-y-4 md:space-y-6 fade-in">
        {/* Header */}
         <WelcomeSection/>
          <NutritionistStats/>
        
        


        <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-2">
          <PatientMetricsChart />
          <AppointmentTrendsChart />
        </div>

      
        <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-2 bg-white/60">
          {/* Today's Schedule */}
          <Card className="scale-in bg-white/60">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Clock className="h-5 w-5" style={{ color: "var(--color-soft-blue)" }} />
                <span>Today&apos;s Schedule</span>
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
          <RecentDietPlans/>
        </div>
      </div>
  
  )
}
