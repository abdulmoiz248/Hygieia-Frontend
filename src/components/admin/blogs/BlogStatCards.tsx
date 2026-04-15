import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import CountUp from "@/blocks/TextAnimations/CountUp/CountUp"
import { BookOpen, AlertTriangle, ShieldCheck } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogStatCard {
  id: string
  title: string
  value: number
  icon: React.ElementType
  color: string
  colorClass: string
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0  },
}

// ─── Default Cards Config ─────────────────────────────────────────────────────

export function buildStatCards(total: number, pending: number, published: number): BlogStatCard[] {
  return [
    { id: "total",     title: "Total Posts",    value: total,     icon: BookOpen,      color: "var(--color-soft-blue)",  colorClass: "soft-blue"  },
    { id: "pending",   title: "Pending Review", value: pending,   icon: AlertTriangle, color: "var(--color-soft-coral)", colorClass: "soft-coral" },
    { id: "published", title: "Published",      value: published, icon: ShieldCheck,   color: "var(--color-mint-green)", colorClass: "mint-green" },
  ]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BlogStatCards({ cards }: { cards: BlogStatCard[] }) {
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
            <Card className={`h-full bg-gradient-to-br from-${card.colorClass}/10 to-${card.colorClass}/5 border-${card.colorClass}/20`}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-cool-gray">{card.title}</p>
                  <p className={`text-2xl font-bold text-${card.colorClass}`}>
                    <CountUp
                      from={0}
                      to={card.value}
                      separator=","
                      direction="up"
                      duration={1}
                      className={`text-${card.colorClass}`}
                    />
                  </p>
                </div>
                <Icon className={`w-8 h-8 text-${card.colorClass}`} />
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
