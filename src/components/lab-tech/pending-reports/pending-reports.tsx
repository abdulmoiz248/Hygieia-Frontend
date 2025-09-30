"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Clock, AlertTriangle, CheckCircle, Edit3 } from "lucide-react"
import type { PendingReport } from "@/types/lab-tech/lab-reports"
import PendingHeader from "./PendingHeader"
import { PendingReportFilter } from "./PendingReportsFilter"
import { useLabTechnicianDashboard } from "@/hooks/useLabTechnicianDashboard"
import { useUploadReport } from "@/hooks/useUploadReport"
import Loader from "@/components/loader/loader"

export function PendingReports({ techId }: { techId: string }) {
  const { data } = useLabTechnicianDashboard(techId)
  const uploadReport = useUploadReport()

  const pendingReports = data?.pendingReports ?? []

  const [selectedReport, setSelectedReport] = useState<PendingReport | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const [reportValues, setReportValues] = useState({
    results: [] as { test: string; reference: string; unit: string; result: string }[],
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

  const handleValueSubmit = async (payload?: string) => {
    if (selectedReport && (reportValues.results.length > 0 || reportValues.findings)) {
      setIsUploading(true)
      const reportData = JSON.stringify({
        ...reportValues,
        results: payload ?? JSON.stringify(reportValues.results),
      })
      const blob = new Blob([reportData], { type: "application/json" })
      const file = new File([blob], `${selectedReport.testName}-results.json`, {
        type: "application/json",
      })

      await uploadReport.mutateAsync({
        id: selectedReport.id,
        file,
        reportValues,
        type: selectedReport.type,
      })

      setSelectedReport(null)
      setIsUploading(false)
      setReportValues({
        results: [],
        findings: "",
        recommendations: "",
        normalRange: "",
        units: "",
      })
    }
  }

  const handleUploadSubmit = async () => {
    if (selectedReport && uploadFile) {
      setIsUploading(true)
      await uploadReport.mutateAsync({
        id: selectedReport.id,
        file: uploadFile,
        type: selectedReport.type,
      })
      setSelectedReport(null)
      setUploadFile(null)
      setIsUploading(false)
      const fileInput = document.getElementById("report-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    }
  }

  const isFileUploadOnly = (reportType: string) => reportType === "scan"

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
  {filteredReports.length > 0 ? (
    filteredReports.map((report) => (
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
                <Badge
                  variant="outline"
                  className="text-xs capitalize font-medium bg-mint-green text-black"
                >
                  {report.location}
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
    ))
  ) : (
   <div className="flex flex-col items-center justify-center py-16 space-y-4 text-gray-400">
  <svg
    className="w-16 h-16 text-soft-blue animate-bounce"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h7l5 5v9a2 2 0 01-2 2z"
    />
  </svg>
  <h3 className="text-lg font-semibold text-soft-blue">Great Job!</h3>
  <p className="text-gray-500 text-center max-w-xs">
    You’re all caught up! No pending reports at the moment. Keep up the good work.
  </p>
</div>

  )}
</div>

        </div>

        {/* Sticky Upload Section */}
     {/* Sticky Upload Section */}
<div ref={uploadSectionRef} className="space-y-4 lg:sticky lg:top-6">
  <Card className={`border-0 shadow-lg bg-white/60 ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
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
    <CardContent className="space-y-6 relative">
     {isUploading && (
  <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-white/30 z-20">
   <Loader/>
    <span className="text-soft-blue font-semibold">Uploading...</span>
  </div>
)}


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
                  <p className="text-sm text-dark-slate-gray font-medium">
                    Selected: <span className="font-medium text-soft-coral">{uploadFile.name}</span>
                  </p>
                )}
              </div>

              <Button
                onClick={handleUploadSubmit}
                disabled={!uploadFile || isUploading}
                className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white font-medium py-3"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Scan"}
              </Button>
            </>
          ) : (
           <>
  <div className="space-y-4">
    <div className="space-y-2">
      <Label className="text-sm font-medium text-soft-blue">
        Test Results *
      </Label>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Test</th>
              <th className="px-3 py-2 text-left">Reference Ranges</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-left">Result</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {(reportValues.results || []).map((row: any, index: number) => (
              <tr key={index} className="border-t">
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={row.test}
                    onChange={(e) => {
                      const newRows = [...reportValues.results]
                      newRows[index].test = e.target.value
                      setReportValues((prev:any) => ({ ...prev, results: newRows }))
                    }}
                    className="w-full border rounded p-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={row.reference}
                    onChange={(e) => {
                      const newRows = [...reportValues.results]
                      newRows[index].reference = e.target.value
                      setReportValues((prev:any) => ({ ...prev, results: newRows }))
                    }}
                    className="w-full border rounded p-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={row.unit}
                    onChange={(e) => {
                      const newRows = [...reportValues.results]
                      newRows[index].unit = e.target.value
                      setReportValues((prev:any) => ({ ...prev, results: newRows }))
                    }}
                    className="w-full border rounded p-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={row.result}
                    onChange={(e) => {
                      const newRows = [...reportValues.results]
                      newRows[index].result = e.target.value
                      setReportValues((prev:any) => ({ ...prev, results: newRows }))
                    }}
                    className="w-full border rounded p-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newRows = reportValues.results.filter((_: any, i: number) => i !== index)
                      setReportValues((prev:any) => ({ ...prev, results: newRows }))
                    }}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-2">
          <button
            type="button"
            onClick={() =>
              setReportValues((prev:any) => ({
                ...prev,
                results: [...(prev.results || []), { test: "", reference: "", unit: "", result: "" }],
              }))
            }
            className="text-soft-blue hover:underline text-sm"
          >
            + Add Row
          </button>
        </div>
      </div>
    </div>
  </div>

  <Button
 onClick={async()=>{await handleValueSubmit()}}
    disabled={(!reportValues.results || reportValues.results.length === 0) || isUploading}
    className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white font-medium py-3"
  >
    <Edit3 className="w-4 h-4 mr-2" />
    {isUploading ? "Uploading..." : "Submit Report Data"}
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
