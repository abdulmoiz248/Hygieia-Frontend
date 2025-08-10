"use client"

import { motion } from "framer-motion"
import { Target, Trophy, Star, TrendingUp,  Award, CheckCircle, Clock, Zap, Heart, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Mock data for goals and achievements
const currentGoals = [
  {
    id: 1,
    title: "Weight Loss Goal",
    target: 70,
    current: 72.5,
    unit: "kg",
    deadline: "2024-03-15",
    progress: 75,
    category: "fitness",
    icon: Target,
    color: "var(--color-soft-coral)",
    bgColor: "bg-soft-coral/20",
    borderColor: "border-soft-coral/30"
  },
  {
    id: 2,
    title: "Daily Steps Target",
    target: 10000,
    current: 8500,
    unit: "steps",
    deadline: "2024-01-31",
    progress: 85,
    category: "activity",
    icon: Activity,
    color: "var(--color-mint-green)",
    bgColor: "bg-mint-green/20",
    borderColor: "border-mint-green/30"
  },
  {
    id: 3,
    title: "Blood Pressure Control",
    target: 120,
    current: 125,
    unit: "mmHg",
    deadline: "2024-02-28",
    progress: 60,
    category: "health",
    icon: Heart,
    color: "var(--color-soft-blue)",
    bgColor: "bg-soft-blue/20",
    borderColor: "border-soft-blue/30"
  },
  {
    id: 4,
    title: "Sleep Quality Improvement",
    target: 8.5,
    current: 7.8,
    unit: "hours",
    deadline: "2024-02-15",
    progress: 90,
    category: "wellness",
    icon: Clock,
    color: "var(--color-cool-gray)",
    bgColor: "bg-cool-gray/20",
    borderColor: "border-cool-gray/30"
  }
]

const achievements = [
  {
    id: 1,
    title: "First Week Complete",
    description: "Successfully completed your first week of medication adherence",
    date: "2024-01-15",
    type: "medication",
    icon: CheckCircle,
    color: "text-mint-green",
    bgColor: "bg-mint-green/20",
    points: 100
  },
  {
    id: 2,
    title: "Exercise Streak",
    description: "Maintained exercise routine for 7 consecutive days",
    date: "2024-01-20",
    type: "fitness",
    icon: Trophy,
    color: "text-soft-coral",
    bgColor: "bg-soft-coral/20",
    points: 150
  },
  {
    id: 3,
    title: "Blood Pressure Milestone",
    description: "Achieved target blood pressure reading for the first time",
    date: "2024-01-25",
    type: "health",
    icon: Heart,
    color: "text-soft-blue",
    bgColor: "bg-soft-blue/20",
    points: 200
  },
  {
    id: 4,
    title: "Nutrition Master",
    description: "Completed 30 days of healthy eating",
    date: "2024-01-30",
    type: "nutrition",
    icon: Award,
    color: "text-mint-green",
    bgColor: "bg-mint-green/20",
    points: 300
  }
]

const upcomingMilestones = [
  {
    id: 1,
    title: "Weight Goal Achievement",
    description: "You're 2.5kg away from your target weight",
    daysLeft: 45,
    category: "fitness",
    icon: Target,
    color: "var(--color-soft-coral)"
  },
  {
    id: 2,
    title: "Exercise Habit Formation",
    description: "21 days to form a lasting exercise habit",
    daysLeft: 14,
    category: "activity",
    icon: Activity,
    color: "var(--color-mint-green)"
  },
  {
    id: 3,
    title: "Blood Pressure Target",
    description: "5 more readings needed to reach target",
    daysLeft: 30,
    category: "health",
    icon: Heart,
    color: "var(--color-soft-blue)"
  }
]

export default function GoalTracker() {
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null)

  const getDaysLeft = (deadline: string) => {
    const today = new Date()
    const targetDate = new Date(deadline)
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "var(--color-mint-green)"
    if (progress >= 60) return "var(--color-soft-blue)"
    if (progress >= 40) return "var(--color-soft-coral)"
    return "var(--color-cool-gray)"
  }

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0)

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Current Goals Overview */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-soft-coral/10 to-mint-green/10 border-b border-white/20">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className="p-2 bg-soft-coral/20 rounded-lg">
              <Target className="w-5 h-5 text-soft-coral" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Active Health Goals</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">Track your progress towards better health</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentGoals.map((goal) => (
              <div
                key={goal.id}
                className={`p-4 rounded-xl border ${goal.borderColor} ${goal.bgColor} transition-all duration-200 hover:scale-105 cursor-pointer`}
                onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <goal.icon className="w-5 h-5" style={{ color: goal.color }} />
                    <span className="font-medium text-dark-slate-gray/80">{goal.title}</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-white/50 border border-white/30"
                  >
                    {goal.category}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-dark-slate-gray/70">Progress</span>
                    <span className="text-sm font-medium text-dark-slate-gray/90">
                      {goal.progress}%
                    </span>
                  </div>
                  <Progress 
                    value={goal.progress} 
                    className="h-2"
                    style={{
                      '--progress-background': getProgressColor(goal.progress),
                    } as React.CSSProperties}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-dark-slate-gray/60">Current:</span>
                    <span className="ml-1 font-semibold text-dark-slate-gray/90">
                      {goal.current} {goal.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-dark-slate-gray/60">Target:</span>
                    <span className="ml-1 font-semibold text-dark-slate-gray/90">
                      {goal.target} {goal.unit}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-slate-gray/60">
                      {getDaysLeft(goal.deadline)} days left
                    </span>
                    <span className="text-dark-slate-gray/60">
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements and Points */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-mint-green/10 to-soft-blue/10 border-b border-white/20">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className="p-2 bg-mint-green/20 rounded-lg">
              <Trophy className="w-5 h-5 text-mint-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Achievements & Rewards</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">Celebrate your health milestones</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Star className="w-5 h-5 text-mint-green" />
              <span className="text-xl font-bold text-mint-green">{totalPoints}</span>
              <span className="text-sm text-dark-slate-gray/60">points</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border border-white/20 ${achievement.bgColor} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${achievement.bgColor} ${achievement.color}`}>
                    <achievement.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-dark-slate-gray/90">{achievement.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-white/50 border border-white/30"
                      >
                        +{achievement.points}
                      </Badge>
                    </div>
                    <p className="text-sm text-dark-slate-gray/70 mb-2">{achievement.description}</p>
                    <div className="flex items-center justify-between text-xs text-dark-slate-gray/60">
                      <span>{achievement.type}</span>
                      <span>{new Date(achievement.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Milestones */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-soft-blue/10 to-soft-coral/10 border-b border-white/20">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className="p-2 bg-soft-blue/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-soft-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Upcoming Milestones</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">Stay motivated with upcoming achievements</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {upcomingMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="p-4 rounded-xl border border-white/20 bg-white/30 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-3">
                  <milestone.icon className="w-5 h-5" style={{ color: milestone.color }} />
                  <span className="font-semibold text-dark-slate-gray/90">{milestone.title}</span>
                </div>
                <p className="text-sm text-dark-slate-gray/70 mb-3">{milestone.description}</p>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-white/50 border border-white/30"
                  >
                    {milestone.category}
                  </Badge>
                  <span className="text-sm font-medium text-dark-slate-gray/80">
                    {milestone.daysLeft} days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivation Section */}
      <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-mint-green/10 to-soft-coral/10 border-b border-white/20">
          <CardTitle className="flex items-center gap-3 text-dark-slate-gray/90">
            <div className="p-2 bg-mint-green/20 rounded-lg">
              <Zap className="w-5 h-5 text-mint-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Daily Motivation</h3>
              <p className="text-sm font-normal text-dark-slate-gray/60">Stay inspired on your health journey</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-dark-slate-gray/90 mb-4">
              &quot;Every step you take towards better health is a victory worth celebrating!&quot;
            </div>
            <div className="text-dark-slate-gray/70 mb-6">
              You&apos;re making incredible progress. Keep up the amazing work!
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-mint-green mb-1">7</div>
                <div className="text-sm text-dark-slate-gray/60">Days Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-soft-blue mb-1">85%</div>
                <div className="text-sm text-dark-slate-gray/60">Goal Completion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-soft-coral mb-1">12</div>
                <div className="text-sm text-dark-slate-gray/60">Achievements</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
