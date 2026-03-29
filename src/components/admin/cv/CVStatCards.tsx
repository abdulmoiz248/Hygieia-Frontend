import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import CountUp from "@/blocks/TextAnimations/CountUp/CountUp"
import { STATUS_CONFIG } from "@/types/admin/cv.config"
import type { CVStatus } from "@/types/admin/cv"

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0  },
}

interface CVStatCardsProps {
  counts: Record<CVStatus, number>
}

export default function CVStatCards({ counts }: CVStatCardsProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      {(Object.keys(STATUS_CONFIG) as CVStatus[]).map(status => {
        const cfg = STATUS_CONFIG[status]
        const Icon = cfg.icon
        return (
          <motion.div key={status} variants={itemVariants} className="h-full">
            <Card className={`h-full flex flex-col justify-between bg-gradient-to-br from-${cfg.colorClass}/10 to-${cfg.colorClass}/5 border-${cfg.colorClass}/20`}>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cool-gray">{cfg.label}</p>
                    <p className={`text-2xl font-bold text-${cfg.colorClass}`}>
                      <CountUp from={0} to={counts[status]} separator="," direction="up" duration={1} className={`text-${cfg.colorClass}`} />
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
