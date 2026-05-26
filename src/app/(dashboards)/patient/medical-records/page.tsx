"use client"

import { motion } from "framer-motion"
import { MedicalRecordsHeader } from "@/components/patient dashboard/medical-records/MedicalRecordsHeader"
import { MedicalRecordsFilters } from "@/components/patient dashboard/medical-records/MedicalRecordsFilters"
import { MedicalRecordsGrid } from "@/components/patient dashboard/medical-records/MedicalRecordsGrid"
import { MedicalRecordViewerModal } from "@/components/patient dashboard/medical-records/MedicalRecordViewerModal"
import { LabBookingsSection } from "@/components/patient dashboard/medical-records/LabBookingSection"

import { useEffect } from "react"
import { usePatientMedicalRecordsStore } from "@/store/patient/medical-records-store"
import { useRouter } from "next/navigation"
import { ArrowRight, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MedicalRecordsPage() {
  const router = useRouter()

  const {
    records,
    typeFilter,
    searchQuery,
    viewingRecord,
    showUpload,
    setTypeFilter,
    setSearchQuery,
    setViewingRecord,
    setShowUpload,
    fetchMedicalRecords,
    deleteRecord,
  } = usePatientMedicalRecordsStore()

  useEffect(() => {
    fetchMedicalRecords()
  }, [fetchMedicalRecords])

  const onDeleteRecord = (recordId: string) => {
    deleteRecord(recordId)
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
            setShowUpload={(show) => setShowUpload(show)}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <MedicalRecordsFilters
            searchQuery={searchQuery}
            setSearchQuery={(query) => setSearchQuery(query)}
            typeFilter={typeFilter}
            setTypeFilter={(filter) => setTypeFilter(filter)}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <MedicalRecordsGrid
            filteredRecords={filteredRecords}
            setViewingRecord={(record) => setViewingRecord(record)}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
            onShowUpload={() => setShowUpload(true)}
          />
        </motion.div>

        <MedicalRecordViewerModal
          viewingRecord={viewingRecord}
          setViewingRecord={(record) => setViewingRecord(record)}
          getTypeIcon={getTypeIcon}
          onDeleteRecord={onDeleteRecord}
        />
      </section>

      {/* Book Lab Tests CTA */}
      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-soft-blue/95 via-soft-blue/90 to-mint-green/85 p-8 md:p-12 shadow-lg border border-soft-blue/20">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -left-10 bottom-0 w-32 h-32 bg-mint-green/20 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5 flex-1">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex-shrink-0">
                  <FlaskConical className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Book a Lab Test</h2>
                  <p className="text-white/80 text-sm md:text-base">
                    Browse our comprehensive catalogue of diagnostic tests and book your appointment instantly.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => router.push("/lab-tests")}
                className="shrink-0 bg-white hover:bg-white/95 text-soft-blue font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
              >
                Browse Lab Tests
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Lab Bookings Section */}
      <section className="space-y-6">
        <motion.div variants={itemVariants}>
          <LabBookingsSection />
        </motion.div>
      </section>
    </motion.div>
  )
}