"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Clock, AlertTriangle, CheckCircle, Search, Download } from "lucide-react"
import { useLabStore } from "@/store/lab-tech/labTech"

import type { PendingReport } from "@/types/lab-tech/lab-reports"

export function UploadReports() {
  const { pendingReports, uploadReport } = useLabStore()
  const [selectedReport, setSelectedReport] = useState<PendingReport | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadFile(file)
    }
  }, [])

  const handleUploadSubmit = () => {
    if (selectedReport && uploadFile) {
      uploadReport(selectedReport.id, uploadFile)
      setSelectedReport(null)
      setUploadFile(null)
    }
  }

  const filteredReports = pendingReports.filter((report) => {
    const matchesSearch =
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Reports</h2>
          <p className="text-gray-600">Manage and upload lab test reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredReports.length} reports
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2 space-y-4">
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
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
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <Card
                key={report.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedReport?.id === report.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(report.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{report.patientName}</h3>
                          <p className="text-sm text-gray-600">{report.testName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">{report.scheduledDate.toLocaleDateString()}</span>
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{ borderColor: getPriorityColor(report.priority) }}
                        >
                          {report.priority} priority
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.status === "completed" && (
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          updateReportStatus(
                            report.id,
                            report.status === "pending"
                              ? "in-progress"
                              : report.status === "in-progress"
                                ? "completed"
                                : "pending",
                          )
                        }}
                      >
                        <FileText className="w-4 h-4" />
                      </Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upload Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload Report</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedReport ? (
                <>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">{selectedReport.patientName}</h4>
                    <p className="text-sm text-gray-600">{selectedReport.testName}</p>
                    <p className="text-xs text-gray-500 mt-1">Test ID: {selectedReport.testId}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-file">Upload Report File</Label>
                    <Input
                      id="report-file"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      onChange={handleFileUpload}
                    />
                    {uploadFile && <p className="text-xs text-gray-600">Selected: {uploadFile.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea id="notes" placeholder="Add any additional notes or observations..." rows={3} />
                  </div>

                  <Button
                    onClick={handleUploadSubmit}
                    disabled={!uploadFile}
                    className="w-full"
                    style={{ backgroundColor: "var(--color-soft-blue)" }}
                  >
                    Upload Report
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select a report to upload</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <Badge variant="outline">{pendingReports.filter((r) => r.status === "pending").length}</Badge>
              </div>
              {/* <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <Badge variant="outline">{pendingReports.filter((r) => r.status === "in-progress").length}</Badge>
              </div> */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <Badge variant="outline">{pendingReports.filter((r) => r.status === "completed").length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
