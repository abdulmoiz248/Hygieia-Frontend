'use client'

import { motion } from 'framer-motion'
import { Activity, Droplets, Moon, Flame, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import CountUp from '@/blocks/TextAnimations/CountUp/CountUp'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function HealthMetrics({ avgSteps, stepsChange, avgWater, avgSleep, avgCaloriesIntake, avgCaloriesBurned }:
    { avgSteps:number, stepsChange:string, avgWater:string, avgSleep:string, avgCaloriesIntake:number, avgCaloriesBurned:number }
) {
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
                <p className="text-sm text-cool-gray">Avg Steps</p>
                <p className="text-2xl font-bold text-soft-blue">
                  <CountUp from={0} to={avgSteps} separator="," direction="up" duration={1} className="text-soft-blue" />
                </p>
                <div className="flex items-center mt-1">
                  {Number.parseFloat(stepsChange) > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs ${Number.parseFloat(stepsChange) > 0 ? "text-green-500" : "text-red-500"}`}>
                    {stepsChange}%
                  </span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-soft-blue" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="h-full">
        <Card className="h-full flex flex-col justify-between bg-gradient-to-br from-mint-green/10 to-mint-green/5 border-mint-green/20">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cool-gray">Avg Water</p>
                <p className="text-2xl font-bold text-mint-green">
                  <CountUp from={0} to={Number(avgWater)}  duration={1} className="text-mint-green" />L
                </p>
                <Progress value={(Number.parseFloat(avgWater) / 3) * 100} className="mt-2 h-2" />
              </div>
              <Droplets className="w-8 h-8 text-mint-green" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="h-full">
        <Card className="h-full flex flex-col justify-between bg-gradient-to-br from-soft-coral/10 to-soft-coral/5 border-soft-coral/20">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cool-gray">Avg Sleep</p>
                <p className="text-2xl font-bold text-soft-coral">
                  <CountUp from={0} to={Number(avgSleep)}  duration={1} className="text-soft-coral" />h
                </p>
                <Progress value={(Number.parseFloat(avgSleep) / 9) * 100} className="mt-2 h-2" />
              </div>
              <Moon className="w-8 h-8 text-soft-coral" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="h-full">
        <Card className="h-full flex flex-col justify-between bg-gradient-to-br from-cool-gray/10 to-cool-gray/5 border-cool-gray/20">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cool-gray">Calorie Balance</p>
                <p className="text-2xl font-bold text-cool-gray">
                  {avgCaloriesIntake - avgCaloriesBurned > 0 ? "+" : ""}
                  <CountUp from={0} to={avgCaloriesIntake - avgCaloriesBurned} duration={1} className="text-cool-gray" />
                </p>
                <p className="text-xs text-cool-gray">Intake - Burned</p>
              </div>
              <Flame className="w-8 h-8 text-cool-gray" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
