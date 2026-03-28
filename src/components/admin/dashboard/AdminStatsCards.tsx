'use client'

import { motion } from 'framer-motion'
import { Users, FileText, Mail, BookOpen } from 'lucide-react'
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
  icon: 'users' | 'blogs' | 'emails' | 'faqs'
  color: string
  colorText?: string
  trend?: string
}

const iconMap = {
  users: Users,
  blogs: FileText,
  emails: Mail,
  faqs: BookOpen,
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
          setStats([
            {
              id: 'users',
              title: 'Total Users',
              value: 0,
              icon: 'users',
              color: 'soft-blue'
            },
            {
              id: 'blogs',
              title: 'Total Blogs',
              value: 0,
              icon: 'blogs',
              color: 'mint-green'
            },
            {
              id: 'emails',
              title: 'Pending Emails',
              value: 0,
              icon: 'emails',
              color: 'soft-coral'
            },
            {
              id: 'faqs',
              title: 'Total FAQs',
              value: 0,
              icon: 'faqs',
              color: 'cool-gray'
            }
          ])
          return
        }

        const data = await response.json()
        setStats([
          {
            id: 'users',
            title: 'Total Users',
            value: data.totalUsers || 0,
            icon: 'users',
            color: 'soft-blue'
          },
          {
            id: 'blogs',
            title: 'Total Blogs',
            value: data.totalBlogs || 0,
            icon: 'blogs',
            color: 'mint-green'
          },
          {
            id: 'emails',
            title: 'Pending Emails',
            value: data.pendingEmails || 0,
            icon: 'emails',
            color: 'soft-coral'
          },
          {
            id: 'faqs',
            title: 'Total FAQs',
            value: data.totalFaqs || 0,
            icon: 'faqs',
            color: 'cool-gray'
          }
        ])
      } catch (error) {
        console.warn('Error fetching admin stats:', error)
        // Set default values if API fails
        setStats([
          {
            id: 'users',
            title: 'Total Users',
            value: 0,
            icon: 'users',
            color: 'soft-blue'
          },
          {
            id: 'blogs',
            title: 'Total Blogs',
            value: 0,
            icon: 'blogs',
            color: 'mint-green'
          },
          {
            id: 'emails',
            title: 'Pending Emails',
            value: 0,
            icon: 'emails',
            color: 'soft-coral'
          },
          {
            id: 'faqs',
            title: 'Total FAQs',
            value: 0,
            icon: 'faqs',
            color: 'cool-gray'
          }
        ])
      } finally {
        setLoading(false)
      }
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
        const Icon = iconMap[card.icon as keyof typeof iconMap]
        return (
          <motion.div key={card.id} variants={itemVariants} className="h-full">
            <Card className={`h-full flex flex-col justify-between bg-gradient-to-br from-${card.color}/10 to-${card.color}/5 border-${card.color}/20`}>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cool-gray">{card.title}</p>
                    <p className={`text-2xl font-bold ${card.colorText ? `text-${card.colorText}` : `text-${card.color}`}`}>
                      {typeof card.value === 'number' ? (
                        <CountUp
                          from={0}
                          to={card.value}
                          separator=","
                          direction="up"
                          duration={1}
                          className={card.colorText ? `text-${card.colorText}` : `text-${card.color}`}
                        />
                      ) : (
                        card.value
                      )}
                    </p>
                    {card.subtitle && <p className="text-xs text-cool-gray">{card.subtitle}</p>}
                    {card.trend && (
                      <p className="text-xs text-green-600 flex items-center">
                        {card.trend}
                      </p>
                    )}
                  </div>
                  {Icon && <Icon className={`w-8 h-8 text-${card.color}`} />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
