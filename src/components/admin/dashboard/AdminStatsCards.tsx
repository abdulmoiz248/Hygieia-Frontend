'use client'

import { motion } from 'framer-motion'
import { Users, FileText, BookOpen, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import CountUp from '@/blocks/TextAnimations/CountUp/CountUp'
import { useAdminDashboardStats } from '@/hooks/admin/dashboard/useAdminDashboardStats'

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const colorClasses = {
  'soft-blue': {
    bg:   'from-soft-blue/10 to-soft-blue/5 border-soft-blue/20',
    text: 'text-soft-blue',
  },
  'mint-green': {
    bg:   'from-mint-green/10 to-mint-green/5 border-mint-green/20',
    text: 'text-mint-green',
  },
  'soft-coral': {
    bg:   'from-soft-coral/10 to-soft-coral/5 border-soft-coral/20',
    text: 'text-soft-coral',
  },
  'cool-gray': {
    bg:   'from-cool-gray/10 to-cool-gray/5 border-cool-gray/20',
    text: 'text-cool-gray',
  },
}

export default function AdminStatsCards() {
  const { isLoading, totalUsers, totalBlogs, pendingCVs, totalFaqs } =
    useAdminDashboardStats()

  const cards = [
    {
      id:    'users',
      title: 'Total Users',
      value: totalUsers,
      icon:  Users,
      color: 'soft-blue' as const,
    },
    {
      id:    'blogs',
      title: 'Total Blogs',
      value: totalBlogs,
      icon:  FileText,
      color: 'mint-green' as const,
    },
    {
      id:    'cvs',
      title: 'Pending CVs',
      value: pendingCVs,
      icon:  Mail,
      color: 'soft-coral' as const,
    },
    {
      id:    'faqs',
      title: 'Total FAQs',
      value: totalFaqs,
      icon:  BookOpen,
      color: 'cool-gray' as const,
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {cards.map((card) => {
        const Icon   = card.icon
        const colors = colorClasses[card.color]

        return (
          <motion.div key={card.id} variants={itemVariants} className="h-full">
            <Card
              className={`h-full flex flex-col justify-between bg-gradient-to-br ${colors.bg}`}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cool-gray">{card.title}</p>
                    <p className={`text-2xl font-bold ${colors.text}`}>
                      <CountUp
                        from={0}
                        to={card.value}
                        separator=","
                        direction="up"
                        duration={1}
                        className={colors.text}
                      />
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${colors.text}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
