"use client"

import type React from "react"
import { useState, useCallback,  useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Clock, AlertTriangle,  CheckCircle, Edit3, ChevronDown, ChevronUp } from "lucide-react"
import { useLabStore } from "@/store/lab-tech/labTech"
import type { PendingReport } from "@/types/lab-tech/lab-reports"
import PendingHeader from "./PendingHeader"
import { PendingReportFilter } from "./PendingReportsFilter"

export function PendingReports() {
  const { pendingReports, uploadReport } = useLabStore()
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

  const [collapsedRows, setCollapsedRows] = useState<Set<number>>(new Set())

  const toggleRowCollapse = (index: number) => {
    setCollapsedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }


  const uploadSectionRef = useRef<HTMLDivElement | null>(null)

  


  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadFile(file)
    }
  }, [])

const handleValueSubmit = async(payload?: string) => {
  if (selectedReport && (reportValues.results.length > 0 || reportValues.findings)) {
    setIsUploading(true)
    const reportData = JSON.stringify({
      ...reportValues,
      results: payload ?? JSON.stringify(reportValues.results),
    })
    const blob = new Blob([reportData], { type: "application/json" })
    const file = new File([blob], `${selectedReport.testName}-results.json`, { type: "application/json" })

    await uploadReport(selectedReport.id, file, reportValues, selectedReport.type)
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

  const handleUploadSubmit = async() => {
    if (selectedReport && uploadFile) {
       setIsUploading(true)
      await uploadReport(selectedReport.id, uploadFile, undefined, selectedReport.type)
      setSelectedReport(null)
      setUploadFile(null)
       setIsUploading(false)
      const fileInput = document.getElementById("report-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    }
  }

  const isFileUploadOnly = (reportType: string) => {
    
    return reportType === "scan"
  }

  const filteredReports = pendingReports
    .filter((report) => {
      const matchesSearch =
        report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.testName.toLowerCase().includes(searchTerm.toLowerCase())
    

      return matchesSearch 
    })
    .sort((a, b) => {
      // Sort by date and time - earliest appointments first
      const dateA = new Date(a.scheduledDate)
      const dateB = new Date(b.scheduledDate)
      
      // Parse time (assuming format like "10:00 AM" or "14:00")
      const timeA = a.scheduledTime
      const timeB = b.scheduledTime
      
      // Combine date and time for comparison
      const dateTimeA = new Date(`${dateA.toDateString()} ${timeA}`)
      const dateTimeB = new Date(`${dateB.toDateString()} ${timeB}`)
      
      return dateTimeA.getTime() - dateTimeB.getTime()
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
                  {new Date(report.scheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at {report.scheduledTime}
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
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-soft-blue border-solid mb-4"></div>
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
                  Upload Scan Image 
                </Label>
                <Input
                  id="report-file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
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
  <Label className="text-sm font-medium text-soft-blue">Test Results *</Label>

  <div className="space-y-3">
    {(reportValues.results || []).map((row: any, index: number) => (
      <div
        key={index}
        className="rounded-xl border p-4 bg-white shadow-sm flex flex-col gap-3"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-soft-coral">Test {index + 1}</span>
          <button
            type="button"
            onClick={() => toggleRowCollapse(index)}
            className="text-soft-blue hover:text-soft-blue/80 transition-colors"
          >
            {collapsedRows.has(index) ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        </div>

        {!collapsedRows.has(index) && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Test Name"
                value={row.test}
                onChange={(e) => {
                  const newRows = [...reportValues.results]
                  newRows[index].test = e.target.value
                  setReportValues((prev:any) => ({ ...prev, results: newRows }))
                }}
                className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-soft-blue w-full"
              />

              <input
                type="text"
                placeholder="Reference Range"
                value={row.reference}
                onChange={(e) => {
                  const newRows = [...reportValues.results]
                  newRows[index].reference = e.target.value
                  setReportValues((prev:any) => ({ ...prev, results: newRows }))
                }}
                className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-soft-blue w-full"
              />

              <input
                type="text"
                placeholder="Unit"
                value={row.unit}
                onChange={(e) => {
                  const newRows = [...reportValues.results]
                  newRows[index].unit = e.target.value
                  setReportValues((prev:any) => ({ ...prev, results: newRows }))
                }}
                className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-soft-blue w-full"
              />

              <input
                type="text"
                placeholder="Result"
                value={row.result}
                onChange={(e) => {
                  const newRows = [...reportValues.results]
                  newRows[index].result = e.target.value
                  setReportValues((prev:any) => ({ ...prev, results: newRows }))
                }}
                className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-soft-blue w-full"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const newRows = reportValues.results.filter((_: any, i: number) => i !== index)
                  setReportValues((prev:any) => ({ ...prev, results: newRows }))
                  // Remove from collapsed set if it was collapsed
                  setCollapsedRows(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(index)
                    return newSet
                  })
                }}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          </>
        )}
      </div>
    ))}

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
      + Add Test
    </button>
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
