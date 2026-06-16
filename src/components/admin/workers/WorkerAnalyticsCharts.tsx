"use client"

import {

  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  BarChart,
  Area,
  AreaChart,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { WorkerReport } from "@/hooks/admin/workers/useWorkerReport"

interface WorkerAnalyticsChartsProps {
  analytics: WorkerReport["analytics"]
}

export function WorkerAnalyticsCharts({ analytics }: WorkerAnalyticsChartsProps) {
  if (!analytics) return null

  // Helper to format month
  const formatMonth = (monthString: string) => {
    const d = new Date(monthString + "-01")
    return d.toLocaleDateString("en-US", { month: "short" })
  }

  // Format patient growth data
  const patientGrowthData = analytics.patientTrends?.patientGrowthLast12Months.map((item) => ({
    month: formatMonth(item.month),
    new: item.newPatients,
    cumulative: item.cumulativePatients,
  })) || []

  // Check what time series data is available
  const hasAppointments = analytics.timeSeries?.appointmentsLast12Months && analytics.timeSeries.appointmentsLast12Months.length > 0
  const hasLabTests = analytics.timeSeries?.labTestsLast12Months && analytics.timeSeries.labTestsLast12Months.length > 0
  const hasPrescriptions = analytics.timeSeries?.prescriptionsLast12Months && analytics.timeSeries.prescriptionsLast12Months.length > 0

  let primarySeriesData: any[] = []
  let primarySeriesConfig: any = {}
  let primarySeriesTitle = ""
  let primarySeriesDesc = ""
  let primaryDataKey1 = ""
  let primaryDataKey2 = ""

  if (hasAppointments) {
    primarySeriesData = analytics.timeSeries.appointmentsLast12Months!.map((item) => ({
      month: formatMonth(item.month),
      total: item.totalAppointments,
      completed: item.completedAppointments,
    }))
    primarySeriesTitle = "Appointments Trend"
    primarySeriesDesc = "Total vs Completed appointments over the last 12 months"
    primarySeriesConfig = {
      total: { label: "Total", color: "var(--color-soft-blue)" },
      completed: { label: "Completed", color: "var(--color-mint-green)" },
    }
    primaryDataKey1 = "total"
    primaryDataKey2 = "completed"
  } else if (hasLabTests) {
    primarySeriesData = analytics.timeSeries.labTestsLast12Months!.map((item) => ({
      month: formatMonth(item.month),
      total: item.totalLabBookings,
      completed: item.completedBookings,
      pending: item.pendingBookings
    }))
    primarySeriesTitle = "Lab Tests Trend"
    primarySeriesDesc = "Total vs Completed lab tests over the last 12 months"
    primarySeriesConfig = {
      total: { label: "Total", color: "var(--color-soft-blue)" },
      completed: { label: "Completed", color: "var(--color-mint-green)" },
    }
    primaryDataKey1 = "total"
    primaryDataKey2 = "completed"
  } else if (hasPrescriptions) {
    primarySeriesData = analytics.timeSeries.prescriptionsLast12Months!.map((item) => ({
      month: formatMonth(item.month),
      total: item.totalPrescriptions,
      active: item.activePrescriptions,
    }))
    primarySeriesTitle = "Prescriptions Trend"
    primarySeriesDesc = "Total vs Active prescriptions over the last 12 months"
    primarySeriesConfig = {
      total: { label: "Total", color: "var(--color-soft-blue)" },
      active: { label: "Active", color: "var(--color-mint-green)" },
    }
    primaryDataKey1 = "total"
    primaryDataKey2 = "active"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Primary Trend Chart */}
      {primarySeriesData.length > 0 && (
        <Card className="border-secondary/20 bg-cool-gray/5 hover-lift shadow-sm h-[390px] overflow-hidden flex flex-col">
          <CardHeader className="shrink-0 space-y-2 pb-3">
            <CardTitle className="text-soft-blue">{primarySeriesTitle}</CardTitle>
            <CardDescription>{primarySeriesDesc}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 px-5 pb-5 pt-0">
            <ChartContainer
              config={primarySeriesConfig}
              className="h-full min-h-[250px] w-full"
            >
              <BarChart data={primarySeriesData} margin={{ top: 12, right: 14, left: -12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-cool-gray)" strokeOpacity={0.2} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: "var(--color-dark-slate-gray)" }} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: "var(--color-dark-slate-gray)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey={primaryDataKey1} fill="var(--color-soft-blue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey={primaryDataKey2} fill="var(--color-mint-green)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Patient Growth Chart */}
      {patientGrowthData.length > 0 && (
        <Card className="border-secondary/20 bg-cool-gray/5 hover-lift shadow-sm h-[390px] overflow-hidden flex flex-col">
          <CardHeader className="shrink-0 space-y-2 pb-3">
            <CardTitle className="text-soft-coral">Patient Growth</CardTitle>
            <CardDescription>Cumulative unique patients assigned</CardDescription>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 px-5 pb-5 pt-0">
            <ChartContainer
              config={{
                cumulative: { label: "Total Patients", color: "var(--color-soft-coral)" },
              }}
              className="h-full min-h-[250px] w-full"
            >
              <AreaChart data={patientGrowthData} margin={{ top: 12, right: 14, left: -12, bottom: 8 }}>
                <defs>
                  <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-soft-coral)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-soft-coral)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-cool-gray)" strokeOpacity={0.2} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: "var(--color-dark-slate-gray)" }} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: "var(--color-dark-slate-gray)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke="var(--color-soft-coral)"
                  fillOpacity={1}
                  fill="url(#colorCumulative)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
