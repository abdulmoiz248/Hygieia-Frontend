"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { mockMedicalRecords } from "@/mocks/data"
import { MedicalRecordsHeader } from "@/components/patient dashboard/medical-records/MedicalRecordsHeader"
import { MedicalRecordsFilters } from "@/components/patient dashboard/medical-records/MedicalRecordsFilters"
import { MedicalRecordsGrid } from "@/components/patient dashboard/medical-records/MedicalRecordsGrid"
import { MedicalRecordViewerModal } from "@/components/patient dashboard/medical-records/MedicalRecordViewerModal"
import type { MedicalRecord } from "@/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>(mockMedicalRecords)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUpload, setShowUpload] = useState(false)
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null)

  const onUploadRecord = (record: MedicalRecord) => {
    setRecords(prev => [record, ...prev])
  }

  const onDeleteRecord = (recordId: string) => {
    setRecords(prev => prev.filter(record => record.id !== recordId))
  }

  const filteredRecords = records.filter((record) => {
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
      <motion.div variants={itemVariants}>
        <MedicalRecordsHeader showUpload={showUpload} setShowUpload={setShowUpload} onUploadRecord={onUploadRecord} />
      </motion.div>
      {/* Filters */}
      <motion.div variants={itemVariants}>
        <MedicalRecordsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />
      </motion.div>
      {/* Records Grid */}
      <motion.div variants={itemVariants}>
        <MedicalRecordsGrid
          filteredRecords={filteredRecords}
          setViewingRecord={setViewingRecord}
          getTypeIcon={getTypeIcon}
          getTypeColor={getTypeColor}
          onShowUpload={() => setShowUpload(true)}
        />
      </motion.div>
      {/* Record Viewer Modal */}
      <MedicalRecordViewerModal
        viewingRecord={viewingRecord}
        setViewingRecord={setViewingRecord}
        getTypeIcon={getTypeIcon}
        onDeleteRecord={onDeleteRecord}
      />
    </motion.div>
  )
}
