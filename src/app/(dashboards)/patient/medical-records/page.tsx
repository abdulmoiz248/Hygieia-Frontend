"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Upload, Download, Eye, Calendar, User, Filter, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { mockMedicalRecords } from "@/mocks/data"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MedicalRecordsPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUpload, setShowUpload] = useState(false)
  const [viewingRecord, setViewingRecord] = useState<(typeof mockMedicalRecords)[0] | null>(null)

  const filteredRecords = mockMedicalRecords.filter((record) => {
    const matchesType = typeFilter === "all" || record.type === typeFilter
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lab-result":
        return "bg-soft-blue text-white"
      case "prescription":
        return "bg-mint-green text-white"
      case "scan":
        return "bg-soft-coral text-white"
      case "report":
        return "bg-purple-600 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lab-result":
        return "🧪"
      case "prescription":
        return "💊"
      case "scan":
        return "🔍"
      case "report":
        return "📋"
      default:
        return "📄"
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-slate-gray">Medical Records</h1>
          <p className="text-cool-gray">Manage and view your medical documents</p>
        </div>

        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogTrigger asChild>
            <Button className="bg-soft-blue hover:bg-soft-blue/90">
              <Upload className="w-4 h-4 mr-2" />
              Upload Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Medical Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Record Title</label>
                <Input placeholder="e.g., Blood Test Results" />
              </div>
              <div>
                <label className="text-sm font-medium">Record Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab-result">Lab Result</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="scan">Scan/X-Ray</SelectItem>
                    <SelectItem value="report">Medical Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Doctor Name</label>
                <Input placeholder="e.g., Dr. Smith" />
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-cool-gray mx-auto mb-4" />
                <p className="text-cool-gray">Drag and drop your file here, or click to browse</p>
                <p className="text-xs text-cool-gray mt-2">Supports PDF, JPG, PNG (Max 10MB)</p>
              </div>
              <Button className="w-full bg-soft-blue hover:bg-soft-blue/90">Upload Record</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lab-result">Lab Results</SelectItem>
                  <SelectItem value="prescription">Prescriptions</SelectItem>
                  <SelectItem value="scan">Scans/X-Rays</SelectItem>
                  <SelectItem value="report">Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Records Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => (
            <motion.div key={record.id} whileHover={{ scale: 1.02 }} className="group cursor-pointer">
              <Card className="h-full hover:shadow-lg transition-all">
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                      {getTypeIcon(record.type)}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={getTypeColor(record.type)}>{record.type.replace("-", " ")}</Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setViewingRecord(record)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-dark-slate-gray line-clamp-2">{record.title}</h3>

                    <div className="space-y-2 text-sm text-cool-gray">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {record.date}
                      </div>
                      {record.doctorName && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {record.doctorName}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setViewingRecord(record)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-cool-gray mx-auto mb-4" />
            <h3 className="text-lg font-medium text-dark-slate-gray mb-2">No records found</h3>
            <p className="text-cool-gray mb-4">Upload your first medical record to get started</p>
            <Button onClick={() => setShowUpload(true)} className="bg-soft-blue hover:bg-soft-blue/90">
              <Upload className="w-4 h-4 mr-2" />
              Upload Record
            </Button>
          </div>
        )}
      </motion.div>

      {/* Record Viewer Modal */}
      <Dialog open={!!viewingRecord} onOpenChange={() => setViewingRecord(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          {viewingRecord && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-3">
                    <div className="text-3xl">{getTypeIcon(viewingRecord.type)}</div>
                    <div>
                      <h2 className="text-xl font-semibold">{viewingRecord.title}</h2>
                      <p className="text-cool-gray font-normal">
                        {viewingRecord.doctorName} • {viewingRecord.date}
                      </p>
                    </div>
                  </DialogTitle>
                  <Button variant="ghost" size="icon" onClick={() => setViewingRecord(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-hidden">
                {/* Document Viewer */}
                <div className="h-[60vh] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">{getTypeIcon(viewingRecord.type)}</div>
                    <h3 className="text-lg font-medium text-dark-slate-gray mb-2">Document Preview</h3>
                    <p className="text-cool-gray mb-4">
                      This is a preview of your {viewingRecord.type.replace("-", " ")}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button className="bg-soft-blue hover:bg-soft-blue/90">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline">Print</Button>
                    </div>
                  </div>
                </div>

                {/* Document Info */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {viewingRecord.type.replace("-", " ")}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {viewingRecord.date}
                    </div>
                    {viewingRecord.doctorName && (
                      <div>
                        <span className="font-medium">Doctor:</span> {viewingRecord.doctorName}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">File Size:</span> 2.4 MB
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
