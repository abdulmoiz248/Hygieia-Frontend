// components/DashboardStats.tsx
'use client'

import { motion } from 'framer-motion'
import { Calendar, Flame, Pill, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { getHealthScore } from '@/mocks/data'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

type StatCardData = {
  id: string
  title: string
  value: string | number
  subtitle?: string
  icon: 'calendar' | 'pill' | 'flame' | 'score'
  color: string
  colorText?: string
  trend?: string
}

const iconMap = {
  calendar: Calendar,
  pill: Pill,
  flame: Flame
}

const mockGetDashboardStats = async (): Promise<StatCardData[]> => {
  return [
    {
      id: 'appointment',
      title: 'No Appointment',
      value: 'Today',
      subtitle: '10:00 AM',
      icon: 'calendar',
      color: 'soft-blue'
    },
    {
      id: 'prescriptions',
      title: 'Active Prescriptions',
      value: 3,
      subtitle: '2 due today',
      icon: 'pill',
      color: 'mint-green'
    },
    {
      id: 'calories',
      title: 'Calories Burned',
      value: 0,
      subtitle: 'Today',
      icon: 'flame',
      color: 'soft-coral'
    },
    {
      id: 'healthScore',
      title: 'Health Score',
      value: getHealthScore(),
      icon: 'score',
      color: 'purple-500',
      colorText: 'purple-600',
      trend: '+5 this week'
    }
  ]
}

export default function DashboardStats() {
  const [data, setData] = useState<StatCardData[] | null>(null)

  useEffect(() => {
    mockGetDashboardStats().then(setData)
  }, [])

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-cool-gray py-10 text-sm">
        No dashboard data to show.
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {data.map((card) => {
        const Icon = iconMap[card.icon as keyof typeof iconMap]
        return (
          <motion.div key={card.id} variants={itemVariants}>
            <Card className={`bg-gradient-to-br from-${card.color}/10 to-${card.color}/5 border-${card.color}/20`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cool-gray">{card.title}</p>
                    <p className={`text-2xl font-bold ${card.colorText ? `text-${card.colorText}` : `text-${card.color}`}`}>{card.value}</p>
                    {card.subtitle && <p className="text-xs text-cool-gray">{card.subtitle}</p>}
                    {card.trend && (
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {card.trend}
                      </p>
                    )}
                  </div>
                  {card.icon === 'score' ? (
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                      {card.value}
                    </div>
                  ) : (
                    Icon && <Icon className={`w-8 h-8 text-${card.color}`} />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
