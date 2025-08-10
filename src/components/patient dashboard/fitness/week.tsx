"use client"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSelector } from "react-redux"
import { RootState } from "@/store/patient/store"

export default function Week() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

 const activityLog = useSelector((state: RootState) => state.fitness.activityLog)
  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="w-full">
      <Card className="w-full bg-white/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Calendar className="w-5 h-5 text-mint-green" />
            Past 7 Days Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
    
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
  {activityLog.map((dayInfo, index) => (
    <div
      key={index}
      className={`rounded-xl p-4 text-center border-2 transition-all flex flex-col items-center justify-center ${
        dayInfo.completed
          ? "border-mint-green/30 bg-mint-green/5"
          : "border-gray-200 bg-cool-gray/10"
      }`}
    >
      <div className="text-sm font-semibold text-dark-slate-gray">{new Date(dayInfo.date).toDateString().split(" ")[0]}</div>
      <div className="text-3xl py-2">{dayInfo.completed ? "✅" : "⭕"}</div>
      <div className="text-xs text-cool-gray">
        {dayInfo.completed ? "Completed" : "Not Completed"}
      </div>
      {new Date().toDateString() === dayInfo.date && (
        <div className="mt-1 text-xs text-soft-blue font-semibold">Today</div>
      )}
    </div>
  ))}
</div>

        </CardContent>
      </Card>
    </motion.div>
  )
}
