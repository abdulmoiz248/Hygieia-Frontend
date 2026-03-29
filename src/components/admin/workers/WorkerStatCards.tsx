"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Stethoscope, Salad, FlaskConical } from "lucide-react"
import CountUp from "@/blocks/TextAnimations/CountUp/CountUp"
import { Role } from "@/types/admin/workers"

const ROLE_CONFIG: Record<Role, {
  plural: string
  icon: React.ElementType
  colorClass: string
}> = {
  doctor: {
    plural: "Doctors",
    icon: Stethoscope,
    colorClass: "soft-blue",
  },
  nutritionist: {
    plural: "Nutritionists",
    icon: Salad,
    colorClass: "mint-green",
  },
  pathologist: {
    plural: "Pathologists",
    icon: FlaskConical,
    colorClass: "soft-coral",
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface WorkerStatCardsProps {
  counts: Record<Role, number>
}

export default function WorkerStatCards({ counts }: WorkerStatCardsProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {(Object.keys(ROLE_CONFIG) as Role[]).map((role) => {
        const cfg = ROLE_CONFIG[role]
        const Icon = cfg.icon
        return (
          <motion.div key={role} variants={itemVariants} className="h-full">
            <Card
              className={`h-full flex flex-col justify-between bg-gradient-to-br from-${cfg.colorClass}/10 to-${cfg.colorClass}/5 border-${cfg.colorClass}/20`}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cool-gray">{cfg.plural}</p>
                    <p className={`text-2xl font-bold text-${cfg.colorClass}`}>
                      <CountUp
                        from={0}
                        to={counts[role]}
                        separator=","
                        direction="up"
                        duration={1}
                        className={`text-${cfg.colorClass}`}
                      />
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 text-${cfg.colorClass}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
