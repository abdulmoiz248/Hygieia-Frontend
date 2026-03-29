'use client'

import { motion } from 'framer-motion'
import { Users, FileText, BookOpen, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import CountUp from '@/blocks/TextAnimations/CountUp/CountUp'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

type StatCardData = {
  id: string
  title: string
  value: string | number
  subtitle?: string
  icon: 'users' | 'blogs' | 'cvs' | 'faqs'
  color: 'soft-blue' | 'mint-green' | 'soft-coral' | 'cool-gray'
  colorText?: string
  trend?: string
}

const iconMap = {
  users: Users,
  blogs: FileText,
  cvs:  Mail,
  faqs: BookOpen,
}

const colorClasses = {
  'soft-blue': {
    bg: 'from-soft-blue/10 to-soft-blue/5 border-soft-blue/20',
    text: 'text-soft-blue',
  },
  'mint-green': {
    bg: 'from-mint-green/10 to-mint-green/5 border-mint-green/20',
    text: 'text-mint-green',
  },
  'soft-coral': {
    bg: 'from-soft-coral/10 to-soft-coral/5 border-soft-coral/20',
    text: 'text-soft-coral',
  },
  'cool-gray': {
    bg: 'from-cool-gray/10 to-cool-gray/5 border-cool-gray/20',
    text: 'text-cool-gray',
  },
}

export default function AdminStatsCards() {
  const [stats, setStats] = useState<StatCardData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:4000/admin/dashboard', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!response.ok) {
          console.warn('Failed to fetch admin stats, using default values')
          setDefaultStats()
          return
        }

        const data = await response.json()

        setStats([
          {
            id: 'users',
            title: 'Total Users',
            value: data.totalUsers || 0,
            icon: 'users',
            color: 'soft-blue',
          },
          {
            id: 'blogs',
            title: 'Total Blogs',
            value: data.totalBlogs || 0,
            icon: 'blogs',
            color: 'mint-green',
          },
          {
            id: 'cvs',
            title: 'Pending CVs',
            value: data.pendingCVs ?? data.pendingEmails ?? 0,
            icon: 'cvs',
            color: 'soft-coral',
          },
          {
            id: 'faqs',
            title: 'Total FAQs',
            value: data.totalFaqs || 0,
            icon: 'faqs',
            color: 'cool-gray',
          },
        ])
      } catch (error) {
        console.warn('Error fetching admin stats:', error)
        setDefaultStats()
      } finally {
        setLoading(false)
      }
    }

    const setDefaultStats = () => {
      setStats([
        {
          id: 'users',
          title: 'Total Users',
          value: 0,
          icon: 'users',
          color: 'soft-blue',
        },
        {
          id: 'blogs',
          title: 'Total Blogs',
          value: 0,
          icon: 'blogs',
          color: 'mint-green',
        },
        {
          id: 'cvs',
          title: 'Pending CVs',
          value: 0,
          icon: 'cvs',
          color: 'soft-coral',
        },
        {
          id: 'faqs',
          title: 'Total FAQs',
          value: 0,
          icon: 'faqs',
          color: 'cool-gray',
        },
      ])
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
        ))}
      </div>
    )
  }

  if (!stats || stats.length === 0) {
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
      {stats.map((card) => {
        const Icon = iconMap[card.icon]
        const colors = colorClasses[card.color]

        return (
          <motion.div key={card.id} variants={itemVariants} className="h-full">
            <Card className={`h-full flex flex-col justify-between bg-gradient-to-br ${colors.bg}`}>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cool-gray">{card.title}</p>

                    <p className={`text-2xl font-bold ${colors.text}`}>
                      {typeof card.value === 'number' ? (
                        <CountUp
                          from={0}
                          to={card.value}
                          separator=","
                          direction="up"
                          duration={1}
                          className={colors.text}
                        />
                      ) : (
                        card.value
                      )}
                    </p>

                    {card.subtitle && (
                      <p className="text-xs text-cool-gray">{card.subtitle}</p>
                    )}

                    {card.trend && (
                      <p className="text-xs text-green-600">
                        {card.trend}
                      </p>
                    )}
                  </div>

                  {Icon && <Icon className={`w-8 h-8 ${colors.text}`} />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}