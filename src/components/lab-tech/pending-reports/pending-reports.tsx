"use client"

import type React from "react"
import { useState, useCallback,  useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Clock, AlertTriangle,  CheckCircle, Edit3 } from "lucide-react"
import { useLabStore } from "@/store/lab-tech/labTech"
import type { PendingReport } from "@/types/lab-tech/lab-reports"
import PendingHeader from "./PendingHeader"
import { PendingReportFilter } from "./PendingReportsFilter"

export function PendingReports() {
  const { pendingReports, uploadReport } = useLabStore()
  const [selectedReport, setSelectedReport] = useState<PendingReport | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [reportValues, setReportValues] = useState({
    results: "",
    findings: "",
    recommendations: "",
    normalRange: "",
    units: "",
  })

  const uploadSectionRef = useRef<HTMLDivElement | null>(null)

  


  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadFile(file)
    }
  }, [])

  const handleValueSubmit = () => {
    if (selectedReport && (reportValues.results || reportValues.findings)) {
      const reportData = JSON.stringify(reportValues)
      const blob = new Blob([reportData], { type: "application/json" })
      const file = new File([blob], `${selectedReport.testName}-results.json`, { type: "application/json" })

   uploadReport(selectedReport.id, file, reportValues, selectedReport.type)
      setSelectedReport(null)
      setReportValues({
        results: "",
        findings: "",
        recommendations: "",
        normalRange: "",
        units: "",
      })
    }
  }

  const handleUploadSubmit = () => {
    if (selectedReport && uploadFile) {
      uploadReport(selectedReport.id, uploadFile, undefined, selectedReport.type)
      setSelectedReport(null)
      setUploadFile(null)
      const fileInput = document.getElementById("report-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    }
  }

  const isFileUploadOnly = (reportType: string) => {
    
    return reportType === "scan"
  }

  const filteredReports = pendingReports.filter((report) => {
    const matchesSearch =
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testName.toLowerCase().includes(searchTerm.toLowerCase())
  

    return matchesSearch 
  })

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


  return (
    <div className="space-y-6 p-6 bg-snow-white min-h-screen">
   
         <PendingHeader/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2 space-y-4">

     <PendingReportFilter searchQuery={searchTerm} setSearchQuery={setSearchTerm}/>

          <div className="space-y-3">
            {filteredReports.map((report) => (
              <Card
                key={report.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-0 shadow-md bg-cool-gray/10 ${
                  selectedReport?.id === report.id ? "ring-2 ring-soft-blue shadow-lg" : ""
                }`}
                onClick={() => {
                  setSelectedReport(report)
                  if (uploadSectionRef.current) {
                    uploadSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                }}
              >
                <CardContent className="p-4 py-1">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3 text-soft-coral">
                        {getStatusIcon(report.status)}
                        <div>
                          <h3 className="font-bold text-soft-coral text-lg">{report.patientName}</h3>
                          <p className="text-gray-600 font-medium">{report.testName}</p>
                        
                          <Badge variant="outline" className="text-xs mt-1 capitalize bg-soft-blue text-snow-white">
                            {report.type && report.type.replace("-", " ")}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 font-medium">
                          {new Date(report.scheduledDate).toLocaleDateString()} at {report.scheduledTime}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs capitalize font-medium bg-soft-coral text-snow-white"
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
                          if (uploadSectionRef.current) {
                            uploadSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
                          }
                        }}
                        className="hover:bg-blue-50"
                      >
                        <FileText className="w-4 h-4 text-soft-blue" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sticky Upload Section */}
        <div ref={uploadSectionRef} className="space-y-4 lg:sticky lg:top-6 ">
          <Card className="border-0 shadow-lg bg-white/60">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center space-x-2 text-xl">
                {selectedReport && isFileUploadOnly(selectedReport.type) ? (
                  <Upload className="w-6 h-6 text-dark-slate-gray" />
                ) : (
                  <Edit3 className="w-6 h-6 text-dark-slate-gray" />
                )}
                <span className="text-soft-coral">
                  {selectedReport && isFileUploadOnly(selectedReport.type) ? "Upload Report" : "Enter Report Data"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedReport ? (
                <>
                 <div className="p-4 bg-cool-gray/10 rounded-xl border border-blue-200 space-y-2">
  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
    <span className="font-semibold text-dark-slate-gray w-32">Patient Name:</span>
    <span className="text-soft-blue font-medium">{selectedReport.patientName}</span>
  </div>
  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
    <span className="font-semibold text-dark-slate-gray w-32">Test Name:</span>
    <span className="text-soft-blue font-medium">{selectedReport.testName}</span>
  </div>
</div>


                  {isFileUploadOnly(selectedReport.type) ? (
                    // File upload interface for scans
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="report-file" className="text-sm font-medium text-soft-blue">
                          Upload Scan File
                        </Label>
                        <Input
                          id="report-file"
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.png,.dicom"
                          onChange={handleFileUpload}
                          className="border-gray-200 focus:border-blue-500"
                        />
                        {uploadFile && (
                          <p className="text-sm text-dark-slate-gray font-medium"> Selected: <span className="font-medium text-soft-coral"> {uploadFile.name} </span></p>
                        )}
                      </div>

                 

                      <Button
                        onClick={handleUploadSubmit}
                        disabled={!uploadFile}
                        className="w-full bg-soft-blue hover:bg-soft-blue/90  text-snow-white font-medium py-3"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Scan
                      </Button>
                    </>
                  ) : (
                    // Direct value entry interface for other report types
                    <>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="results" className="text-sm font-medium text-soft-blue">
                            Test Results *
                          </Label>
                          <Textarea
                            id="results"
                            placeholder="Enter the test results..."
                            value={reportValues.results}
                            onChange={(e) => setReportValues((prev) => ({ ...prev, results: e.target.value }))}
                            rows={3}
                            className="border-gray-200 focus:border-blue-500"
                          />
                        </div>

                    

                      
                      </div>

                      <Button
                        onClick={handleValueSubmit}
                        disabled={!reportValues.results && !reportValues.findings}
                        className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white font-medium py-3"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Submit Report Data
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-soft-blue mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-dark-slate-gray mb-2">Select a report to process</h3>
                  <p className="text-cool-gray">Choose a pending report from the list to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
