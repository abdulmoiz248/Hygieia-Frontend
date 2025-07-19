"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Pill, Plus, Clock, CheckCircle, Calendar, Bell, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface Medicine {
  id: string
  name: string
  dosage: string
  time: string
  taken: boolean
  frequency: string
  instructions?: string
}

export default function MedicineTrackerPage() {
  const [showLogDose, setShowLogDose] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState("")
  const [doseTaken, setDoseTaken] = useState("")

  // Mock today's medications with state management
  const [todaysMeds, setTodaysMeds] = useState<Medicine[]>([
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      time: "8:00 AM",
      taken: true,
      frequency: "Once daily",
      instructions: "Take with food",
    },
    {
      id: "2",
      name: "Metformin",
      dosage: "500mg",
      time: "12:00 PM",
      taken: false,
      frequency: "Twice daily",
      instructions: "Take with meals",
    },
    {
      id: "3",
      name: "Vitamin D",
      dosage: "1000 IU",
      time: "6:00 PM",
      taken: false,
      frequency: "Once daily",
      instructions: "Take with dinner",
    },
    {
      id: "4",
      name: "Aspirin",
      dosage: "81mg",
      time: "8:00 PM",
      taken: false,
      frequency: "Once daily",
      instructions: "Take with food",
    },
  ])

  const weeklyProgress = 85 // Mock weekly adherence

  const toggleMedicineTaken = (medicineId: string) => {
    setTodaysMeds((prev) => prev.map((med) => (med.id === medicineId ? { ...med, taken: !med.taken } : med)))
  }

  const takenCount = todaysMeds.filter((med) => med.taken).length
  const totalCount = todaysMeds.length
  const todayProgress = (takenCount / totalCount) * 100

  const upcomingMeds = todaysMeds.filter((med) => !med.taken)
  const nextMedicine = upcomingMeds.length > 0 ? upcomingMeds[0] : null

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-slate-gray">Medicine Tracker</h1>
          <p className="text-cool-gray">Track your medications and stay on schedule</p>
        </div>

        <Dialog open={showLogDose} onOpenChange={setShowLogDose}>
          <DialogTrigger asChild>
            <Button className="bg-mint-green hover:bg-mint-green/90">
              <Plus className="w-4 h-4 mr-2" />
              Log Dose
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Today&apos;s Dose</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Medicine Name</label>
                <Input
                  placeholder="Search medicine..."
                  value={selectedMedicine}
                  onChange={(e) => setSelectedMedicine(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Dosage Taken</label>
                <Input
                  placeholder="e.g., 10mg, 1 tablet"
                  value={doseTaken}
                  onChange={(e) => setDoseTaken(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Time Taken</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8:00 AM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12:00 PM)</SelectItem>
                    <SelectItem value="evening">Evening (6:00 PM)</SelectItem>
                    <SelectItem value="night">Night (10:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-mint-green hover:bg-mint-green/90">Log Dose</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Today's Progress Overview */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-mint-green/10 to-soft-blue/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-dark-slate-gray">Today&apos;s Progress</h3>
                <p className="text-cool-gray">
                  {takenCount} of {totalCount} medications taken
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-mint-green">{Math.round(todayProgress)}%</div>
                <p className="text-sm text-cool-gray">Complete</p>
              </div>
            </div>
            <Progress value={todayProgress} className="h-3 mb-4" />

            {nextMedicine && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Bell className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Next: {nextMedicine.name}</p>
                  <p className="text-sm text-yellow-600">
                    {nextMedicine.dosage} at {nextMedicine.time}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-soft-blue" />
                Today&apos;s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysMeds.map((med) => (
                <motion.div
                  key={med.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    med.taken ? "border-mint-green/30 bg-mint-green/5" : "border-gray-200 hover:border-soft-blue/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id={med.id} checked={med.taken} onCheckedChange={() => toggleMedicineTaken(med.id)} />
                      </div>

                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          med.taken ? "bg-mint-green/20" : "bg-gray-100"
                        }`}
                      >
                        {med.taken ? (
                          <CheckCircle className="w-6 h-6 text-mint-green" />
                        ) : (
                          <Pill className="w-6 h-6 text-cool-gray" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-dark-slate-gray">{med.name}</h3>
                        <p className="text-sm text-cool-gray">
                          {med.dosage} • {med.time}
                        </p>
                        <p className="text-xs text-cool-gray">{med.frequency}</p>
                        {med.instructions && <p className="text-xs text-blue-600 mt-1">{med.instructions}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {med.taken ? (
                        <Badge className="bg-mint-green text-white">Taken</Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-mint-green hover:bg-mint-green/90"
                          onClick={() => toggleMedicineTaken(med.id)}
                        >
                          Mark Taken
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Progress & Reminders */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-soft-coral" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-soft-coral mb-2">{weeklyProgress}%</div>
                <p className="text-sm text-cool-gray">Adherence Rate</p>
              </div>

              <Progress value={weeklyProgress} className="h-3" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Doses taken</span>
                  <span className="font-medium">17/20</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Missed doses</span>
                  <span className="font-medium text-soft-coral">3</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">This Week</h4>
                <div className="grid grid-cols-7 gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                    <div
                      key={`${day}-${index}`}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        index < 5
                          ? "bg-mint-green text-white"
                          : index === 5
                            ? "bg-soft-coral text-white"
                            : "bg-gray-200 text-cool-gray"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medication Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Daily Reminders</span>
                </div>
                <Badge className="bg-yellow-600 text-white">ON</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Reminder Times:</p>
                <div className="space-y-1">
                  <div className="text-sm text-cool-gray">• 8:00 AM - Morning meds</div>
                  <div className="text-sm text-cool-gray">• 12:00 PM - Afternoon meds</div>
                  <div className="text-sm text-cool-gray">• 6:00 PM - Evening meds</div>
                  <div className="text-sm text-cool-gray">• 8:00 PM - Night meds</div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Bell className="w-4 h-4 mr-2" />
                Manage Reminders
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Medication History */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-mint-green" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { medicine: "Lisinopril 10mg", time: "8:00 AM", status: "taken", date: "Today" },
                { medicine: "Vitamin D 1000 IU", time: "6:00 PM", status: "taken", date: "Yesterday" },
                { medicine: "Metformin 500mg", time: "12:00 PM", status: "missed", date: "Yesterday" },
                { medicine: "Aspirin 81mg", time: "8:00 PM", status: "taken", date: "2 days ago" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.status === "taken" ? "bg-mint-green/20" : "bg-soft-coral/20"
                      }`}
                    >
                      {item.status === "taken" ? (
                        <CheckCircle className="w-5 h-5 text-mint-green" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-soft-coral" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-dark-slate-gray">{item.medicine}</h3>
                      <p className="text-sm text-cool-gray">
                        {item.time} • {item.date}
                      </p>
                    </div>
                  </div>
                  <Badge className={item.status === "taken" ? "bg-mint-green text-white" : "bg-soft-coral text-white"}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
