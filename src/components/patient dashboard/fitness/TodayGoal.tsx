"use client"

import { motion } from "framer-motion"
import {
  Activity,
  Target,
  Droplets,
  Footprints,
  Dumbbell,
  Heart,
  BedDouble,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import FitbitConnectButton from "./FitbitConnectButton"
import { usePatientFitnessStore } from "@/store/patient/fitness-store"
import { usePatientProfileStore } from "@/store/patient/profile-store"

export default function TodayGoal() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const goals = usePatientFitnessStore((state) => state.goals)
  const targets = usePatientProfileStore((store) => store.profile.limit)

  const getIcon = (type: string) => {
    switch (type) {
      case "steps":
        return <Footprints className="w-6 h-6 text-dark-slate-gray" />
      case "water":
        return <Droplets className="w-6 h-6 text-blue-500" />
      case "exercise":
        return <Dumbbell className="w-6 h-6 text-soft-coral" />
      case "weight":
        return <Heart className="w-6 h-6 text-red-500" />
      case "sleep":
        return <BedDouble className="w-6 h-6 text-soft-coral" />
      default:
        return <Activity className="w-6 h-6 text-cool-gray" />
    }
  }

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <Card className="shadow-lg rounded-2xl bg-white/40">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl font-semibold text-dark-slate-gray">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-soft-coral" />
              Today&apos;s Goals
            </div>
            <FitbitConnectButton />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const targetValue = Number(
                (targets as Record<string, string | undefined>)[goal.type] ??
                  goal.target
              )

              const progress =
                targetValue > 0 ? Math.min((goal.current / targetValue) * 100, 100) : 0

              return (
                <motion.div
                  key={goal.id}
                  className="bg-muted/30 p-4 bg-cool-gray/10 rounded-xl shadow-sm border border-border space-y-3"
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getIcon(goal.type)}
                      <div>
                        <h3 className="font-semibold capitalize text-base text-soft-blue">
                          {goal.type}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {goal.current} /{" "}
                          <span>{targetValue}</span>{" "}
                          <span className="text-dark-slate-gray">
                            {goal.unit}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-soft-coral">
                        {Math.round(progress)}%
                      </div>
                    </div>
                  </div>

                  <Progress
                    value={progress}
                    className="h-2 rounded-full bg-muted"
                  />
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
