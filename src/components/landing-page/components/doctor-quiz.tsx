"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Stethoscope, Award, Heart, AlertCircle, CheckCircle2, XCircle } from "lucide-react"

type Scenario = {
  id: number
  symptoms: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const scenarios: Scenario[] = [
  {
    id: 1,
    symptoms: "A patient says 🥵 + 🤒. What might they have?",
    options: ["Common cold", "Flu", "Allergies", "Food poisoning"],
    correctAnswer: 1,
    explanation: "Great job! It's likely flu. Prescribe rest & fluids.",
  },
  {
    id: 2,
    symptoms: "A patient reports 🤧 + 👁️ (itchy). What's the diagnosis?",
    options: ["Conjunctivitis", "Seasonal allergies", "Sinus infection", "Common cold"],
    correctAnswer: 1,
    explanation: "Correct! Seasonal allergies often cause sneezing and itchy eyes.",
  },
  {
    id: 3,
    symptoms: "Patient has 🤢 + 🤮 + 🌡️ (no fever). Likely cause?",
    options: ["Appendicitis", "Food poisoning", "Migraine", "Stomach flu"],
    correctAnswer: 1,
    explanation: "That's right! Food poisoning typically causes nausea and vomiting without fever.",
  },
]

export default function DoctorQuiz() {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(scenarios[0])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Calculate progress percentage
    setProgress((scenarioIndex / scenarios.length) * 100)
  }, [scenarioIndex])

  const handleSubmit = () => {
    if (selectedOption === null) return

    const correct = selectedOption === currentScenario.correctAnswer
    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }

    setShowResult(true)
  }

  const nextScenario = () => {
    const nextIndex = scenarioIndex + 1

    if (nextIndex < scenarios.length) {
      setScenarioIndex(nextIndex)
      setCurrentScenario(scenarios[nextIndex])
    } else {
      // Reset to first scenario
      setScenarioIndex(0)
      setCurrentScenario(scenarios[0])
    }

    setSelectedOption(null)
    setShowResult(false)
  }

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
  }

  return (
    <section className="py-20 min-h-screen bg-gradient-to-b from-blue-100 via-indigo-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-full shadow-xl"
            >
              <Stethoscope className="h-14 w-14 text-white" />
            </motion.div>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-4">
            Interactive Diagnosis Game
          </h2>
          <p className="text-xl text-blue-800 max-w-2xl mx-auto font-medium">
            Test your medical knowledge with our "Play Doctor" mini-game
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-blue-700">Progress</span>
            <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              {scenarioIndex + 1}/{scenarios.length}
            </span>
          </div>
          <Progress
            value={progress}
            className="h-3 bg-blue-100 rounded-full"
            indicatorclassname="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <Card className="border-blue-200 shadow-2xl overflow-hidden rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white border-b border-blue-400 py-6">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                  >
                    <Heart className="h-6 w-6 text-red-300 fill-red-300" />
                  </motion.div>
                  Play Doctor
                </CardTitle>
                <CardDescription className="text-blue-100 text-base">
                  Diagnose the patient based on their symptoms
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <motion.div variants={itemVariants} className="mb-6">
                    <h3 className="text-xl text-blue-900 font-bold mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500 shadow-md">
                      {currentScenario.symptoms}
                    </h3>

                    <RadioGroup
                      value={selectedOption?.toString()}
                      onValueChange={(value) => setSelectedOption(Number.parseInt(value))}
                      className="space-y-4 mt-6"
                      disabled={showResult}
                    >
                      {currentScenario.options.map((option, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => !showResult && setSelectedOption(index)}
                          className={`cursor-pointer flex items-center space-x-3 p-4 rounded-xl border-2 ${
                            showResult && index === currentScenario.correctAnswer
                              ? "border-green-500 bg-green-100"
                              : showResult && selectedOption === index && index !== currentScenario.correctAnswer
                                ? "border-red-500 bg-red-100"
                                : selectedOption === index
                                  ? "border-blue-500 bg-blue-100 shadow-md"
                                  : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                        >
                          <div className="flex-1 flex items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                                selectedOption === index
                                  ? showResult && index !== currentScenario.correctAnswer
                                    ? "bg-red-500"
                                    : "bg-blue-600"
                                  : "border-2 border-gray-300"
                              }`}
                            >
                              {selectedOption === index && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-3 h-3 bg-white rounded-full"
                                />
                              )}
                            </div>
                            <Label
                              htmlFor={`option-${index}`}
                              className={`text-lg cursor-pointer ${
                                showResult && index === currentScenario.correctAnswer
                                  ? "text-green-700 font-bold"
                                  : showResult && selectedOption === index && index !== currentScenario.correctAnswer
                                    ? "text-red-700 font-bold"
                                    : selectedOption === index
                                      ? "text-blue-800 font-bold"
                                      : "text-blue-900"
                              }`}
                            >
                              {option}
                            </Label>
                          </div>
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} className="sr-only" />
                          {showResult && index === currentScenario.correctAnswer && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <CheckCircle2 className="h-7 w-7 text-green-600" />
                            </motion.div>
                          )}
                          {showResult && selectedOption === index && index !== currentScenario.correctAnswer && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <XCircle className="h-7 w-7 text-red-600" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </RadioGroup>
                  </motion.div>

                  <AnimatePresence>
                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className={`p-5 rounded-lg mt-6 ${
                          isCorrect
                            ? "bg-green-100 border-2 border-green-300 text-green-800"
                            : "bg-red-100 border-2 border-red-300 text-red-800"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{
                                scale: [0, 1.2, 1],
                                rotate: [0, 10, 0],
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              <CheckCircle2 className="h-7 w-7 text-green-600 mt-0.5 flex-shrink-0" />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{
                                scale: [0, 1.2, 1],
                                rotate: [0, -10, 0],
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              <AlertCircle className="h-7 w-7 text-red-600 mt-0.5 flex-shrink-0" />
                            </motion.div>
                          )}
                          <p className="font-bold text-lg">
                            {isCorrect
                              ? currentScenario.explanation
                              : "Not quite right. The correct answer is " +
                                currentScenario.options[currentScenario.correctAnswer] +
                                "."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t border-blue-100 bg-blue-50 py-4 px-6">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      rotate: [0, 10, 0, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                  >
                    <Award className="h-7 w-7 text-yellow-500 drop-shadow-md" />
                  </motion.div>
                  <motion.span
                    key={score}
                    initial={{ scale: 1.5, y: -10, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    className="font-bold text-xl text-blue-700"
                  >
                    Score: {score}
                  </motion.span>
                </div>

                {!showResult ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleSubmit}
                      disabled={selectedOption === null}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-bold px-8 py-6 h-auto shadow-lg"
                    >
                      Submit Diagnosis
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={nextScenario}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-bold px-8 py-6 h-auto shadow-lg"
                    >
                      Next Patient
                    </Button>
                  </motion.div>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>

        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {Array.from({ length: 100 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -20,
                    scale: Math.random() * 1 + 0.5,
                    rotate: Math.random() * 360,
                  }}
                  animate={{
                    y: window.innerHeight + 20,
                    rotate: Math.random() * 360 + 360,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    ease: "easeOut",
                  }}
                  className="absolute"
                  style={{
                    width: `${Math.random() * 15 + 5}px`,
                    height: `${Math.random() * 15 + 5}px`,
                    borderRadius: Math.random() > 0.5 ? "50%" : "0",
                    backgroundColor: [
                      "#4338ca", // indigo
                      "#1d4ed8", // blue
                      "#059669", // emerald
                      "#d97706", // amber
                      "#db2777", // pink
                      "#7c3aed", // violet
                    ][Math.floor(Math.random() * 6)],
                  }}
                />
              ))}
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-blue-600">Continue playing to improve your diagnostic skills!</p>
        </motion.div>
      </div>
    </section>
  )
}
