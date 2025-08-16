"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {Activity, Users } from "lucide-react"
import { useLabStore } from "@/store/lab-tech/labTech"
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

const weeklyData = [
  { day: "Mon", tests: 45, completed: 42, revenue: 3200 },
  { day: "Tue", tests: 52, completed: 48, revenue: 3800 },
  { day: "Wed", tests: 38, completed: 35, revenue: 2900 },
  { day: "Thu", tests: 61, completed: 58, revenue: 4200 },
  { day: "Fri", tests: 55, completed: 52, revenue: 3900 },
  { day: "Sat", tests: 28, completed: 26, revenue: 2100 },
  { day: "Sun", tests: 15, completed: 14, revenue: 1200 },
]



const testCategoryData = [
  { category: "Blood Tests", count: 145, percentage: 35, color: "#3B82F6" },
  { category: "Urine Tests", count: 98, percentage: 24, color: "#10B981" },
  { category: "Imaging", count: 76, percentage: 18, color: "#F59E0B" },
  { category: "Microbiology", count: 52, percentage: 13, color: "#EF4444" },
  { category: "Others", count: 42, percentage: 10, color: "#8B5CF6" },
]



const COLORS = ["var(--color-mint-green)", "var(--color-soft-blue)", "var(--color-cool-gray)", "var(--color-soft-coral)", "var(--color-dark-slate-gray)"]

export function DashboardAnalytics() {
  const {   initializeMockData } =
    useLabStore()
  
  useEffect(() => {
    initializeMockData()
  }, [initializeMockData])


 

  return (
    <div className="space-y-6 mt-0 p-6 bg-snow-white min-h-screen">
      {/* Header */}
     <WelcomeSection/>

    <KeyMetrics/>

    

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
              <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                <Bar dataKey="completed" fill="var(--color-mint-green)" name="Completed" radius={[4, 4, 0, 0]} />
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
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
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
      <RecentActivity/>
    </div>
  )
}
