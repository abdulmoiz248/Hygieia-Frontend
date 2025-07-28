"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Activity, FileText, Users, Clock, TrendingUp } from "lucide-react"

const reportsData = [
  { month: "Jan", reports: 45, pending: 5 },
  { month: "Feb", reports: 52, pending: 8 },
  { month: "Mar", reports: 48, pending: 3 },
  { month: "Apr", reports: 61, pending: 7 },
  { month: "May", reports: 55, pending: 4 },
  { month: "Jun", reports: 67, pending: 6 },
]

const testTypesData = [
  { name: "Blood Test", value: 35, color: "var(--color-soft-blue)" },
  { name: "Urine Test", value: 25, color: "var(--color-mint-green)" },
  { name: "X-Ray", value: 20, color: "var(--color-soft-coral)" },
  { name: "MRI", value: 12, color: "var(--color-cool-gray)" },
  { name: "Others", value: 8, color: "var(--color-dark-slate-gray)" },
]

const recentReports = [
  { id: "PAT001", patient: "John Doe", test: "Blood Test", status: "Completed", time: "2 hours ago" },
  { id: "PAT002", patient: "Jane Smith", test: "X-Ray", status: "Pending", time: "4 hours ago" },
  { id: "PAT003", patient: "Mike Johnson", test: "Urine Test", status: "Completed", time: "6 hours ago" },
  { id: "PAT004", patient: "Sarah Wilson", test: "MRI", status: "In Progress", time: "8 hours ago" },
]

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your lab overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">328</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+3</span> since yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94%</div>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 animate-scale-in">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Reports</CardTitle>
            <CardDescription>Reports processed over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                reports: {
                  label: "Reports",
                  color: "var(--color-soft-blue)",
                },
                pending: {
                  label: "Pending",
                  color: "var(--color-soft-coral)",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="reports" fill="var(--color-reports)" radius={4} />
                  <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Types Distribution</CardTitle>
            <CardDescription>Breakdown of different test types</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Tests",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={testTypesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {testTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Latest reports processed in your lab</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{report.patient}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {report.id} • {report.test}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant={
                      report.status === "Completed"
                        ? "default"
                        : report.status === "Pending"
                          ? "destructive"
                          : "secondary"
                    }
                    className="transition-all duration-200"
                  >
                    {report.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{report.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
