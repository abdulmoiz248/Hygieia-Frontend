"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import CountUp from "@/blocks/TextAnimations/CountUp/CountUp"
import type { StatCardData } from "@/types/admin/newsletter.types"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface NewsletterStatCardsProps {
  cards: StatCardData[]
}

export function NewsletterStatCards({ cards }: NewsletterStatCardsProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <motion.div key={card.id} variants={itemVariants} className="h-full">
            <Card
              className={`h-full flex flex-col justify-between bg-gradient-to-br from-${card.color}/10 to-${card.color}/5 border-${card.color}/20`}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cool-gray">{card.title}</p>
                    <p
                      className={`text-2xl font-bold ${
                        card.colorText ? `text-${card.colorText}` : `text-${card.color}`
                      }`}
                    >
                      {typeof card.value === "number" ? (
                        <CountUp
                          from={0}
                          to={card.value}
                          separator=","
                          direction="up"
                          duration={1}
                          className={
                            card.colorText ? `text-${card.colorText}` : `text-${card.color}`
                          }
                        />
                      ) : (
                        card.value
                      )}
                    </p>
                    {card.subtitle && (
                      <p className="text-xs text-cool-gray">{card.subtitle}</p>
                    )}
                    {card.trend && (
                      <p className="text-xs text-green-600 flex items-center">{card.trend}</p>
                    )}
                  </div>
                  <Icon className={`w-8 h-8 text-${card.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
