"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  Target,
  Calendar,
  Plus,
  Droplets,
  Footprints,
  Dumbbell,
  Heart,
  Scale,
  Calculator,
  ChefHat,
  Users,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockFitnessGoals } from "@/mocks/data"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function FitnessPage() {
  const [showLogActivity, setShowLogActivity] = useState(false)
  const [showBMICalculator, setShowBMICalculator] = useState(false)
  const [showCalorieTracker, setShowCalorieTracker] = useState(false)
  const [healthScore, setHealthScore] = useState(75) // Can be changed to 0 to test edge case
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [bmi, setBMI] = useState<number | null>(null)
  const [caloriesConsumed, setCaloriesConsumed] = useState(1850)
  const [caloriesBurned, setCaloriesBurned] = useState(520)

  useEffect(()=>{
    setHealthScore(75)
    setCaloriesBurned(1850)
    setCaloriesConsumed(520)
  })

  // Enhanced calories history data
  const caloriesHistory = [
    { date: "Mon", consumed: 1850, burned: 520, net: 1330 },
    { date: "Tue", consumed: 2100, burned: 680, net: 1420 },
    { date: "Wed", consumed: 1950, burned: 450, net: 1500 },
    { date: "Thu", consumed: 2200, burned: 720, net: 1480 },
    { date: "Fri", consumed: 1800, burned: 380, net: 1420 },
    { date: "Sat", consumed: 2400, burned: 800, net: 1600 },
    { date: "Sun", consumed: 2000, burned: 600, net: 1400 },
  ]

  // Mock active diet plan
  const activeDietPlan = {
    name: "Mediterranean Diet Plan",
    nutritionist: "Dr. Lisa Chen",
    duration: "4 weeks",
    currentWeek: 2,
    todaysMeals: [
      { type: "Breakfast", meal: "Greek yogurt with berries and nuts", calories: 320, time: "8:00 AM" },
      { type: "Lunch", meal: "Grilled salmon with quinoa salad", calories: 450, time: "12:30 PM" },
      { type: "Snack", meal: "Apple with almond butter", calories: 180, time: "3:00 PM" },
      { type: "Dinner", meal: "Mediterranean chicken with vegetables", calories: 520, time: "7:00 PM" },
    ],
  }

  // Enhanced Virtual Garden Health with edge cases
  const getTreeHealth = (score: number) => {
    if (score === 0) return { emoji: "🪴", status: "Just Starting", color: "text-gray-500" }
    if (score >= 80) return { emoji: "🌳", status: "Thriving", color: "text-mint-green" }
    if (score >= 60) return { emoji: "🌲", status: "Growing", color: "text-yellow-600" }
    if (score >= 40) return { emoji: "🌱", status: "Sprouting", color: "text-orange-500" }
    if (score >= 20) return { emoji: "🌿", status: "Budding", color: "text-blue-500" }
    return { emoji: "🥀", status: "Needs Care", color: "text-soft-coral" }
  }

  const getMotivationalMessage = (score: number) => {
    if (score === 0) return "Start your health journey today! Every small step counts."
    if (score < 20) return "Don't give up! Small consistent actions lead to big changes."
    if (score < 40) return "You're making progress! Keep building those healthy habits."
    if (score < 60) return "Great momentum! You're on the right track."
    if (score < 80) return "Excellent progress! You're almost at your peak health."
    return "Outstanding! You're a health champion!"
  }

  const treeHealth = getTreeHealth(healthScore)

  const calculateBMI = () => {
    if (weight && height) {
      const weightKg = Number.parseFloat(weight)
      const heightM = Number.parseFloat(height) / 100
      const bmiValue = weightKg / (heightM * heightM)
      setBMI(Math.round(bmiValue * 10) / 10)
    }
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" }
    if (bmi < 25) return { category: "Normal", color: "text-mint-green" }
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" }
    return { category: "Obese", color: "text-soft-coral" }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-slate-gray">Fitness & Diet</h1>
          <p className="text-cool-gray">Monitor your health journey and manage your nutrition</p>
        </div>

        <div className="flex gap-2">
          <Dialog open={showLogActivity} onOpenChange={setShowLogActivity}>
            <DialogTrigger asChild>
              <Button className="bg-soft-coral hover:bg-soft-coral/90">
                <Plus className="w-4 h-4 mr-2" />
                Log Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log New Activity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Activity Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="cycling">Cycling</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="gym">Gym Workout</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input type="number" placeholder="30" />
                </div>
                <div>
                  <label className="text-sm font-medium">Intensity</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intensity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-soft-coral hover:bg-soft-coral/90">Log Activity</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showBMICalculator} onOpenChange={setShowBMICalculator}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calculator className="w-4 h-4 mr-2" />
                BMI Calculator
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>BMI Calculator</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Weight (kg)</label>
                    <Input type="number" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Height (cm)</label>
                    <Input type="number" placeholder="175" value={height} onChange={(e) => setHeight(e.target.value)} />
                  </div>
                </div>
                <Button onClick={calculateBMI} className="w-full bg-mint-green hover:bg-mint-green/90">
                  Calculate BMI
                </Button>
                {bmi && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-soft-blue mb-2">{bmi}</div>
                    <div className={`font-medium ${getBMICategory(bmi).color}`}>{getBMICategory(bmi).category}</div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Enhanced Virtual Garden with Edge Cases */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-mint-green/10 to-soft-blue/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              Your Health Garden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-8xl">{treeHealth.emoji}</div>
              <div>
                <h3 className={`text-2xl font-bold ${treeHealth.color}`}>{treeHealth.status}</h3>
                <p className="text-cool-gray">Health Score: {healthScore}/100</p>
              </div>
              <Progress value={healthScore} className="w-full max-w-md mx-auto h-3" />
              <p className="text-sm text-cool-gray max-w-md mx-auto">{getMotivationalMessage(healthScore)}</p>
              {healthScore === 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg max-w-md mx-auto">
                  <p className="text-sm text-blue-800 font-medium">🌱 Ready to start your health journey?</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Log your first activity, track your meals, or set a fitness goal to begin growing your health tree!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Calorie Tracking */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-soft-coral" />
                Calorie Tracking
              </div>
              <Dialog open={showCalorieTracker} onOpenChange={setShowCalorieTracker}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Calories
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Calories</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consumed">Calories Consumed</SelectItem>
                          <SelectItem value="burned">Calories Burned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Amount</label>
                      <Input type="number" placeholder="250" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input placeholder="e.g., Lunch, 30min run" />
                    </div>
                    <Button className="w-full bg-soft-coral hover:bg-soft-coral/90">Add Calories</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-mint-green mb-2">{caloriesConsumed}</div>
                <p className="text-sm text-cool-gray">Consumed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-soft-coral mb-2">{caloriesBurned}</div>
                <p className="text-sm text-cool-gray">Burned</p>
              </div>
              <div className="text-center">
                <div
                  className={`text-3xl font-bold mb-2 ${caloriesConsumed - caloriesBurned > 0 ? "text-yellow-600" : "text-mint-green"}`}
                >
                  {caloriesConsumed - caloriesBurned}
                </div>
                <p className="text-sm text-cool-gray">Net Calories</p>
              </div>
            </div>

            {/* Calories History Chart */}
            <div className="mt-6">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Weekly Calories History
              </h4>
              <ChartContainer
                config={{
                  consumed: {
                    label: "Consumed",
                    color: "hsl(var(--chart-1))",
                  },
                  burned: {
                    label: "Burned",
                    color: "hsl(var(--chart-2))",
                  },
                  net: {
                    label: "Net",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={caloriesHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="consumed" fill="var(--color-consumed)" name="Consumed" />
                    <Bar dataKey="burned" fill="var(--color-burned)" name="Burned" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Active Diet Plan */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-mint-green" />
                Active Diet Plan
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/nutritionists">
                    <Users className="w-4 h-4 mr-2" />
                    Find Nutritionist
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  Generate AI Plan
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeDietPlan ? (
              <>
                <div className="flex items-center justify-between p-4 bg-mint-green/10 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-dark-slate-gray">{activeDietPlan.name}</h3>
                    <p className="text-sm text-cool-gray">by {activeDietPlan.nutritionist}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-mint-green text-white">
                      Week {activeDietPlan.currentWeek}/{activeDietPlan.duration.split(" ")[0]}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Today&apos;s Meal Plan</h4>
                  <div className="space-y-3">
                    {activeDietPlan.todaysMeals.map((meal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{meal.type}</Badge>
                            <span className="text-sm text-cool-gray">{meal.time}</span>
                          </div>
                          <p className="font-medium mt-1">{meal.meal}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-soft-coral">{meal.calories} cal</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Nutrition Chart */}
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Weekly Nutrition Tracking
                  </h4>
                  <ChartContainer
                    config={{
                      net: {
                        label: "Net Calories",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={caloriesHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="net"
                          stroke="var(--color-net)"
                          strokeWidth={3}
                          name="Net Calories"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <ChefHat className="w-16 h-16 text-cool-gray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-dark-slate-gray mb-2">No Active Diet Plan</h3>
                <p className="text-cool-gray mb-4">Get started with a personalized nutrition plan</p>
                <div className="flex gap-2 justify-center">
                  <Button className="bg-mint-green hover:bg-mint-green/90" asChild>
                    <Link href="/nutritionists">Find Nutritionist</Link>
                  </Button>
                  <Button variant="outline">Generate AI Plan</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Goals */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-soft-coral" />
              Today&apos;s Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockFitnessGoals.map((goal) => {
                const progress = (goal.current / goal.target) * 100
                const getIcon = (type: string) => {
                  switch (type) {
                    case "steps":
                      return <Footprints className="w-6 h-6 text-soft-blue" />
                    case "water":
                      return <Droplets className="w-6 h-6 text-blue-500" />
                    case "exercise":
                      return <Dumbbell className="w-6 h-6 text-soft-coral" />
                    case "weight":
                      return <Heart className="w-6 h-6 text-red-500" />
                    default:
                      return <Activity className="w-6 h-6 text-cool-gray" />
                  }
                }

                return (
                  <div key={goal.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getIcon(goal.type)}
                        <div>
                          <h3 className="font-medium capitalize">{goal.type}</h3>
                          <p className="text-sm text-cool-gray">
                            {goal.current} / {goal.target} {goal.unit}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-dark-slate-gray">{Math.round(progress)}%</div>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Calendar */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-mint-green" />
              This Week&apos;s Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const hasActivity = index < 5 // Mock: activities for first 5 days
                const isToday = index === 2 // Mock: today is Wednesday

                return (
                  <div
                    key={`${day}-${index}`}
                    className={`p-4 rounded-lg text-center border-2 transition-all ${
                      isToday
                        ? "border-soft-blue bg-soft-blue/10"
                        : hasActivity
                          ? "border-mint-green/30 bg-mint-green/5"
                          : "border-gray-200"
                    }`}
                  >
                    <div className="text-sm font-medium text-dark-slate-gray mb-2">{day}</div>
                    <div className="text-2xl mb-2">{hasActivity ? "✅" : "⭕"}</div>
                    <div className="text-xs text-cool-gray">{hasActivity ? "Active" : "Rest"}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
