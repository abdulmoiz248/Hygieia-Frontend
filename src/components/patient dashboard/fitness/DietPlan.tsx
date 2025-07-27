"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChefHat, Users, Loader2, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { getUser } from "@/lib/data"

interface Meal {
  type: string
  meal: string
  calories: number
  time: string
}

interface DietPlanType {
  name: string
  nutritionist: string
  duration: string
  currentWeek: number
  todaysMeals: Meal[]
  description?: string // Optional, only present in AI generated plans
  weeklyGoals?: string[] // Optional, only present in AI generated plans
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Mock active diet plan
const initialActiveDietPlan: DietPlanType = {
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

// Mock AI generated plan
const mockAIGeneratedPlan: DietPlanType = {
  // Use DietPlanType here as well
  name: "Personalized Balanced Diet Plan",
  nutritionist: "AI Nutritionist",
  duration: "6 weeks",
  currentWeek: 1,
  description: "A customized nutrition plan based on your preferences and goals",
  todaysMeals: [
    { type: "Breakfast", meal: "Overnight oats with banana and chia seeds", calories: 350, time: "7:30 AM" },
    { type: "Lunch", meal: "Quinoa bowl with grilled chicken and vegetables", calories: 480, time: "12:00 PM" },
    { type: "Snack", meal: "Greek yogurt with mixed berries", calories: 150, time: "3:30 PM" },
    { type: "Dinner", meal: "Baked cod with sweet potato and broccoli", calories: 420, time: "6:30 PM" },
  ],
  weeklyGoals: [
    "Maintain 1,400-1,600 daily calories",
    "Include 25g fiber daily",
    "Drink 8 glasses of water",
    "Exercise 3-4 times per week",
  ],
}

interface FormData {
  goal: string
  currentWeight: number
  targetWeight: string
  height: number
  age: string
  activityLevel: string
  dietaryRestrictions: string[]
  allergies: string
  preferredMeals: string
  duration: string
}

export default function DietPlan() {
  const [activeDietPlan, setActiveDietPlan] = useState<DietPlanType | null>(initialActiveDietPlan)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<DietPlanType | null>(null) // Allow null initially
  const [showConfirmReplace, setShowConfirmReplace] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    goal: "",
    currentWeight: getUser().weight,
    targetWeight: "",
    height: getUser().height,
    age: "",
    activityLevel: "",
    dietaryRestrictions: [],
    allergies: "",
    preferredMeals: "",
    duration: "",
  })

  const handleGenerateAIPlan = () => {
    setIsModalOpen(true)
    setGeneratedPlan(null)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsGenerating(false)
    setGeneratedPlan(mockAIGeneratedPlan)
  }

  const handleStartPlan = () => {
    if (activeDietPlan) {
      setShowConfirmReplace(true)
    } else {
      setActiveDietPlan(generatedPlan)
      setIsModalOpen(false)
      setGeneratedPlan(null)
    }
  }

  const handleConfirmReplace = () => {
    setActiveDietPlan(generatedPlan)
    setShowConfirmReplace(false)
    setIsModalOpen(false)
    setGeneratedPlan(null)
  }

