"use client"

import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import {
  addRecord,
  deleteRecord,
  setTypeFilter,
  setSearchQuery,
  setViewingRecord,
  setShowUpload,
  fetchMedicalRecords,
  
} from "@/types/patient/medicalRecordsSlice"
import { MedicalRecordsHeader } from "@/components/patient dashboard/medical-records/MedicalRecordsHeader"
import { MedicalRecordsFilters } from "@/components/patient dashboard/medical-records/MedicalRecordsFilters"
import { MedicalRecordsGrid } from "@/components/patient dashboard/medical-records/MedicalRecordsGrid"
import { MedicalRecordViewerModal } from "@/components/patient dashboard/medical-records/MedicalRecordViewerModal"
import { LabTestsSection } from "@/components/patient dashboard/medical-records/LabTestsSection"

import { useEffect } from "react"




const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MedicalRecordsPage() {
  const dispatch = useAppDispatch()
  const { records, typeFilter, searchQuery, viewingRecord, showUpload } = useAppSelector(
    (state) => state.medicalRecords,
  )


 
  useEffect(() => {
    dispatch(fetchMedicalRecords())
  }, [dispatch])

  const onUploadRecord = (record: any) => {
    dispatch(addRecord(record))
  }

  const onDeleteRecord = (recordId: string) => {
    dispatch(deleteRecord(recordId))
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
      {/* Medical Records Section */}
      <section className="space-y-6 pt-2">

        <motion.div variants={itemVariants}>
          <MedicalRecordsHeader
            showUpload={showUpload}
            setShowUpload={(show) => dispatch(setShowUpload(show))}
            onUploadRecord={onUploadRecord}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <MedicalRecordsFilters
            searchQuery={searchQuery}
            setSearchQuery={(query) => dispatch(setSearchQuery(query))}
            typeFilter={typeFilter}
            setTypeFilter={(filter) => dispatch(setTypeFilter(filter))}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <MedicalRecordsGrid
            filteredRecords={filteredRecords}
            setViewingRecord={(record) => dispatch(setViewingRecord(record))}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
            onShowUpload={() => dispatch(setShowUpload(true))}
          />
        </motion.div>

        <MedicalRecordViewerModal
          viewingRecord={viewingRecord}
          setViewingRecord={(record) => dispatch(setViewingRecord(record))}
          getTypeIcon={getTypeIcon}
          onDeleteRecord={onDeleteRecord}
        />
      </section>

      {/* Lab Tests Section */}
      <section className="space-y-6">
     
      

        <motion.div variants={itemVariants}>
          <LabTestsSection />
        </motion.div>
      </section>
    </motion.div>
  )
}
