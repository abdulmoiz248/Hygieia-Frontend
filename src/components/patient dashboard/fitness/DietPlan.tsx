"use client"

import type React from "react"
import { ChefHat,  Check, Clock, Target, Activity, Utensils, AlertCircle, Sparkles, Calendar } from 'lucide-react';
import { useState } from "react"
import { motion } from "framer-motion"
import {  Users } from "lucide-react"
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
import {  useSelector } from "react-redux"
import type { RootState } from "@/store/patient/store"
import { patientSuccess } from "@/toasts/PatientToast"


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
  age: number | string
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
   const user=useSelector((state: RootState) => state.profile)

  const [formData, setFormData] = useState<FormData>({
    goal: "",
    currentWeight: user.weight,
    targetWeight: "",
    height: user.height,
    age : user.dateOfBirth
  ? Math.floor(
      (new Date().getTime() - new Date(user.dateOfBirth).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25)
    )
  : "",
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
      patientSuccess("New Diet Plan Started")
    }
  }

  const handleConfirmReplace = () => {
    setActiveDietPlan(generatedPlan)
    setShowConfirmReplace(false)
    setIsModalOpen(false)
    setGeneratedPlan(null)
       patientSuccess("New Diet Plan Started")
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
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
  <div className="flex items-center gap-2">
    <ChefHat className="w-5 h-5 text-mint-green" />
    <span className="text-base sm:text-lg">Active Diet Plan</span>
  </div>
  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
    <Button
      variant="outline"
      size="sm"
      className="bg-mint-green text-snow-white w-full sm:w-auto"
      asChild
    >
      <Link href="/nutritionists">
        <Users className="w-4 h-4 mr-2" />
        Find Nutritionist
      </Link>
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="text-mint-green w-full sm:w-auto"
      onClick={handleGenerateAIPlan}
    >
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
 <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[850px] xl:max-w-[1000px] 2xl:max-w-[1100px] max-h-[90vh] overflow-y-auto px-4 md:px-6 pt-6 pb-8 bg-snow-white rounded-3xl shadow-2xl border-0">
   <DialogHeader className="mb-6 relative">
     <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-mint-green/20 to-soft-coral/20 rounded-full blur-xl"></div>
     <div className="absolute -top-1 -right-1 w-16 h-16 bg-gradient-to-bl from-soft-blue/20 to-mint-green/20 rounded-full blur-lg"></div>
     <DialogTitle className="flex items-center gap-3 text-soft-coral text-2xl font-bold relative z-10">
       <div className="p-2 bg-gradient-to-br from-soft-coral/10 to-soft-coral/20 rounded-xl">
         <ChefHat className="w-7 h-7 text-soft-coral" />
       </div>
       <span className="bg-gradient-to-r from-soft-coral to-soft-blue bg-clip-text text-transparent">
         Generate AI Diet Plan
       </span>
       <Sparkles className="w-5 h-5 text-mint-green animate-pulse" />
     </DialogTitle>
   </DialogHeader>

   {isGenerating ? (
     <div className="flex flex-col items-center justify-center py-20 relative">
       <div className="absolute inset-0 bg-gradient-to-br from-mint-green/5 via-transparent to-soft-blue/5 rounded-2xl"></div>
       <div className="relative z-10 text-center">
      
         <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-dark-slate-gray to-soft-blue bg-clip-text text-transparent">
           Generating Your Personalized Plan
         </h3>
         <p className="text-cool-gray text-center max-w-md leading-relaxed">
           Our AI is analyzing your preferences and creating a customized diet plan just for you...
         </p>
         <div className="mt-6 flex justify-center gap-2">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="w-2 h-2 bg-mint-green rounded-full animate-bounce" style={{animationDelay: `${i * 0.2}s`}}></div>
           ))}
         </div>
       </div>
     </div>
   ) : generatedPlan ? (
     <div className="space-y-8">
       <div className="relative overflow-hidden p-6 bg-gradient-to-br from-mint-green/10 via-mint-green/5 to-transparent rounded-2xl border border-mint-green/30 shadow-lg">
         <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-mint-green/20 to-transparent rounded-full blur-2xl"></div>
         <div className="relative z-10">
           <div className="flex items-start justify-between mb-4">
             <div>
               <h3 className="font-bold text-xl text-dark-slate-gray mb-2">{generatedPlan.name}</h3>
               <p className="text-cool-gray mb-3 leading-relaxed">{generatedPlan.description}</p>
             </div>
             <Calendar className="w-6 h-6 text-mint-green opacity-60" />
           </div>
           <Badge className="bg-gradient-to-r from-mint-green to-mint-green/90 text-white shadow-md hover:shadow-lg transition-all px-4 py-1.5 text-sm font-medium">
             {generatedPlan.duration} program
           </Badge>
         </div>
       </div>

       <div className="space-y-4">
         <div className="flex items-center gap-2 mb-4">
           <Utensils className="w-5 h-5 text-soft-blue" />
           <h4 className="text-soft-blue font-bold text-xl">Sample Daily Meal Plan</h4>
         </div>
         <div className="space-y-3">
           {generatedPlan.todaysMeals.map((meal, index) => (
             <div
               key={index}
               className="group relative overflow-hidden p-5 bg-gradient-to-r from-white to-cool-gray/5 rounded-2xl border border-cool-gray/20 hover:shadow-lg hover:border-soft-blue/30 transition-all duration-300 hover:-translate-y-1"
             >
               <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-soft-coral to-mint-green"></div>
               <div className="flex items-center justify-between">
                 <div className="space-y-2 flex-1">
                   <div className="flex items-center gap-3">
                     <Badge variant="outline" className="text-soft-blue border-soft-blue/50 bg-soft-blue/5 font-medium px-3 py-1">
                       {meal.type}
                     </Badge>
                     <div className="flex items-center gap-1 text-sm text-cool-gray">
                       <Clock className="w-3 h-3" />
                       {meal.time}
                     </div>
                   </div>
                   <p className="text-base font-semibold text-foreground group-hover:text-soft-blue transition-colors">
                     {meal.meal}
                   </p>
                 </div>
                 <div className="text-right ml-4">
                   <div className="bg-gradient-to-r from-soft-coral to-soft-coral/80 text-white px-3 py-2 rounded-xl shadow-md">
                     <span className="text-lg font-bold">{meal.calories}</span>
                     <span className="text-sm block">calories</span>
                   </div>
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>

       <div className="space-y-4">
         <div className="flex items-center gap-2 mb-4">
           <Target className="w-5 h-5 text-soft-blue" />
           <h4 className="text-soft-blue font-bold text-xl">Weekly Goals</h4>
         </div>
         <div className="bg-gradient-to-r from-soft-blue/5 to-transparent p-6 rounded-2xl border border-soft-blue/20">
           <ul className="space-y-3">
             {generatedPlan.weeklyGoals && generatedPlan.weeklyGoals.map((goal, index) => (
               <li key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-all">
                 <div className="w-6 h-6 bg-mint-green rounded-full flex items-center justify-center shadow-md">
                   <Check className="w-4 h-4 text-white" />
                 </div>
                 <span className="text-foreground font-medium">{goal}</span>
               </li>
             ))}
           </ul>
         </div>
       </div>

       <div className="flex gap-4 pt-6">
         <Button 
           onClick={handleStartPlan} 
           className="flex-1 bg-gradient-to-r from-soft-blue to-soft-blue/90 hover:from-soft-blue/90 hover:to-soft-blue text-snow-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
         >
           <Sparkles className="w-4 h-4 mr-2" />
           Start This Plan
         </Button>
         <Button 
           variant="outline" 
           onClick={resetModal} 
           className="hover:bg-soft-coral hover:text-white hover:border-soft-coral transition-all duration-300 py-3 px-6 rounded-xl font-semibold"
         >
           Cancel
         </Button>
       </div>
     </div>
   ) : (
     <form onSubmit={handleFormSubmit} className="space-y-8">
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         <div className="space-y-2">
           <div className="flex items-center gap-2">
             <Target className="w-4 h-4 text-soft-blue" />
             <Label htmlFor="goal" className="text-soft-blue font-semibold">Primary Goal</Label>
           </div>
           <Select value={formData.goal} onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}>
             <SelectTrigger className="h-12 rounded-xl border-2 border-cool-gray/20 hover:border-soft-blue/50 transition-all">
               <SelectValue placeholder="Select your goal" />
             </SelectTrigger>
             <SelectContent className="bg-snow-white rounded-xl border-2 shadow-xl">
               {["weight-loss", "weight-gain", "muscle-gain", "maintenance", "general-health"].map(goal => (
                 <SelectItem key={goal} value={goal} className="hover:text-snow-white hover:bg-mint-green rounded-lg m-1 capitalize font-medium">
                   {goal.replace("-", " ")}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>

         <div className="space-y-2">
           <div className="flex items-center gap-2">
             <Calendar className="w-4 h-4 text-soft-blue" />
             <Label htmlFor="duration" className="text-soft-blue font-semibold">Plan Duration</Label>
           </div>
           <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
             <SelectTrigger className="h-12 rounded-xl border-2 border-cool-gray/20 hover:border-soft-blue/50 transition-all">
               <SelectValue placeholder="Select duration" />
             </SelectTrigger>
             <SelectContent className="bg-snow-white rounded-xl border-2 shadow-xl">
               {["2-weeks", "4-weeks", "6-weeks", "8-weeks", "12-weeks"].map(duration => (
                 <SelectItem key={duration} value={duration} className="hover:text-snow-white hover:bg-mint-green rounded-lg m-1 font-medium">
                   {duration.replace("-", " ")}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
       </div>

       <div className="space-y-2">
         <div className="flex items-center gap-2">
           <Activity className="w-4 h-4 text-soft-blue" />
           <Label htmlFor="activityLevel" className="text-soft-blue font-semibold">Activity Level</Label>
         </div>
         <Select value={formData.activityLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, activityLevel: value }))}>
           <SelectTrigger className="h-12 rounded-xl border-2 border-cool-gray/20 hover:border-soft-blue/50 transition-all">
             <SelectValue placeholder="Select activity level" />
           </SelectTrigger>
           <SelectContent className="bg-snow-white rounded-xl border-2 shadow-xl">
             {[
               { value: "sedentary", label: "Sedentary (little/no exercise)" },
               { value: "light", label: "Light (light exercise 1-3 days/week)" },
               { value: "moderate", label: "Moderate (3-5 days/week)" },
               { value: "active", label: "Active (6-7 days/week)" },
               { value: "very-active", label: "Very Active (physical job or intense training)" },
             ].map(({ value, label }) => (
               <SelectItem key={value} value={value} className="hover:text-snow-white hover:bg-mint-green rounded-lg m-1 font-medium">
                 {label}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
       </div>

       <div className="relative p-6 rounded-2xl shadow-sm border-2 border-mint-green/20 bg-gradient-to-br from-mint-green/5 to-transparent">
         <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-mint-green/20 to-transparent rounded-full blur-xl"></div>
         <div className="relative z-10">
           <div className="flex items-center gap-2 mb-4">
             <AlertCircle className="w-5 h-5 text-soft-blue" />
             <Label className="text-xl font-bold text-soft-blue">Dietary Restrictions</Label>
           </div>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
             {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Low-Carb"].map((restriction) => (
               <label
                 key={restriction}
                 htmlFor={restriction}
                 className="group flex items-center gap-3 p-4 rounded-xl bg-white/60 hover:bg-white/80 hover:shadow-md transition-all cursor-pointer border border-cool-gray/20 hover:border-mint-green/40"
               >
                 <Checkbox
                   id={restriction}
                   checked={formData.dietaryRestrictions.includes(restriction)}
                   onCheckedChange={(checked:boolean) =>
                     handleDietaryRestrictionChange(restriction, checked)
                   }
                   className="w-5 h-5"
                 />
                 <span className="text-sm font-medium text-foreground group-hover:text-soft-blue transition-colors">{restriction}</span>
               </label>
             ))}
           </div>
         </div>
       </div>

       <div className="space-y-2">
         <div className="flex items-center gap-2">
           <AlertCircle className="w-4 h-4 text-soft-coral" />
           <Label htmlFor="allergies" className="text-soft-blue font-semibold">Food Allergies</Label>
         </div>
         <Input
           id="allergies"
           value={formData.allergies}
           onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
           placeholder="e.g., nuts, shellfish, eggs"
           className="h-12 rounded-xl border-2 border-cool-gray/20 hover:border-soft-blue/50 focus:border-soft-blue transition-all"
         />
       </div>

       <div className="space-y-2">
         <div className="flex items-center gap-2">
           <Utensils className="w-4 h-4 text-soft-blue" />
           <Label htmlFor="preferredMeals" className="text-soft-blue font-semibold">Preferred Meals/Cuisines</Label>
         </div>
         <Textarea
           id="preferredMeals"
           value={formData.preferredMeals}
           onChange={(e) => setFormData((prev) => ({ ...prev, preferredMeals: e.target.value }))}
           placeholder="Tell us your favorite meals or cuisines..."
           rows={3}
           className="rounded-xl border-2 border-cool-gray/20 hover:border-soft-blue/50 focus:border-soft-blue transition-all resize-none"
         />
       </div>

       <div className="flex gap-4 pt-6">
         <Button 
           type="submit" 
           className="flex-1 bg-gradient-to-r from-soft-blue to-soft-blue/90 hover:from-soft-blue/90 hover:to-soft-blue text-snow-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
         >
           <Sparkles className="w-4 h-4 mr-2" />
           Generate Plan
         </Button>
         <Button 
           type="button" 
           variant="outline" 
           onClick={resetModal} 
           className="hover:bg-soft-coral hover:text-white hover:border-soft-coral transition-all duration-300 py-3 px-6 rounded-xl font-semibold"
         >
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
