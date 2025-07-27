"use client"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fullWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function Week() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const today = new Date()
  

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      days.push({
        day: fullWeek[date.getDay()],
        date: date.toDateString(),
        isToday: i === 0,
        completed: Math.random() > 0.4, // mock random completion
      })
    }
    return days
  }

  const last7Days = getLast7Days()

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Calendar className="w-5 h-5 text-mint-green" />
            Past 7 Days Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {last7Days.map((dayInfo, index) => (
              <div
                key={index}
                className={`rounded-xl p-4 text-center border-2 transition-all flex flex-col items-center justify-center ${
                  dayInfo.isToday
                    ? "border-soft-blue bg-soft-blue/10"
                    : dayInfo.completed
                    ? "border-mint-green/30 bg-mint-green/5"
                    : "border-gray-200"
                }`}
              >
                <div className="text-sm font-semibold text-dark-slate-gray">{dayInfo.day}</div>
                <div className="text-3xl py-2">{dayInfo.completed ? "✅" : "⭕"}</div>
                <div className="text-xs text-cool-gray">
                  {dayInfo.completed ? "Completed" : "Not Completed"}
                </div>
                {dayInfo.isToday && (
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
