"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Download, Search, FileText, Calendar, User } from "lucide-react"
import { useLabStore } from "@/store/lab-tech/labTech"

export function CompletedReports() {
  const { completedReports } = useLabStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  const filteredReports = completedReports.filter((report) => {
    const matchesSearch =
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const reportDate = new Date(report.scheduledDate)
      const today = new Date()
      const daysDiff = Math.floor((today.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24))

      switch (dateFilter) {
        case "today":
          matchesDate = daysDiff === 0
          break
        case "week":
          matchesDate = daysDiff <= 7
          break
        case "month":
          matchesDate = daysDiff <= 30
          break
      }
    }

    return matchesSearch && matchesPriority && matchesDate
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "var(--color-soft-coral)"
      case "medium":
        return "var(--color-soft-blue)"
      case "low":
        return "var(--color-cool-gray)"
      default:
        return "var(--color-cool-gray)"
    }
  }

  const handleDownload = (reportId: string, patientName: string) => {
    // Simulate download functionality
    console.log(`Downloading report ${reportId} for ${patientName}`)
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Completed Reports</h2>
          <p className="text-gray-600">View and download all completed lab test reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredReports.length} completed reports
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by patient name or test..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Completed Reports List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{report.patientName}</h3>
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{ borderColor: getPriorityColor(report.priority) }}
                        >
                          {report.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{report.testName}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Completed: {new Date(report.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>Test ID: {report.testId}</span>
                        </div>
                        {report.uploadedAt && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>Uploaded: {new Date(report.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(report.id, report.patientName)}
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No completed reports found</h3>
              <p className="text-gray-500">
                {searchTerm || priorityFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Completed reports will appear here once tests are uploaded."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      {filteredReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{filteredReports.length}</div>
                <p className="text-sm text-green-700">Total Completed</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredReports.filter((r) => r.priority === "high").length}
                </div>
                <p className="text-sm text-blue-700">High Priority</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {
                    filteredReports.filter((r) => {
                      const today = new Date()
                      const reportDate = new Date(r.scheduledDate)
                      return today.toDateString() === reportDate.toDateString()
                    }).length
                  }
                </div>
                <p className="text-sm text-gray-700">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
