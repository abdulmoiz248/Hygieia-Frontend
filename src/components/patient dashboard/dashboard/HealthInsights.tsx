"use client"

import { motion } from "framer-motion"
import { Target, Award, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Variants } from "framer-motion"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, ease: "easeOut" },
  }),
}


const healthRecommendations = [
  {
    type: "exercise",
    title: "Increase Cardio Sessions",
    description: "Heart rate variability says more cardio is needed.",
    priority: "high",
    impact: "High",
    timeframe: "2-4 weeks",
    icon: Target,
    color: "text-soft-coral",
    bgColor: "bg-soft-coral/20",
  },
  {
    type: "nutrition",
    title: "Optimize Protein Intake",
    description: "Protein intake is below activity needs.",
    priority: "medium",
    impact: "Medium",
    timeframe: "1-2 weeks",
    icon: Award,
    color: "text-mint-green",
    bgColor: "bg-mint-green/20",
  },
  {
    type: "sleep",
    title: "Improve Sleep Hygiene",
    description: "Deep sleep duration dropped, adjust bedtime routine.",
    priority: "medium",
    impact: "High",
    timeframe: "1-3 weeks",
    icon: Lightbulb,
    color: "text-soft-blue",
    bgColor: "bg-soft-blue/20",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}


export default function HealthInsights() {
  return (
  
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 lg:space-y-6 w-full">
      {/* Recommendations Section */}
      <Card className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-md max-w-full">
        <CardHeader className="border-b border-white/20 px-6 ">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-dark-slate-gray">
         
              <Lightbulb className="w-5 h-5 text-soft-coral" />
          
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {healthRecommendations.map((rec, i) => (
            <motion.div
              key={rec.title}
              custom={i}
              variants={fadeUp}
              className={`flex flex-col gap-3 rounded-xl p-4 border border-white/20 hover:shadow-lg transition-shadow duration-300 cursor-pointer ${rec.bgColor} backdrop-blur-sm`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${rec.color} bg-white/15`}>
                <rec.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1 flex-grow">
                <h3 className="text-md font-bold text-dark-slate-gray">{rec.title}</h3>
                <p className="text-xs text-dark-slate-gray/75 flex-grow">{rec.description}</p>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs font-semibold text-dark-slate-gray/60">
                <Badge
                  variant="secondary"
                  className={`capitalize rounded-full px-2 py-0.5 font-semibold ${
                    rec.priority === "high"
                      ? "bg-soft-coral/30 text-soft-coral border-soft-coral/40"
                      : rec.priority === "medium"
                      ? "bg-mint-green/30 text-mint-green border-mint-green/40"
                      : "bg-soft-blue/30 text-soft-blue border-soft-blue/40"
                  }`}
                >
                  {rec.priority}
                </Badge>
             
                <span>Timeframe: <span className="font-semibold">{rec.timeframe}</span></span>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

   
    </motion.div>
  )
}
