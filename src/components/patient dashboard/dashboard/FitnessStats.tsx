'use client'

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import GaugeComponent from 'react-gauge-component'
import { useState, useEffect } from 'react'
import { usePatientFitnessStore } from '@/store/patient/fitness-store'
import { usePatientProfileStore } from '@/store/patient/profile-store'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const FALLBACK_TARGETS: Record<string, number> = {
  steps: 10000,
  water: 2.5,
  sleep: 8,
}

const TARGET_KEY_ALIASES: Record<string, string[]> = {
  steps: ['steps', 'dailySteps', 'step_target', 'stepsTarget'],
  water: ['water', 'dailyWater', 'water_target', 'waterTarget'],
  sleep: ['sleep', 'sleepTarget', 'sleep_target', 'dailySleep'],
}

function resolveTarget(
  goalType: string,
  goalFallback: number,
  profileLimit: Record<string, unknown> | null | undefined
): number {
  if (profileLimit) {
    const aliases = TARGET_KEY_ALIASES[goalType] ?? [goalType]
    for (const key of aliases) {
      const val = Number(profileLimit[key])
      if (!isNaN(val) && val > 0) return val
    }
  }
  // Use our canonical fallback, not goal.target, so units are always correct
  return FALLBACK_TARGETS[goalType] ?? goalFallback
}

const themeColors = [
  'var(--color-soft-blue)',
  'var(--color-soft-coral)',
  'var(--color-mint-green)',
  'var(--color-cool-gray)',
  'var(--color-dark-slate-gray)',
]

export default function FitnessProgressGauges() {
  const fitness = usePatientFitnessStore()
  const profileLimit = usePatientProfileStore(
    (store) => store.profile.limit as Record<string, unknown> | null | undefined
  )

  const [animatedPercents, setAnimatedPercents] = useState<number[]>(
    fitness.goals.map(() => 0)
  )

  useEffect(() => {
    // Reset animation whenever goals change (e.g. after fetchFitness resolves)
    setAnimatedPercents(fitness.goals.map(() => 0))

    let animationFrameId: number
    const duration = 1000
    const startTime = performance.now()

    const animate = (time: number) => {
      const elapsed = time - startTime
      // Ease-out quad for a snappier feel
      const raw = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - raw) * (1 - raw)

      const updatedPercents = fitness.goals.map((goal) => {
        const targetValue = resolveTarget(goal.type, goal.target, profileLimit)
        const targetPercent = targetValue > 0 ? (goal.current / targetValue) * 100 : 0
        // Cap at 100 so the gauge never over-shoots
        return Math.min(targetPercent, 100) * eased
      })

      setAnimatedPercents(updatedPercents)

      if (raw < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [fitness.goals, profileLimit])

  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-medium text-dark-slate-gray/80">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-soft-coral opacity-80" />
            Today&apos;s Fitness Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fitness.loading ? (
            <div className="flex items-center justify-center py-10 text-sm text-dark-slate-gray/50">
              Loading fitness data…
            </div>
          ) : fitness.goals.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-dark-slate-gray/50">
              No fitness data logged today.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {fitness.goals.map((goal, index) => {
                const percent = animatedPercents[index] ?? 0
                const goalColor = themeColors[index % themeColors.length]
                const targetValue = resolveTarget(goal.type, goal.target, profileLimit)
                // Show actual current value, not back-calculated from animated percent
                const displayCurrent = Math.min(goal.current, targetValue)

                return (
                  <div
                    key={goal.id}
                    className="flex flex-col items-center p-3 sm:p-4 bg-cool-gray/10 backdrop-blur-md border border-white/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <GaugeComponent
                      value={percent}
                      maxValue={100}
                      type="semicircle"
                      arc={{
                        colorArray: ['var(--color-cool-gray)', goalColor],
                        subArcs: [
                          { length: percent, color: goalColor },
                          { length: Math.max(100 - percent, 0), color: 'var(--color-cool-gray)' },
                        ],
                        padding: 0.02,
                        width: 0.15,
                      }}
                      pointer={{ elastic: true, color: goalColor }}
                      labels={{
                        valueLabel: {
                          style: {
                            fontSize: '0.75rem',
                            fill: 'rgba(0,0,0,0.7)',
                            fontWeight: '400',
                          },
                          // FIX: display real current value directly (not back-calculated from
                          // animated percent) so the label always shows the true logged value.
                          formatTextValue: () =>
                            `${displayCurrent} / ${targetValue} ${goal.unit}`,
                        },
                        tickLabels: { type: 'outer', ticks: [] },
                      }}
                    />
                    <span className="mt-2 text-xs sm:text-sm font-normal capitalize text-dark-slate-gray/70">
                      {goal.type}
                    </span>
                    {/* Percentage badge below label */}
                    <span
                      className="mt-1 text-xs font-semibold"
                      style={{ color: goalColor }}
                    >
                      {Math.round((goal.current / targetValue) * 100)}%
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}