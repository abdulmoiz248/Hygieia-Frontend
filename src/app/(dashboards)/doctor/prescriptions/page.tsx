"use client"

import { useState } from "react"
import { PrescriptionCard } from "@/components/doctor-portal/prescriptions/PrescriptionCard"
import { useDoctorPrescriptionStore, Prescription } from "@/store/doctor/doctor-prescription-store"
import useDoctorStore from "@/store/doctor/doctor-store"
import { motion, Variants } from "framer-motion"
import PrescriptionStats from "@/components/doctor-portal/prescriptions/PrescriptionStatsCard"
import { PrescriptionFilters } from "@/components/doctor-portal/prescriptions/PrescriptionFilters"

export default function PrescriptionManager() {
  const doctor = useDoctorStore().profile

  const doctorId = doctor?.id || ""
  const {
    prescriptions,
    updatePrescriptionBackend,
  } = useDoctorPrescriptionStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleUpdatePrescription = (updatedPrescription: Prescription) => {
    updatePrescriptionBackend(updatedPrescription.id!, updatedPrescription, doctorId)
  }

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch = searchTerm
      ? prescription.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
      : true

    if (filterStatus === "all") return matchesSearch

    const now = new Date()
    const prescriptionEnd = prescription.followUpDate ? new Date(prescription.followUpDate) : null
    const isActive = prescriptionEnd ? prescriptionEnd > now : false
    const isCompleted = prescriptionEnd ? prescriptionEnd <= now : false

    if (filterStatus === "active") return matchesSearch && isActive
    if (filterStatus === "completed") return matchesSearch && isCompleted

    return matchesSearch
  })

  const getStats = () => {
    const total = prescriptions.length
    const active = prescriptions.filter(
      (p) => p.followUpDate && new Date(p.followUpDate) > new Date()
    ).length
    const completed = total - active

    return { total, active, completed }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-snow-white to-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-soft-coral">Prescription Manager</h1>
            <p className="text-cool-gray">
              Monitor and manage all issued prescriptions, track patient follow-ups, and make adjustments as needed.
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <PrescriptionStats
          total={stats?.total ?? 0}
          active={stats?.active ?? 0}
          completed={stats?.completed ?? 0}
        />

        {/* Controls */}
        <PrescriptionFilters
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          statusFilter={filterStatus}
          setStatusFilter={setFilterStatus}
        />

        {/* Prescriptions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPrescriptions.length > 0 ? (
            filteredPrescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
                onUpdate={handleUpdatePrescription}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 bg-muted/40 rounded-2xl shadow-sm border border-dashed border-muted-foreground/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-soft-coral mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xl font-medium text-soft-coral mb-2">No prescriptions found</p>
              <p className="text-sm text-muted-foreground/70 mb-6 text-center max-w-sm">
                We couldn&apos;t match any prescriptions with your current criteria. Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
