'use client'

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import GaugeComponent from 'react-gauge-component'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/patient/store'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function FitnessProgressGauges() {
  const fitness = useSelector((store: RootState) => store.fitness)

  // assign colors from theme dynamically so each goal type looks different
  const themeColors = [
    'var(--color-soft-blue)',
    'var(--color-soft-coral)',
    'var(--color-mint-green)',
    'var(--color-cool-gray)',
    'var(--color-dark-slate-gray)'
  ]

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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {fitness.goals.map((goal, index) => {
              const percent = (goal.current / goal.target) * 100
              const goalColor = themeColors[index % themeColors.length]

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
                        { length: 100 - percent, color: 'var(--color-cool-gray)' }
                      ],
                      padding: 0.02,
                      width: 0.15
                    }}
                    pointer={{ elastic: true, color: goalColor }}
                    labels={{
                      valueLabel: {
                        style: {
                          fontSize: '0.75rem',
                          fill: 'rgba(0,0,0,0.7)',
                          fontWeight: '400'
                        },
                        formatTextValue: () =>
                          `${goal.current} / ${goal.target} ${goal.unit}`
                      },
                      tickLabels: { type: 'outer', ticks: [] }
                    }}
                  />

                  <span className="mt-2 text-xs sm:text-sm font-normal capitalize text-dark-slate-gray/70">
                    {goal.type}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
