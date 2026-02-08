"use client"

import { motion } from "framer-motion"
import { JournalHeader } from "@/components/patient dashboard/journal/JournalHeader"
import { JournalStatistics } from "@/components/patient dashboard/journal/JournalStatistics"
import { JournalFilters } from "@/components/patient dashboard/journal/JournalFilters"
import { JournalList } from "@/components/patient dashboard/journal/JournalList"
import { usePatientProfileStore } from "@/store/patient/profile-store"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function JournalPage() {
  const profile = usePatientProfileStore((s) => s.profile)
  const patientId =
    profile?.id ?? (typeof window !== "undefined" ? localStorage.getItem("id") : null)

  if (!patientId && typeof window !== "undefined") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-cool-gray">Please log in to view your journal.</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <JournalHeader />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <JournalFilters />
          <JournalList patientId={patientId ?? undefined} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <JournalStatistics patientId={patientId ?? undefined} />
        </motion.div>
      </div>
    </motion.div>
  )
}
