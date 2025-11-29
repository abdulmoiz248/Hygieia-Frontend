"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, FileText, User, EyeIcon, MapPin, Home, Clock } from "lucide-react"
import { useLabStore } from "@/store/lab-tech/labTech"
import CompletedHeader from "./CompletedHeader"
import { CompletedReportsFilter } from "./CompletedReportsFilter"


export function CompletedReports() {
  const { completedReports } = useLabStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredReports = completedReports.filter((report) => {
    const matchesSearch =
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testName.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Type filter
    const matchesType = typeFilter === "all" || report.type === typeFilter

    // Location filter
    const matchesLocation = 
      locationFilter === "all" ||
      (locationFilter === "home" && report.location?.toLowerCase().includes("home")) ||
      (locationFilter === "lab" && !report.location?.toLowerCase().includes("home"))

    // Date filter (based on uploadedAt)
    let matchesDate = true
    if (dateFilter !== "all" && report.uploadedAt) {
      const reportDate = new Date(report.uploadedAt)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      switch (dateFilter) {
        case "today":
          matchesDate = reportDate.toDateString() === today.toDateString()
          break
        case "yesterday":
          matchesDate = reportDate.toDateString() === yesterday.toDateString()
          break
        case "this-week":
          const weekStart = new Date(today)
          weekStart.setDate(weekStart.getDate() - 7)
          matchesDate = reportDate >= weekStart && reportDate <= today
          break
        case "this-month":
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
          matchesDate = reportDate >= monthStart && reportDate <= today
          break
      }
    }

    return matchesSearch && matchesType && matchesLocation && matchesDate
  })
  .sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime()
      case "oldest":
        return new Date(a.uploadedAt || 0).getTime() - new Date(b.uploadedAt || 0).getTime()
      case "name-asc":
        return a.patientName.localeCompare(b.patientName)
      case "name-desc":
        return b.patientName.localeCompare(a.patientName)
      default:
        return 0
    }
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
     <CompletedReportsFilter 
        searchQuery={searchTerm} 
        setSearchQuery={setSearchTerm}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      {/* Completed Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
            <Card
              key={report.id}
              className="group relative overflow-visible transition-all duration-300 border-0 shadow-md bg-white/10 hover:shadow-2xl hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-5">
                {/* Top Badge Section */}
                <div className="flex items-start justify-between mb-4">
                  <Badge 
                    className={`px-3 py-1.5 font-semibold text-xs ${
                      report.type === 'scan' 
                        ? 'bg-soft-blue/15 text-soft-blue border-soft-blue/30' 
                        : report.type === 'report'
                        ? 'bg-soft-coral/15 text-soft-coral border-soft-coral/30'
                        : 'bg-mint-green/15 text-mint-green border-mint-green/30'
                    }`}
                  >
                    {report.type?.replace('-', ' ').toUpperCase()}
                  </Badge>
                  
                
                </div>

                {/* Patient Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-soft-blue to-mint-green flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-snow-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-dark-slate-gray truncate mb-0.5">
                        {report.patientName}
                      </h3>
                      <p className="text-xs text-cool-gray/80 truncate flex items-center gap-1.5">
                        <FileText className="w-3 h-3 flex-shrink-0" />
                        {report.testName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-cool-gray/20 to-transparent mb-4" />

                {/* Details Section */}
                <div className="space-y-2.5 mb-4">
                  {/* Scheduled Date */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-peach/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-peach" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-cool-gray/60 mb-0.5">Scheduled</p>
                      <p className="text-sm font-semibold text-dark-slate-gray truncate">
                        {new Date(report.scheduledDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  {report.location && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-mint-green/10 flex items-center justify-center flex-shrink-0">
                        {report.location.toLowerCase().includes('home') ? (
                          <Home className="w-4 h-4 text-mint-green" />
                        ) : (
                          <MapPin className="w-4 h-4 text-mint-green" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-cool-gray/60 mb-0.5">Location</p>
                        <p className="text-sm font-semibold text-dark-slate-gray truncate">
                          {report.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Completed Time */}
                  {report.uploadedAt && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-soft-coral/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-soft-coral" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-cool-gray/60 mb-0.5">Completed</p>
                        <p className="text-sm font-semibold text-dark-slate-gray truncate">
                          {new Date(report.uploadedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleDownload(report.reportFile!, report.patientName)}
                  className="w-full bg-gradient-to-r from-soft-blue via-soft-blue to-mint-green hover:from-soft-blue/90 hover:via-soft-blue/90 hover:to-mint-green/90 text-snow-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl py-2.5 font-semibold text-sm group/btn border-0"
                >
                  <EyeIcon className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  View Report
                </Button>

                
            </CardContent>
            </Card>
          ))
        ) : (
          <Card className="md:col-span-2 lg:col-span-3 border-0 shadow-xl">
            <CardContent className="p-16 text-center bg-gradient-to-br from-white to-mint-green/5">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-soft-coral/20 to-mint-green/20 mx-auto mb-6 animate-pulse">
                <CheckCircle className="w-12 h-12 text-soft-coral" />
              </div>
              <h3 className="text-2xl font-bold text-dark-slate-gray mb-3">No completed reports found</h3>
              <p className="text-cool-gray/70 text-lg max-w-md mx-auto">
                {searchTerm || dateFilter !== "all" || locationFilter !== "all" || typeFilter !== "all"
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
