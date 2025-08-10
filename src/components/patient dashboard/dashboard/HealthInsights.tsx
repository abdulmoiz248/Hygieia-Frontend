"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Target, Calendar, Award, Lightbulb, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Mock data for health insights
const healthTrends = [
  {
    metric: "Blood Pressure",
    trend: "improving",
    change: -8,
    period: "vs last month",
    icon: TrendingDown,
    color: "text-mint-green",
    bgColor: "bg-mint-green/20",
    borderColor: "border-mint-green/30"
  },
  {
    metric: "Weight",
    trend: "improving",
    change: -2.5,
    period: "vs last month",
    icon: TrendingDown,
    color: "text-mint-green",
    bgColor: "bg-mint-green/20",
    borderColor: "border-mint-green/30"
  },
  {
    metric: "Sleep Quality",
    trend: "stable",
    change: 0.3,
    period: "vs last month",
    icon: TrendingUp,
    color: "text-soft-blue",
    bgColor: "bg-soft-blue/20",
    borderColor: "border-soft-blue/30"
  },
  {
    metric: "Exercise Frequency",
    trend: "declining",
    change: -15,
    period: "vs last month",
    icon: TrendingDown,
    color: "text-soft-coral",
    bgColor: "bg-soft-coral/20",
    borderColor: "border-soft-coral/30"
  }
]

const healthRecommendations = [
  {
    type: "exercise",
    title: "Increase Cardio Sessions",
    description: "Your heart rate variability suggests you could benefit from more cardiovascular exercise.",
    priority: "high",
    impact: "High",
    timeframe: "2-4 weeks",
    icon: Target,
    color: "text-soft-coral",
    bgColor: "bg-soft-coral/20"
  },
  {
    type: "nutrition",
    title: "Optimize Protein Intake",
    description: "Your protein consumption is below the recommended level for your activity level.",
    priority: "medium",
    impact: "Medium",
    timeframe: "1-2 weeks",
    icon: Award,
    color: "text-mint-green",
    bgColor: "bg-mint-green/20"
  },
  {
    type: "sleep",
    title: "Improve Sleep Hygiene",
    description: "Your deep sleep duration has decreased. Consider adjusting your bedtime routine.",
    priority: "medium",
    impact: "High",
    timeframe: "1-3 weeks",
    icon: Lightbulb,
    color: "text-soft-blue",
    bgColor: "bg-soft-blue/20"
  }
]

const predictiveInsights = [
  {
    category: "Health Risk",
    prediction: "Low risk of developing hypertension",
    confidence: 85,
    timeframe: "Next 6 months",
    factors: ["Consistent blood pressure", "Regular exercise", "Good diet"],
    icon: CheckCircle,
    color: "text-mint-green"
  },
  {
    category: "Fitness Goal",
    prediction: "Likely to reach target weight",
    confidence: 78,
    timeframe: "Next 3 months",
    factors: ["Current progress rate", "Diet adherence", "Exercise consistency"],
    icon: Target,
    color: "text-soft-blue"
  },
  {
    category: "Medication",
    prediction: "May need dosage adjustment",
    confidence: 65,
    timeframe: "Next month",
    factors: ["Side effects", "Effectiveness trends", "Blood work results"],
    icon: AlertTriangle,
    color: "text-soft-coral"
  }
]

const healthScoreBreakdown = [
  { category: "Physical Health", score: 87, target: 90, color: "var(--color-mint-green)" },
  { category: "Mental Wellness", score: 82, target: 85, color: "var(--color-soft-blue)" },
  { category: "Nutrition", score: 78, target: 85, color: "var(--color-soft-coral)" },
  { category: "Sleep Quality", score: 85, target: 88, color: "var(--color-cool-gray)" },
  { category: "Exercise", score: 75, target: 80, color: "var(--color-dark-slate-gray)" }
]

export default function HealthInsights() {
  return (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Health Trends Overview */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-soft-blue/10 to-mint-green/10 border-b border-white/20">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className="p-2 bg-soft-blue/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-soft-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Health Trends</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">Monthly performance changes</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthTrends.map((trend, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${trend.borderColor} ${trend.bgColor} transition-all duration-200 hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-slate-gray/70">{trend.metric}</span>
                  <trend.icon className={`w-4 h-4 ${trend.color}`} />
                </div>
                <div className="text-2xl font-bold text-dark-slate-gray/90">
                  {trend.change > 0 ? '+' : ''}{trend.change}
                </div>
                <div className="text-xs text-dark-slate-gray/60">{trend.period}</div>
                <Badge 
                  variant="secondary" 
                  className={`mt-2 text-xs ${trend.color} bg-white/50 border ${trend.borderColor}`}
                >
                  {trend.trend}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Score Breakdown */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-mint-green/10 to-soft-coral/10 border-b border-white/20">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className="p-2 bg-mint-green/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-mint-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Health Score Breakdown</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">Detailed wellness assessment</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {healthScoreBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-dark-slate-gray/80">{item.category}</span>
                  <span className="font-bold text-lg" style={{ color: item.color }}>
                    {item.score}/{item.target}
                  </span>
                </div>
                <Progress 
                  value={(item.score / item.target) * 100} 
                  className="h-3"
                  style={{
                    '--progress-background': item.color,
                  } as React.CSSProperties}
                />
                <div className="text-right">
                  <span className="text-sm text-dark-slate-gray/60">
                    {Math.round((item.score / item.target) * 100)}% of target
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-soft-coral/10 to-soft-blue/10 border-b border-white/20">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className="p-2 bg-soft-coral/20 rounded-lg">
              <Lightbulb className="w-5 h-5 text-soft-coral" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">AI-powered health suggestions</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {healthRecommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border border-white/20 ${rec.bgColor} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${rec.bgColor} ${rec.color}`}>
                    <rec.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-dark-slate-gray/90">{rec.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          rec.priority === 'high' ? 'bg-soft-coral/20 text-soft-coral border-soft-coral/30' :
                          rec.priority === 'medium' ? 'bg-mint-green/20 text-mint-green border-mint-green/30' :
                          'bg-soft-blue/20 text-soft-blue border-soft-blue/30'
                        }`}
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-dark-slate-gray/70 mb-3">{rec.description}</p>
                    <div className="flex items-center gap-4 text-xs text-dark-slate-gray/60">
                      <span>Impact: <span className="font-medium">{rec.impact}</span></span>
                      <span>Timeframe: <span className="font-medium">{rec.timeframe}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-soft-blue/10 to-mint-green/10 border-b border-white/20">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className="p-2 bg-soft-blue/20 rounded-lg">
              <Info className="w-5 h-5 text-soft-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Predictive Insights</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">AI-powered health forecasting</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {predictiveInsights.map((insight, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-white/20 bg-white/30 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-3">
                  <insight.icon className={`w-5 h-5 ${insight.color}`} />
                  <span className="font-semibold text-dark-slate-gray/90">{insight.category}</span>
                </div>
                <p className="text-sm text-dark-slate-gray/80 mb-3">{insight.prediction}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-dark-slate-gray/60">Confidence</span>
                    <span className="font-bold text-sm" style={{ color: insight.color }}>
                      {insight.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-cool-gray/20 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${insight.confidence}%`, 
                        backgroundColor: insight.color 
                      }}
                    />
                  </div>
                  <div className="text-xs text-dark-slate-gray/60 mb-2">
                    Timeframe: {insight.timeframe}
                  </div>
                  <div className="text-xs text-dark-slate-gray/70">
                    <span className="font-medium">Key Factors:</span>
                    <ul className="mt-1 space-y-1">
                      {insight.factors.map((factor, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-mint-green/60" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
