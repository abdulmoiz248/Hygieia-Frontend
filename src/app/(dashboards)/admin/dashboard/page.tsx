"use client"

import { motion } from "framer-motion"
import { Suspense } from "react"
import AdminWelcomeSection from "@/components/admin/dashboard/AdminWelcomeSection"
import AdminStatsCards from "@/components/admin/dashboard/AdminStatsCards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, FileText, Mail } from "lucide-react"

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
        <Card className="bg-white/60 border-cool-gray/15">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Clock className="h-5 w-5" style={{ color: "var(--color-soft-blue)" }} />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-cool-gray/10 hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="w-4 h-4 text-soft-coral flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">New blog post submitted</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-cool-gray/10 hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Users className="w-4 h-4 text-mint-green flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">New user registered</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-cool-gray/10 hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Mail className="w-4 h-4 text-soft-blue flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">Customer inquiry received</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="bg-white/60 border-cool-gray/15">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Manage platform features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/blogs" className="block p-3 rounded-lg bg-gradient-to-br from-soft-blue/10 to-soft-blue/5 hover:from-soft-blue/20 hover:to-soft-blue/10 transition-all">
              <p className="font-semibold text-soft-blue flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Manage Blogs
              </p>
              <p className="text-xs text-cool-gray mt-1">Review and approve content</p>
            </a>
            <a href="/admin/users" className="block p-3 rounded-lg bg-gradient-to-br from-mint-green/10 to-mint-green/5 hover:from-mint-green/20 hover:to-mint-green/10 transition-all">
              <p className="font-semibold text-mint-green flex items-center gap-2">
                <Users className="w-4 h-4" />
                Manage Users
              </p>
              <p className="text-xs text-cool-gray mt-1">View and manage users</p>
            </a>
            <a href="/admin/emails" className="block p-3 rounded-lg bg-gradient-to-br from-soft-coral/10 to-soft-coral/5 hover:from-soft-coral/20 hover:to-soft-coral/10 transition-all">
              <p className="font-semibold text-soft-coral flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Review Emails
              </p>
              <p className="text-xs text-cool-gray mt-1">Check pending inquiries</p>
            </a>
            <a href="/admin/faq" className="block p-3 rounded-lg bg-gradient-to-br from-cool-gray/10 to-cool-gray/5 hover:from-cool-gray/20 hover:to-cool-gray/10 transition-all">
              <p className="font-semibold text-cool-gray flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Manage FAQs
              </p>
              <p className="text-xs text-muted-foreground mt-1">Update help resources</p>
            </a>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-soft-blue/10 to-soft-blue/5 border-soft-blue/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-cool-gray font-medium">Blog Management</p>
              <p className="text-3xl font-bold text-soft-blue mt-2">Review & Approve</p>
              <p className="text-xs text-cool-gray mt-3">Keep quality content high</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-mint-green/10 to-mint-green/5 border-mint-green/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-cool-gray font-medium">User Management</p>
              <p className="text-3xl font-bold text-mint-green mt-2">Monitor Users</p>
              <p className="text-xs text-cool-gray mt-3">Track platform engagement</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-soft-coral/10 to-soft-coral/5 border-soft-coral/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-cool-gray font-medium">Communications</p>
              <p className="text-3xl font-bold text-soft-coral mt-2">Handle Inquiries</p>
              <p className="text-xs text-cool-gray mt-3">Respond to messages</p>
            </div>
          </CardContent>
        </Card>
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
