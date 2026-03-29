"use client"

import { motion } from "framer-motion"
import { Suspense } from "react"
import AdminWelcomeSection from "@/components/admin/dashboard/AdminWelcomeSection"
import AdminStatsCards from "@/components/admin/dashboard/AdminStatsCards"
import AdminRecentActivity from "@/components/admin/dashboard/AdminRecentActivity"
import AdminQuickActions from "@/components/admin/dashboard/AdminQuickActions"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function DashboardContent() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 lg:space-y-8 w-full"
    >
      {/* Welcome Section */}
      <AdminWelcomeSection />

      {/* Stats Cards */}
      <AdminStatsCards />

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">

        {/* Recent Activity */}
        <AdminRecentActivity />

        {/* Quick Links */}
        <AdminQuickActions />
        
      </motion.div>
    </motion.div>
  )
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 lg:space-y-8 w-full animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
