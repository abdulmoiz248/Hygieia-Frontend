"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download,  FileText, Calendar, User } from "lucide-react"
import { useLabStore } from "@/store/lab-tech/labTech"
import CompletedHeader from "./CompletedHeader"
import { PendingReportFilter } from "../pending-reports/PendingReportsFilter"
import {DownloadIcon} from '@/components/ui/Download'

export function CompletedReports() {
  const { completedReports } = useLabStore()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredReports = completedReports.filter((report) => {
    const matchesSearch =
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch 
  })



  const handleDownload = (reportId: string, patientName: string) => {
    // Simulate download functionality
    console.log(`Downloading report ${reportId} for ${patientName}`)
  }

  return (
    <div className="space-y-6 fade-in p-6 bg-snow-white">
      {/* Header */}
      <CompletedHeader/>
      {/* Filters */}
     <PendingReportFilter searchQuery={searchTerm} setSearchQuery={setSearchTerm}/>
      {/* Completed Reports List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
        <Card
  key={report.id}
  className="hover:shadow-md transition-all bg-cool-gray/10 w-full sm:w-auto"
>
  <CardContent className="px-4 py-2 sm:py-1">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-soft-blue" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-1 sm:mb-2">
            <h3 className="font-semibold text-soft-coral truncate">{report.patientName}</h3>
          </div>
          <p className="text-sm text-cool-gray truncate">{report.testName}</p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>Completed: </span>
              <span className="text-soft-blue font-medium">
                {new Date(report.scheduledDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex mt-2 sm:mt-0 w-full sm:w-auto">
        <Button
          size="sm"
          onClick={() => handleDownload(report.id, report.patientName)}
          className="w-full sm:w-auto bg-soft-blue hover:bg-soft-blue/90 text-snow-white flex items-center justify-center space-x-2"
        >
          <DownloadIcon id="t-1" className="m-0" />
          <span>Download</span>
        </Button>
      </div>
    </div>
  </CardContent>
</Card>

          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center bg-white/60">
              <CheckCircle className="w-16 h-16 text-soft-coral mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No completed reports found</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your filters to see more results."
                  : "Completed reports will appear here once tests are uploaded."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      
    </div>
  )
}
