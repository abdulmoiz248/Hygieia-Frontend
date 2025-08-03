"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Scale } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store/patient/store"
import { addCalories } from "@/types/patient/fitnessSlice"


export default function Calories() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const caloriesConsumed = useSelector((state: RootState) => state.fitness.caloriesConsumed)
  const caloriesBurned = useSelector((state: RootState) => state.fitness.caloriesBurned)
  const dispatch = useDispatch()
  const [showCalorieTracker, setShowCalorieTracker] = useState(false)


const [type, setType] = useState<"consumed" | "burned" | "">("")

  const [amount, setAmount] = useState("")
  const [desc, setDesc] = useState("")

const handleAddCalories = () => {
  const numAmount = parseInt(amount)
  if (!type || !numAmount || numAmount <= 0) return

  dispatch(addCalories({ type , amount: numAmount }))

  setType("")
  setAmount("")
  setDesc("")
  setShowCalorieTracker(false)
}

const handleTypeChange = (val: string) => {
  if (val === "consumed" || val === "burned") {
    setType(val)
  }
}

  return (
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
                <Button variant="outline" size="sm" className="bg-mint-green text-snow-white hover:bg-mint-green/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Calories
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-snow-white">
                <DialogHeader>
                  <DialogTitle className="text-soft-coral">Add Calories</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-soft-blue">Type</label>
                    <Select value={type} onValueChange={handleTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-snow-white">
                        <SelectItem className="hover:bg-mint-green hover:text-snow-white" value="consumed">Calories Consumed</SelectItem>
                        <SelectItem  className="hover:bg-mint-green hover:text-snow-white"value="burned">Calories Burned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-soft-blue">Amount</label>
                    <Input
                      type="number"
                      placeholder="250"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-soft-blue">Description</label>
                    <Input
                      placeholder="e.g., Lunch, 30min run"
                      value={desc}
                      onChange={e => setDesc(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full bg-soft-blue text-snow-white hover:bg-soft-blue/90"
                    onClick={handleAddCalories}
                  >
                    Add Calories
                  </Button>
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
