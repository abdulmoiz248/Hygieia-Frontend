'use client'

import { motion } from 'framer-motion'
import { TestTube, FileCheck, Clock, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import CountUp from '@/blocks/TextAnimations/CountUp/CountUp'
import { useLabTechnicianDashboard } from '@/hooks/useLabTechnicianDashboard'
import Loader from '@/components/loader/loader'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function KeyMetrics({ techId }: { techId: string }) {
  const { data, isLoading, isError } = useLabTechnicianDashboard(techId)

  
  const analytics = data?.analytics ?? { totalTests: 0, completedTests: 0, pendingReports: 0, todayTests: 0 }
  const currentPendingCount = data?.pendingReports.length ?? 0
  const currentCompletedCount = data?.completedReports.length ?? 0
  const completionRate = analytics.totalTests > 0 
      ? Math.round((currentCompletedCount / analytics.totalTests) * 100) 
      : 0

  if (isLoading){
         return (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader />
            </div>
          )
      }
  if (isError) return <p className="p-6 text-red-500">Failed to load metrics</p>

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <motion.div variants={itemVariants} className="h-full">
        <Card className="h-full flex flex-col justify-between bg-gradient-to-br from-soft-blue/10 to-soft-blue/5 border-soft-blue/20">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cool-gray">Total Tests</p>
                <p className="text-2xl font-bold text-soft-blue">
                  <CountUp from={0} to={analytics.totalTests} separator="," direction="up" duration={1} className="text-soft-blue" />
                </p>
                <p className="text-xs text-cool-gray">All time</p>
              </div>
              <TestTube className="w-8 h-8 text-soft-blue" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="h-full">
        <Card className="h-full flex flex-col justify-between bg-gradient-to-br from-mint-green/10 to-mint-green/5 border-mint-green/20">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cool-gray">Completed</p>
                <p className="text-2xl font-bold text-mint-green">
                  <CountUp from={0} to={currentCompletedCount} separator="," direction="up" duration={1} className="text-mint-green" />
                </p>
                <div className="flex items-center mt-2">
                  <Progress value={completionRate} className="flex-1 h-2" />
                  <span className="text-xs text-mint-green ml-2 font-medium">{completionRate}%</span>
                </div>
              </div>
              <FileCheck className="w-8 h-8 text-mint-green" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="h-full">
        <Card className="h-full flex flex-col justify-between bg-gradient-to-br from-soft-coral/10 to-soft-coral/5 border-soft-coral/20">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cool-gray">Pending Reports</p>
                <p className="text-2xl font-bold text-soft-coral">
                  <CountUp from={0} to={currentPendingCount} separator="," direction="up" duration={1} className="text-soft-coral" />
                </p>
                {currentPendingCount !== 0 && (
                  <Badge variant="outline" className="mt-1 text-xs border-soft-coral/30 text-soft-coral">
                    Requires attention
                  </Badge>
                )}
              </div>
              <Clock className="w-8 h-8 text-soft-coral" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="h-full">
        <Card className="h-full flex flex-col justify-between bg-gradient-to-br from-cool-gray/10 to-cool-gray/5 border-cool-gray/20">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cool-gray">Today&apos;s Tests</p>
                <p className="text-2xl font-bold text-cool-gray">
                  <CountUp from={0} to={analytics.todayTests} separator="," direction="up" duration={1} className="text-cool-gray" />
                </p>
              </div>
              <Calendar className="w-8 h-8 text-cool-gray" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