  const handleDietaryRestrictionChange = (restriction: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...prev.dietaryRestrictions, restriction]
        : prev.dietaryRestrictions.filter((r) => r !== restriction),
    }))
  }

  const resetModal = () => {
    setIsModalOpen(false)
    setGeneratedPlan(null)
    setIsGenerating(false)
    setShowConfirmReplace(false)
    setFormData({
      goal: "",
      currentWeight: 0,
      targetWeight: "",
      height: 0,
      age: "",
      activityLevel: "",
      dietaryRestrictions: [],
      allergies: "",
      preferredMeals: "",
      duration: "",
    })
  }

  return (
    <>
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-mint-green" />
                Active Diet Plan
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-mint-green text-snow-white" asChild>
                  <Link href="/nutritionists">
                    <Users className="w-4 h-4 mr-2" />
                    Find Nutritionist
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="text-mint-green" onClick={handleGenerateAIPlan}>
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
                    <h3 className="font-semibold text-soft-coral">{activeDietPlan.name}</h3>
                    <p className="text-sm text-cool-gray">by {activeDietPlan.nutritionist}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-mint-green text-white">
                      Week {activeDietPlan.currentWeek}/{activeDietPlan.duration.split(" ")[0]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-soft-blue">{"Today's Meal Plan"}</h4>
                  <div className="space-y-3">
                    {activeDietPlan.todaysMeals.map((meal, index) => (
                        <div
  key={index}
  className="flex items-center justify-between p-4 bg-cool-gray/10 rounded-2xl border border-border bg-muted/50 hover:shadow-md transition-shadow"
>
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-soft-blue border-soft-blue">
        {meal.type}
      </Badge>
      <span className="text-sm text-cool-gray">{meal.time}</span>
    </div>
    <p className="text-base font-semibold text-foreground">{meal.meal}</p>
  </div>

  <div className="text-right">
    <span className="text-base font-bold text-soft-coral">{meal.calories} cal</span>
  </div>
</div>


                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <ChefHat className="w-16 h-16 text-soft-coral mx-auto mb-4" />
                <h3 className="text-lg font-medium text-soft-coral mb-2">No Active Diet Plan</h3>
                <p className="text-cool-gray mb-4">Get started with a personalized nutrition plan</p>
                <div className="flex gap-2 justify-center">
                  <Button className="bg-soft-blue hover:bg-soft-blue/90 text-snow-white" asChild>
                    <Link href="/nutritionists">Find Nutritionist</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border border-soft-blue bg-transparent"
                    onClick={handleGenerateAIPlan}
                  >
                    Generate AI Plan
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Plan Generation Modal */}
      <Dialog open={isModalOpen} onOpenChange={resetModal}>
        <DialogContent className="max-w-10xl max-h-[90vh] overflow-y-auto bg-snow-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2  text-soft-coral">
              <ChefHat className="w-5 h-5 text-soft-coral" />
              Generate AI Diet Plan
            </DialogTitle>
          </DialogHeader>

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-mint-green animate-spin mb-4" />
              <h3 className="text-lg font-medium mb-2">Generating Your Personalized Plan</h3>
              <p className="text-cool-gray text-center">
                Our AI is analyzing your preferences and creating a customized diet plan just for you...
              </p>
            </div>
          ) : generatedPlan ? (
            <div className="space-y-6">
              <div className="p-4 bg-mint-green/10 rounded-lg">
                <h3 className="font-semibold text-dark-slate-gray mb-2">{generatedPlan.name}</h3>
                <p className="text-sm text-cool-gray mb-3">{generatedPlan.description}</p>
                <Badge className="bg-mint-green text-white">{generatedPlan.duration} program</Badge>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-soft-blue">Sample Daily Meal Plan</h4>
                <div className="space-y-3">
                  {generatedPlan.todaysMeals.map((meal, index) => (
                   <div
  key={index}
  className="flex items-center justify-between p-4 bg-cool-gray/10 rounded-2xl border border-border bg-muted/50 hover:shadow-md transition-shadow"
>
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-soft-blue border-soft-blue">
        {meal.type}
      </Badge>
      <span className="text-sm text-cool-gray">{meal.time}</span>
    </div>
    <p className="text-base font-semibold text-foreground">{meal.meal}</p>
  </div>

  <div className="text-right">
    <span className="text-base font-bold text-soft-coral">{meal.calories} cal</span>
  </div>
</div>

                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-soft-blue">Weekly Goals</h4>
                <ul className="space-y-2">

                  {generatedPlan && generatedPlan?.weeklyGoals?.map((goal, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-mint-green" />
                      <span className="text-sm">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleStartPlan} className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-snow-white">
                  Start This Plan
                </Button>
                <Button variant="outline" onClick={resetModal} className="hover:bg-soft-coral">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal" className="text-soft-blue p-2">Primary Goal</Label>
                  <Select
                    value={formData.goal}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, goal: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent className="bg-snow-white">
                      <SelectItem  className="hover:text-snow-white hover:bg-mint-green" value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem className="hover:text-snow-white hover:bg-mint-green" value="weight-gain">Weight Gain</SelectItem>
                      <SelectItem className="hover:text-snow-white hover:bg-mint-green"value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem className="hover:text-snow-white hover:bg-mint-green"value="maintenance">Maintenance</SelectItem>
                      <SelectItem className="hover:text-snow-white hover:bg-mint-green"value="general-health">General Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration" className="text-soft-blue p-2">Plan Duration</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-snow-white">
                      <SelectItem className="hover:text-snow-white hover:bg-mint-green" value="2-weeks">2 Weeks</SelectItem>
                      <SelectItem className="hover:text-snow-white hover:bg-mint-green"value="4-weeks">4 Weeks</SelectItem>
                      <SelectItem className="hover:text-snow-white hover:bg-mint-green"value="6-weeks">6 Weeks</SelectItem>
                      <SelectItem className="hover:text-snow-white hover:bg-mint-green"value="8-weeks">8 Weeks</SelectItem>
                      <SelectItem className="hover:text-snow-white hover:bg-mint-green"value="12-weeks">12 Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

            


              <div>
                <Label htmlFor="activityLevel" className="text-soft-blue p-2"> Activity Level</Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, activityLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent className="bg-snow-white">
                    <SelectItem className="hover:text-snow-white hover:bg-mint-green"value="sedentary">Sedentary (little/no exercise)</SelectItem>
                    <SelectItem className="hover:text-snow-white hover:bg-mint-green"value="light">Light (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem className="hover:text-snow-white hover:bg-mint-green"value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem className="hover:text-snow-white hover:bg-mint-green"value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem className="hover:text-snow-white hover:bg-mint-green"value="very-active">Very Active (very hard exercise, physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

             <div className="p-4 rounded-2xl  shadow-sm border border-muted">
  <Label className="text-lg font-semibold text-soft-blue mb-3 block">Dietary Restrictions</Label>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
    {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Low-Carb"].map((restriction) => (
      <label
        key={restriction}
        htmlFor={restriction}
        className="flex items-center gap-3 p-3 rounded-xl  bg-muted/40 hover:bg-muted transition-all cursor-pointer"
      >
        <Checkbox
          id={restriction}
          checked={formData.dietaryRestrictions.includes(restriction)}
          onCheckedChange={(checked) => handleDietaryRestrictionChange(restriction, checked as boolean)}
        />
        <span className="text-sm text-foreground">{restriction}</span>
      </label>
    ))}
  </div>
</div>

              <div>
                <Label htmlFor="allergies" className="text-soft-blue p-2">Food Allergies</Label>
                <Input
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
                  placeholder="e.g., nuts, shellfish, eggs"
                />
              </div>

              <div>
                <Label htmlFor="preferredMeals" className="text-soft-blue p-2">Preferred Meals/Cuisines</Label>
                <Textarea
                  id="preferredMeals"
                  value={formData.preferredMeals}
                  onChange={(e) => setFormData((prev) => ({ ...prev, preferredMeals: e.target.value }))}
                  placeholder="Tell us about your favorite foods, cuisines, or specific meals you'd like to include..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-snow-white">
                  Generate Plan
                </Button>
                <Button type="button" variant="outline" className="hover:bg-soft-coral" onClick={resetModal}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Replace Dialog */}
      <Dialog open={showConfirmReplace} onOpenChange={setShowConfirmReplace}>
        <DialogContent className="max-w-md bg-snow-white">
          <DialogHeader>
            <DialogTitle className="text-soft-coral">Replace Current Diet Plan?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-cool-gray">
              You currently have an active diet plan. Starting a new plan will replace your current progress. Are you
              sure you want to continue?
            </p>
            <div className="flex gap-3">
              <Button onClick={handleConfirmReplace} className="flex-1 bg-soft-blue hover:bg-soft-blue/90 text-snow-white">
                Yes, Replace Plan
              </Button>
              <Button variant="outline" onClick={() => setShowConfirmReplace(false)} className="hover:bg-soft-coral">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
