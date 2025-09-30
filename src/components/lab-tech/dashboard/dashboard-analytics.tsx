"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import WelcomeSection from "./WelcomeSection"
import KeyMetrics from "./keyMetrices"
import RecentActivity from "./RecentActivity"
import Loader from '@/components/loader/loader'
import { useLabTechnicianDashboard } from "@/hooks/useLabTechnicianDashboard"

const COLORS = [
  "var(--color-mint-green)",
  "var(--color-soft-blue)",
  "var(--color-cool-gray)",
  "var(--color-soft-coral)",
  "var(--color-dark-slate-gray)",
]

interface DashboardAnalyticsProps {
  techId: string
}

export function DashboardAnalytics({ techId }: DashboardAnalyticsProps) {
  const { data, isLoading, isError } = useLabTechnicianDashboard(techId)

  const weeklyData = data?.weeklyData ?? []
  const testCategoryData = data?.testCategoryData ?? []

  const todayIndex = new Date().getDay()

  const orderedWeeklyData = [
    ...weeklyData.slice(todayIndex + 1),
    ...weeklyData.slice(0, todayIndex + 1),
  ]

  if (isLoading)
    {
           return (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader />
              </div>
            )
        }
  if (isError)
    return <p className="p-6 text-center text-red-500">Failed to load dashboard analytics</p>

  return (
    <div className="space-y-6 mt-0 p-6 bg-snow-white min-h-screen">
      {/* Header */}
      <WelcomeSection techId={techId} />

      {/* Key Metrics */}
      <KeyMetrics techId={techId}/>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Tests Chart */}
        <Card className="border-0 shadow-lg bg-white/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-cool-gray flex items-center">
              <Activity className="w-5 h-5 mr-2 text-soft-blue" />
              Weekly Test Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={orderedWeeklyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="completed"
                  fill="var(--color-mint-green)"
                  name="Completed"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Test Categories Pie Chart */}
        <Card className="border-0 shadow-lg bg-white/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-cool-gray flex items-center">
              <Users className="w-5 h-5 mr-2 text-soft-blue" />
              Test Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={testCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category }) => `${category}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {testCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
