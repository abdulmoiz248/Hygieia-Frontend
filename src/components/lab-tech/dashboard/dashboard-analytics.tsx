"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TestTube, FileCheck, Clock, TrendingUp, Calendar, DollarSign, Activity, Users, Settings } from "lucide-react"
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
  AreaChart,
  Area,
} from "recharts"

const weeklyData = [
  { day: "Mon", tests: 45, completed: 42, revenue: 3200 },
  { day: "Tue", tests: 52, completed: 48, revenue: 3800 },
  { day: "Wed", tests: 38, completed: 35, revenue: 2900 },
  { day: "Thu", tests: 61, completed: 58, revenue: 4200 },
  { day: "Fri", tests: 55, completed: 52, revenue: 3900 },
  { day: "Sat", tests: 28, completed: 26, revenue: 2100 },
  { day: "Sun", tests: 15, completed: 14, revenue: 1200 },
]

const monthlyTrend = [
  { month: "Aug", revenue: 38000, tests: 890 },
  { month: "Sep", revenue: 42000, tests: 950 },
  { month: "Oct", revenue: 39000, tests: 880 },
  { month: "Nov", revenue: 45000, tests: 1020 },
  { month: "Dec", revenue: 48000, tests: 1100 },
  { month: "Jan", revenue: 45600, tests: 1050 },
]

const testCategoryData = [
  { category: "Blood Tests", count: 145, percentage: 35, color: "#3B82F6" },
  { category: "Urine Tests", count: 98, percentage: 24, color: "#10B981" },
  { category: "Imaging", count: 76, percentage: 18, color: "#F59E0B" },
  { category: "Microbiology", count: 52, percentage: 13, color: "#EF4444" },
  { category: "Others", count: 42, percentage: 10, color: "#8B5CF6" },
]

const hourlyActivity = [
  { hour: "8AM", tests: 12, efficiency: 85 },
  { hour: "9AM", tests: 18, efficiency: 92 },
  { hour: "10AM", tests: 25, efficiency: 88 },
  { hour: "11AM", tests: 22, efficiency: 95 },
  { hour: "12PM", tests: 15, efficiency: 78 },
  { hour: "1PM", tests: 8, efficiency: 65 },
  { hour: "2PM", tests: 20, efficiency: 89 },
  { hour: "3PM", tests: 28, efficiency: 94 },
  { hour: "4PM", tests: 24, efficiency: 91 },
  { hour: "5PM", tests: 16, efficiency: 87 },
]

const performanceMetrics = [
  { metric: "Average Turnaround Time", value: "2.4 hours", trend: "down", change: "-15%", color: "text-green-600" },
  { metric: "Test Accuracy Rate", value: "99.2%", trend: "up", change: "+0.3%", color: "text-green-600" },
  { metric: "Equipment Utilization", value: "87%", trend: "up", change: "+5%", color: "text-green-600" },
  { metric: "Patient Satisfaction", value: "4.8/5", trend: "up", change: "+0.2", color: "text-green-600" },
]

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

export function DashboardAnalytics() {
  const { analytics,  initializeMockData, getPendingCount, getCompletedCount } =
    useLabStore()

  useEffect(() => {
    initializeMockData()
  }, [initializeMockData])

  const currentPendingCount = getPendingCount()
  const currentCompletedCount = getCompletedCount()
  const completionRate = analytics.totalTests > 0 ? Math.round((currentCompletedCount / analytics.totalTests) * 100) : 0

  return (
    <div className="space-y-6 mt-0 p-6 bg-snow-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lab Dashboard</h1>
        <p className="text-gray-600">Monitor your lab operations and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Tests</CardTitle>
            <TestTube className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{analytics.totalTests.toLocaleString()}</div>
            <p className="text-xs text-blue-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Completed</CardTitle>
            <FileCheck className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{currentCompletedCount.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <Progress value={completionRate} className="flex-1 h-2" />
              <span className="text-xs text-green-600 ml-2 font-medium">{completionRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Pending Reports</CardTitle>
            <Clock className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">{currentPendingCount}</div>
            <Badge variant="outline" className="mt-1 text-xs border-orange-300 text-orange-700">
              Requires attention
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Today's Tests</CardTitle>
            <Calendar className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{analytics.todayTests}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600 font-medium">+{analytics.weeklyGrowth}% this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{metric.metric}</p>
                  <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`flex items-center text-xs font-medium ${metric.color}`}>
                  <TrendingUp className={`w-4 h-4 mr-1 ${metric.trend === "down" ? "rotate-180" : ""}`} />
                  {metric.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Tests Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
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
                <Bar dataKey="tests" fill="#3B82F6" name="Scheduled" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Test Categories Pie Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
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

      {/* Revenue and Hourly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Monthly Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-3xl font-bold text-gray-900">${analytics.monthlyRevenue.toLocaleString()}</div>
                <p className="text-sm text-gray-500">Current month</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600">+12.5%</div>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#colorRevenue)" strokeWidth={3} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Today's Hourly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={hourlyActivity} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="tests" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "10:30 AM", action: "Blood test completed for John Doe", type: "completed", icon: FileCheck },
              { time: "09:45 AM", action: "New urgent test scheduled - Lipid Profile", type: "urgent", icon: Clock },
              { time: "09:15 AM", action: "Report uploaded for Jane Smith", type: "upload", icon: TrendingUp },
              { time: "08:30 AM", action: "Daily calibration completed", type: "system", icon: Settings },
            ].map((activity, index) => {
              const Icon = activity.icon
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor:
                        activity.type === "completed"
                          ? "#10B981"
                          : activity.type === "urgent"
                            ? "#EF4444"
                            : activity.type === "upload"
                              ? "#3B82F6"
                              : "#6B7280",
                    }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
