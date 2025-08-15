"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Clock, AlertTriangle, Search, CheckCircle } from "lucide-react"
import { useLabStore } from "@/store/lab-tech/labTech"
import { PendingReport } from "@/types/lab-tech/lab-reports"

export function PendingReports() {
  const { pendingReports, uploadReport, initializeMockData, getPendingCount } = useLabStore()
  const [selectedReport, setSelectedReport] = useState<PendingReport | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  useEffect(() => {
    initializeMockData()
  }, [initializeMockData])

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
      // Reset file input
      const fileInput = document.getElementById("report-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""
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
        return "#EF4444"
      case "medium":
        return "#F59E0B"
      case "low":
        return "#10B981"
      default:
        return "#6B7280"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const currentPendingCount = getPendingCount()

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Reports</h1>
        <p className="text-gray-600">Manage and upload pending lab test reports</p>
        <div className="flex items-center space-x-4 mt-4">
          <Badge variant="outline" className="text-sm bg-orange-50 border-orange-200 text-orange-700">
            {currentPendingCount} pending reports
          </Badge>
          <Badge variant="outline" className="text-sm bg-blue-50 border-blue-200 text-blue-700">
            {pendingReports.filter((r) => r.status === "pending").length} awaiting upload
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by patient name or test..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-gray-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-gray-200">
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

          <div className="space-y-3">
            {filteredReports.map((report) => (
              <Card
                key={report.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-0 shadow-md ${
                  selectedReport?.id === report.id ? "ring-2 ring-blue-500 shadow-lg" : ""
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getStatusIcon(report.status)}
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{report.patientName}</h3>
                          <p className="text-gray-600 font-medium">{report.testName}</p>
                          <p className="text-xs text-gray-500 mt-1">Test ID: {report.testId}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 font-medium">
                          {new Date(report.scheduledDate).toLocaleDateString()} at {report.scheduledTime}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs font-medium"
                          style={{
                            borderColor: getPriorityColor(report.priority),
                            color: getPriorityColor(report.priority),
                            backgroundColor: `${getPriorityColor(report.priority)}10`,
                          }}
                        >
                          {report.priority} priority
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs capitalize font-medium bg-orange-50 border-orange-200 text-orange-700"
                        >
                          {report.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedReport(report)
                        }}
                        className="hover:bg-blue-50"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredReports.length === 0 && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Upload className="w-6 h-6 text-blue-600" />
                <span>Upload Report</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedReport ? (
                <>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-gray-900 text-lg">{selectedReport.patientName}</h4>
                    <p className="text-gray-700 font-medium">{selectedReport.testName}</p>
                    <p className="text-sm text-gray-600 mt-2">Test ID: {selectedReport.testId}</p>
                    <p className="text-sm text-gray-600">
                      Scheduled: {new Date(selectedReport.scheduledDate).toLocaleDateString()} at {selectedReport.scheduledTime}
                    </p>
                    <div className="flex items-center mt-2">
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: getPriorityColor(selectedReport.priority),
                          color: getPriorityColor(selectedReport.priority),
                          backgroundColor: `${getPriorityColor(selectedReport.priority)}20`,
                        }}
                      >
                        {selectedReport.priority} priority
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-file" className="text-sm font-medium text-gray-700">
                      Upload Report File
                    </Label>
                    <Input
                      id="report-file"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      onChange={handleFileUpload}
                      className="border-gray-200 focus:border-blue-500"
                    />
                    {uploadFile && <p className="text-sm text-green-600 font-medium">✓ Selected: {uploadFile.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional notes or observations..."
                      rows={3}
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <Button
                    onClick={handleUploadSubmit}
                    disabled={!uploadFile}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Report
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a report to upload</h3>
                  <p className="text-gray-500">Choose a pending report from the list to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Pending Upload</span>
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">{currentPendingCount}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">High Priority</span>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {pendingReports.filter((r) => r.priority === "high").length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
