"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, Search, User, Stethoscope, Calendar, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export interface MedicalRecord {
  id: string
  title: string
  type: "lab-result" | "prescription" | "scan" | "report"
  date: string
  fileUrl: string
  doctorName?: string
}

interface PendingUpload {
  id: string
  patientName: string
  patientId: string
  testType: string
  doctorReferredBy: string
  requestDate: string
  priority: "low" | "normal" | "high" | "urgent"
  status: "pending" | "uploading" | "completed"
  uploadProgress?: number
}

const pendingUploads: PendingUpload[] = [
  {
    id: "REQ001",
    patientName: "John Doe",
    patientId: "PAT001",
    testType: "Blood Test - Complete Blood Count",
    doctorReferredBy: "Dr. Sarah Johnson",
    requestDate: "2024-01-15",
    priority: "normal",
    status: "pending",
  },
  {
    id: "REQ002",
    patientName: "Jane Smith",
    patientId: "PAT002",
    testType: "X-Ray - Chest",
    doctorReferredBy: "Dr. Michael Brown",
    requestDate: "2024-01-15",
    priority: "high",
    status: "pending",
  },
  {
    id: "REQ003",
    patientName: "Mike Johnson",
    patientId: "PAT003",
    testType: "Urine Test - Routine",
    doctorReferredBy: "Dr. Emily Davis",
    requestDate: "2024-01-14",
    priority: "urgent",
    status: "pending",
  },
  {
    id: "REQ004",
    patientName: "Sarah Wilson",
    patientId: "PAT004",
    testType: "MRI - Brain Scan",
    doctorReferredBy: "Dr. Robert Lee",
    requestDate: "2024-01-14",
    priority: "normal",
    status: "pending",
  },
  {
    id: "REQ005",
    patientName: "David Brown",
    patientId: "PAT005",
    testType: "CT Scan - Abdomen",
    doctorReferredBy: "Dr. Lisa Anderson",
    requestDate: "2024-01-13",
    priority: "high",
    status: "completed",
  },
]

export default function UploadReport() {
  const [uploads, setUploads] = useState<PendingUpload[]>(pendingUploads)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFile, setSelectedFile] = useState<{ [key: string]: File | null }>({})

  const filteredUploads = uploads.filter(
    (upload) =>
      upload.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.doctorReferredBy.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleFileSelect = (uploadId: string, file: File | null) => {
    setSelectedFile((prev) => ({
      ...prev,
      [uploadId]: file,
    }))
  }

  const handleUpload = async (uploadId: string) => {
    const file = selectedFile[uploadId]
    if (!file) return

    // Update status to uploading
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === uploadId ? { ...upload, status: "uploading" as const, uploadProgress: 0 } : upload,
      ),
    )

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploads((prev) =>
        prev.map((upload) => {
          if (upload.id === uploadId && upload.status === "uploading") {
            const newProgress = (upload.uploadProgress || 0) + 10
            if (newProgress >= 100) {
              clearInterval(interval)
              return { ...upload, status: "completed" as const, uploadProgress: 100 }
            }
            return { ...upload, uploadProgress: newProgress }
          }
          return upload
        }),
      )
    }, 200)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "uploading":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-foreground">Upload Reports</h1>
        <p className="text-muted-foreground">Manage pending test reports and upload results</p>
      </div>

      {/* Search and Filters */}
      <Card className="animate-slide-up">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by patient name, ID, test type, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {uploads.filter((u) => u.priority === "urgent").length} Urgent
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {uploads.filter((u) => u.priority === "high").length} High
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                {uploads.filter((u) => u.status === "pending").length} Pending
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Uploads List */}
      <div className="space-y-4 animate-scale-in">
        {filteredUploads.map((upload, index) => (
          <Card key={upload.id} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{upload.patientName}</h3>
                    <Badge variant="outline" className="text-xs">
                      {upload.patientId}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(upload.priority)}`}>
                      {upload.priority.toUpperCase()}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(upload.status)}`}>{upload.status.toUpperCase()}</Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">Test Type</p>
                        <p className="text-muted-foreground">{upload.testType}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-secondary" />
                      <div>
                        <p className="font-medium">Referred By</p>
                        <p className="text-muted-foreground">{upload.doctorReferredBy}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      <div>
                        <p className="font-medium">Request Date</p>
                        <p className="text-muted-foreground">{new Date(upload.requestDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {upload.status === "pending" && (
                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor={`file-${upload.id}`} className="text-sm font-medium">
                        Upload Report File
                      </Label>
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          id={`file-${upload.id}`}
                          type="file"
                          onChange={(e) => handleFileSelect(upload.id, e.target.files?.[0] || null)}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="hidden"
                        />
                        <label
                          htmlFor={`file-${upload.id}`}
                          className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                        >
                          <Upload className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {selectedFile[upload.id] ? selectedFile[upload.id]?.name : "Choose file"}
                          </span>
                        </label>

                        {selectedFile[upload.id] && (
                          <Button
                            onClick={() => handleUpload(upload.id)}
                            className="transition-all duration-200 hover:scale-105"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Report
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {upload.status === "uploading" && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Uploading report...
                    </span>
                    <span>{upload.uploadProgress}%</span>
                  </div>
                  <Progress value={upload.uploadProgress || 0} className="h-2" />
                </div>
              )}

              {upload.status === "completed" && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Report uploaded successfully!</span>
                    <span className="text-sm text-green-600 ml-auto">Available for doctor review</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUploads.length === 0 && (
        <Card className="animate-scale-in">
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No pending uploads found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "All reports have been uploaded"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4 animate-slide-up">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{uploads.filter((u) => u.status === "pending").length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Upload className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{uploads.filter((u) => u.status === "uploading").length}</p>
                <p className="text-sm text-muted-foreground">Uploading</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{uploads.filter((u) => u.status === "completed").length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{uploads.filter((u) => u.priority === "urgent").length}</p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
