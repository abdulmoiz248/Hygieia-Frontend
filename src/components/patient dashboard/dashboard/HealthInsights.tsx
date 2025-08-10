"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Target, Award, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
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
    bgColor: "bg-soft-coral/25",
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
    bgColor: "bg-mint-green/25",
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
    bgColor: "bg-soft-blue/25",
  },
]

const predictiveInsights = [
  {
    category: "Health Risk",
    prediction: "Low risk of developing hypertension",
    confidence: 85,
    timeframe: "Next 6 months",
    factors: ["Consistent blood pressure", "Regular exercise", "Good diet"],
    icon: CheckCircle,
    color: "text-mint-green",
  },
  {
    category: "Fitness Goal",
    prediction: "Likely to reach target weight",
    confidence: 78,
    timeframe: "Next 3 months",
    factors: ["Current progress rate", "Diet adherence", "Exercise consistency"],
    icon: Target,
    color: "text-soft-blue",
  },
  {
    category: "Medication",
    prediction: "May need dosage adjustment",
    confidence: 65,
    timeframe: "Next month",
    factors: ["Side effects", "Effectiveness trends", "Blood work results"],
    icon: AlertTriangle,
    color: "text-soft-coral",
  },
]

export default function HealthInsights() {
  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-8 max-w-full px-4 lg:px-8">
      
      {/* Recommendations Card */}
      <Card className="bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-md overflow-hidden max-w-full">
        <CardHeader className="bg-gradient-to-r from-soft-coral/30 via-transparent to-soft-blue/30 border-b border-white/25">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray font-semibold text-lg">
            <div className="p-2 bg-soft-coral/30 rounded-lg">
              <Lightbulb className="w-6 h-6 text-soft-coral" />
            </div>
            <span>Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          {healthRecommendations.map((rec, i) => (
            <motion.div 
              key={i}
              className={`flex gap-4 p-4 rounded-xl border border-white/20 ${rec.bgColor} hover:shadow-lg transition-shadow duration-300`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`p-3 rounded-lg flex items-center justify-center ${rec.bgColor} ${rec.color}`}>
                <rec.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-md font-semibold text-dark-slate-gray">{rec.title}</h4>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      rec.priority === "high"
                        ? "bg-soft-coral/30 text-soft-coral border-soft-coral/40"
                        : rec.priority === "medium"
                        ? "bg-mint-green/30 text-mint-green border-mint-green/40"
                        : "bg-soft-blue/30 text-soft-blue border-soft-blue/40"
                    }`}
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-dark-slate-gray/80 mb-2">{rec.description}</p>
                <div className="flex gap-6 text-xs text-dark-slate-gray/60 font-medium">
                  <span>Impact: <span className="font-semibold">{rec.impact}</span></span>
                  <span>Timeframe: <span className="font-semibold">{rec.timeframe}</span></span>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Predictive Insights Card */}
      <Card className="bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-md overflow-hidden max-w-full">
        <CardHeader className="bg-gradient-to-r from-soft-blue/30 via-transparent to-mint-green/30 border-b border-white/25">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray font-semibold text-lg">
            <div className="p-2 bg-soft-blue/30 rounded-lg">
              <Info className="w-6 h-6 text-soft-blue" />
            </div>
            <span>Predictive Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {predictiveInsights.map((insight, i) => (
            <motion.div
              key={i}
              className="p-5 rounded-xl border border-white/20 bg-white/30 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <insight.icon className={`w-6 h-6 ${insight.color}`} />
                <h5 className="font-semibold text-dark-slate-gray">{insight.category}</h5>
              </div>
              <p className="text-sm text-dark-slate-gray/85 mb-4 flex-grow">{insight.prediction}</p>
              <div className="text-xs text-dark-slate-gray/60 font-medium mb-2 flex justify-between">
                <span>Confidence</span>
                <span className={`font-bold`} style={{ color: `var(--${insight.color.replace("text-", "")})` }}>{insight.confidence}%</span>
              </div>
              <div className="w-full bg-cool-gray/20 rounded-full h-2 mb-3">
                <div
                  className="h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${insight.confidence}%`, backgroundColor: `var(--${insight.color.replace("text-", "")})` }}
                />
              </div>
              <div className="text-xs text-dark-slate-gray/60 mb-3">
                Timeframe: <span className="font-semibold">{insight.timeframe}</span>
              </div>
              <div className="text-xs text-dark-slate-gray/70">
                <span className="font-semibold">Key Factors:</span>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {insight.factors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
