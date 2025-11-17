"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, FileText, User, Clock, EyeIcon } from "lucide-react"
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


const handleDownload = (fileUrl: string, patientName: string) => {
  if (!fileUrl) {
    console.warn(`No file available for ${patientName}`);
    return;
  }
  const url = `/viewReport?fileUrl=${encodeURIComponent(fileUrl)}&patientName=${encodeURIComponent(patientName)}`;
  window.open(url, "_blank");
}


  return (
    <div className="space-y-6 fade-in p-6 bg-gradient-to-br from-snow-white to-mint-green/5 min-h-screen">
      {/* Header */}
      <CompletedHeader/>
      {/* Filters */}
     <PendingReportFilter searchQuery={searchTerm} setSearchQuery={setSearchTerm}/>
      {/* Completed Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
        <Card
  key={report.id}
  className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/60 hover:scale-[1.02] scale-in"
  style={{ animationDelay: `${index * 0.05}s` }}
>
  


  <CardContent className="p-6 relative z-10">
    <div className="space-y-4">
      {/* Patient Info Section */}
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-soft-blue to-soft-blue/70 shadow-lg flex-shrink-0 group-hover:shadow-xl transition-shadow duration-300">
          <User className="w-7 h-7 text-snow-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl text-dark-slate-gray mb-1 truncate group-hover:text-soft-blue transition-colors">
            {report.patientName}
          </h3>
          <div className="flex items-center gap-2 text-cool-gray/80">
            <FileText className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm font-medium truncate">{report.testName}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-cool-gray/20 to-transparent"></div>

      {/* Date Info Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 px-4 py-2.5 bg-soft-blue/5 rounded-xl border border-soft-blue/10">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-soft-blue/10">
            <Calendar className="w-4 h-4 text-soft-blue" />
          </div>
          <div>
            <p className="text-xs text-cool-gray/70 font-medium">Test Booked For</p>
            <p className="text-sm font-bold text-soft-blue">
              {new Date(report.scheduledDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Download Button */}
        <Button
          size="lg"
          onClick={() => handleDownload(report.reportFile!, report.patientName)}
          className="bg-gradient-to-r from-soft-coral to-soft-coral/80 hover:from-soft-coral/90 hover:to-soft-coral/70 text-snow-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 group/btn border-0"
        >
          <EyeIcon id={`download-${report.id}`} className="m-0 group-hover/btn:animate-pulse" />
          <span className="font-semibold">View</span>
        </Button>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-soft-blue via-mint-green to-soft-coral opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  </CardContent>
</Card>

          ))
        ) : (
          <Card className="lg:col-span-2 border-0 shadow-xl">
            <CardContent className="p-16 text-center bg-gradient-to-br from-white to-mint-green/5">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-soft-coral/20 to-mint-green/20 mx-auto mb-6 animate-pulse">
                <CheckCircle className="w-12 h-12 text-soft-coral" />
              </div>
              <h3 className="text-2xl font-bold text-dark-slate-gray mb-3">No completed reports found</h3>
              <p className="text-cool-gray/70 text-lg max-w-md mx-auto">
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
