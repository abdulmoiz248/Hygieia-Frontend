"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Scale, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "@/store/patient/store"
import { addCalories } from "@/types/patient/fitnessSlice"
import { Flame, Apple } from "lucide-react"
import { AiCalorieEstimate } from './action'
import { patientSuccess } from "@/toasts/PatientToast"

type NutritionInfo = {
  calories: number
  carbs: number
  protein: number
  fat: number
}

export default function Calories() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const caloriesConsumed = useSelector((state: RootState) => state.fitness.caloriesConsumed)
  const caloriesBurned = useSelector((state: RootState) => state.fitness.caloriesBurned)
  const dispatch = useDispatch<AppDispatch>()
  const [showCalorieTracker, setShowCalorieTracker] = useState(false)

  const [type, setType] = useState<"consumed" | "burned" | "">("")
  const [desc, setDesc] = useState("")
  const [generatedNutrition, setGeneratedNutrition] = useState<NutritionInfo | null>(null)
  const [loading, setLoading] = useState(false)




  const handleTypeChange = (val: "consumed" | "burned") => {
  setType(val);
  setGeneratedNutrition(null); // clear old values when switching type
};

const handleGenerateCalories = async () => {
  if (!desc.trim()) return;
  setLoading(true);

  const nutrition: NutritionInfo = await AiCalorieEstimate(desc) || { 
    calories: 0, carbs: 0, protein: 0, fat: 0 
  };

  setLoading(false);

  if (type === "burned") {
    setGeneratedNutrition({
      calories: nutrition.calories,
      carbs: 0,
      protein: 0,
      fat: 0
    });
  } else {
    setGeneratedNutrition(nutrition);
  }
};


  const handleAddCalories = () => {
    if (!type || !generatedNutrition || generatedNutrition.calories <= 0) return

    dispatch(addCalories({ 
      type, 
      amount: generatedNutrition.calories, 
      carbs: generatedNutrition.carbs, 
      protein: generatedNutrition.protein, 
      fat: generatedNutrition.fat 
    }))
    patientSuccess("Calories and macros added successfully")
    setType("")
    setDesc("")
    setGeneratedNutrition(null)
    setShowCalorieTracker(false)
  }

  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-white/40">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-soft-coral" />
              Calorie Tracking
            </div>
            <Dialog open={showCalorieTracker} onOpenChange={setShowCalorieTracker}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-mint-green text-snow-white hover:bg-mint-green/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Meal
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-snow-white">
                <DialogHeader>
                  <DialogTitle className="text-soft-coral">Add Calories</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleTypeChange("consumed")}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          type === "consumed"
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <Apple className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-sm font-medium">Consumed</div>
                      </button>
                      <button
                        onClick={() => handleTypeChange("burned")}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          type === "burned"
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <Flame className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-sm font-medium">Burned</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-soft-blue">What did you do / eat?</label>
                    <Input
                      placeholder="e.g. Briyani..."
                      value={desc}
                      onChange={e => {
                        setDesc(e.target.value)
                        setGeneratedNutrition(null)
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full bg-soft-blue text-snow-white hover:bg-soft-blue/90"
                    onClick={handleGenerateCalories}
                    disabled={loading || !desc.trim() || !type}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {loading ? "Thinking..." : "Ask AI"}
                  </Button>

              {generatedNutrition && (
  <div className="text-center text-soft-coral text-sm font-semibold space-y-1">
    <div>Estimated Calories: {generatedNutrition.calories} kcal</div>
    {type === "consumed" && (
      <>
        <div>Carbs: {generatedNutrition.carbs} g</div>
        <div>Protein: {generatedNutrition.protein} g</div>
        <div>Fat: {generatedNutrition.fat} g</div>
      </>
    )}
  </div>
)}



                  {generatedNutrition !== null && (
                    <Button
                      className="w-full bg-mint-green text-snow-white hover:bg-mint-green/90"
                      onClick={handleAddCalories}
                    >
                      Add Calories
                    </Button>
                  )}
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
                className={`text-3xl font-bold mb-2 ${
                  caloriesConsumed - caloriesBurned > 0
                    ? "text-dark-slate-gray"
                    : "text-mint-green"
                }`}
              >
                {caloriesConsumed - caloriesBurned}
              </div>
              <p className="text-sm text-cool-gray">Net Calories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
