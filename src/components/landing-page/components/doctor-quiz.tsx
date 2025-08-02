"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Stethoscope, Award, Heart, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import type { Variants } from "framer-motion"


type Scenario = {
  id: number
  symptoms: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

const scenarios: Scenario[] = [
  {
    id: 1,
    symptoms: "A patient says 🥵 + 🤒. What might they have?",
    options: ["Common cold", "Flu", "Allergies", "Food poisoning"],
    correctAnswer: 1,
    explanation: "Great job! It's likely flu. Prescribe rest & fluids.",
    difficulty: "easy",
  },
  {
    id: 2,
    symptoms: "A patient reports 🤧 + 👁️ (itchy). What's the diagnosis?",
    options: ["Conjunctivitis", "Seasonal allergies", "Sinus infection", "Common cold"],
    correctAnswer: 1,
    explanation: "Correct! Seasonal allergies often cause sneezing and itchy eyes.",
    difficulty: "easy",
  },
  {
    id: 3,
    symptoms: "Patient has 🤢 + 🤮 + 🌡️ (no fever). Likely cause?",
    options: ["Appendicitis", "Food poisoning", "Migraine", "Stomach flu"],
    correctAnswer: 1,
    explanation: "That's right! Food poisoning typically causes nausea and vomiting without fever.",
    difficulty: "easy",
  },
  {
    id: 4,
    symptoms: "Patient presents with 🤕 + 🌀 (dizziness) + 🤮 after head injury",
    options: ["Migraine", "Concussion", "Ear infection", "Anxiety attack"],
    correctAnswer: 1,
    explanation: "Correct! These are classic symptoms of concussion following head trauma.",
    difficulty: "medium",
  },
  {
    id: 5,
    symptoms: "Patient has 😰 + ❤️ (racing) + 😮‍💨 (shortness of breath) + 🤲 (trembling)",
    options: ["Heart attack", "Panic attack", "Asthma", "Hyperthyroidism"],
    correctAnswer: 1,
    explanation: "Well done! These symptoms together suggest a panic attack.",
    difficulty: "medium",
  },
  {
    id: 6,
    symptoms: "Child with 🌡️ (fever) + 😣 (ear pain) + 👂 (tugging at ear)",
    options: ["Strep throat", "Ear infection", "Teething", "Common cold"],
    correctAnswer: 1,
    explanation: "Correct! These are classic signs of otitis media (ear infection) in children.",
    difficulty: "medium",
  },
  {
    id: 7,
    symptoms: "Patient with 🦵 (leg pain) + 🔴 (redness) + 🔥 (warmth) + 🦵💨 (swelling)",
    options: ["Muscle strain", "Cellulitis", "Deep vein thrombosis", "Sciatica"],
    correctAnswer: 2,
    explanation: "Excellent diagnosis! These symptoms suggest deep vein thrombosis, which requires urgent attention.",
    difficulty: "hard",
  },
  {
    id: 8,
    symptoms: "Elderly patient with sudden 😵‍💫 (confusion) + 🗣️ (slurred speech) + 💪 (weakness on one side)",
    options: ["Dementia", "Medication side effect", "Stroke", "Urinary tract infection"],
    correctAnswer: 2,
    explanation: "Correct! These are warning signs of stroke requiring immediate medical attention.",
    difficulty: "hard",
  },
  {
    id: 9,
    symptoms: "Patient with 🫁 (difficulty breathing) + 😰 (sweating) + ❤️ (chest pain) + 🤢 (nausea)",
    options: ["Panic attack", "Pneumonia", "Heart attack", "Acid reflux"],
    correctAnswer: 2,
    explanation: "Great diagnosis! These are classic symptoms of myocardial infarction (heart attack).",
    difficulty: "hard",
  },
  {
    id: 10,
    symptoms: "Patient with 🌡️ (high fever) + 🧠 (headache) + 🤮 (vomiting) + 🔆 (light sensitivity) + 🦴 (stiff neck)",
    options: ["Severe migraine", "Influenza", "Meningitis", "COVID-19"],
    correctAnswer: 2,
    explanation: "Excellent! These symptoms together strongly suggest meningitis, which requires immediate treatment.",
    difficulty: "hard",
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
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "all">("all")
  const [filteredScenarios, setFilteredScenarios] = useState(scenarios)

  useEffect(() => {
    // Filter scenarios based on difficulty
    if (difficulty === "all") {
      setFilteredScenarios(scenarios)
    } else {
      setFilteredScenarios(scenarios.filter((scenario) => scenario.difficulty === difficulty))
    }

    // Reset to first scenario of filtered list
    if (filteredScenarios.length > 0) {
      setScenarioIndex(0)
      setCurrentScenario(filteredScenarios[0])
    }

    setSelectedOption(null)
    setShowResult(false)
    setScore(0)
  }, [difficulty])

  useEffect(() => {
    // Calculate progress percentage
    if (filteredScenarios.length > 0) {
      setProgress((scenarioIndex / filteredScenarios.length) * 100)
    }
  }, [scenarioIndex, filteredScenarios])

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

    if (nextIndex < filteredScenarios.length) {
      setScenarioIndex(nextIndex)
      setCurrentScenario(filteredScenarios[nextIndex])
    } else {
      // Reset to first scenario
      setScenarioIndex(0)
      setCurrentScenario(filteredScenarios[0])
    }

    setSelectedOption(null)
    setShowResult(false)
  }

  const handleDifficultyChange = (newDifficulty: "easy" | "medium" | "hard" | "all") => {
    setDifficulty(newDifficulty)
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


const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const, // 👈 fix type error
      stiffness: 300,
    },
  },
}



  const getDifficultyBg = (diff: "easy" | "medium" | "hard") => {
    switch (diff) {
      case "easy":
        return "bg-mint-green/20"
      case "medium":
        return "bg-soft-blue/20"
      case "hard":
        return "bg-soft-coral/20"
      default:
        return "bg-mint-green/20"
    }
  }

  return (
    <section className="py-20 min-h-screen bg-gradient-to-b from-mint-green to-snow-white">
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
              className="bg-gradient-to-br from-soft-blue to-mint-green p-5 rounded-full shadow-xl"
            >
              <Stethoscope className="h-14 w-14 text-snow-white" />
            </motion.div>
          </div>
          <h2 className="text-4xl py-2 md:text-6xl font-extrabold text-snow-white mb-4">
            Interactive Diagnosis Game
          </h2>
          <p className="text-xl text-dark-slate-gray max-w-2xl mx-auto font-medium">
            Test your medical knowledge with our &quot;Play Doctor&quot; mini-game
          </p>
        </motion.div>

        {/* Difficulty selector */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex p-1 rounded-lg bg-cool-gray/10">
            {(["all", "easy", "medium", "hard"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  difficulty === diff
                    ? `bg-soft-blue text-snow-white shadow-md`
                    : `text-cool-gray hover:bg-cool-gray/20`
                }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-soft-blue">Progress</span>
            <span className="text-sm font-bold text-soft-blue bg-soft-blue/10 px-3 py-1 rounded-full">
              {scenarioIndex + 1}/{filteredScenarios.length}
            </span>
          </div>
          <Progress
            value={progress}
        //    className="h-3 bg-cool-gray/20 rounded-full"
            // Fixed TypeScript error by using className with a template string
            className={`h-3 bg-cool-gray/20 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-soft-blue [&>div]:to-mint-green [&>div]:rounded-full`}
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
            <Card className="border-cool-gray/20 shadow-2xl overflow-hidden rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-soft-blue to-mint-green text-snow-white border-b border-cool-gray/20 py-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                    >
                      <Heart className="h-6 w-6 text-soft-coral fill-soft-coral" />
                    </motion.div>
                    Play Doctor
                  </CardTitle>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${getDifficultyBg(currentScenario.difficulty)}`}
                  >
                    {currentScenario.difficulty.toUpperCase()}
                  </span>
                </div>
                <CardDescription className="text-snow-white/90 text-base">
                  Diagnose the patient based on their symptoms
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <motion.div variants={itemVariants} className="mb-6">
                    <h3 className="text-xl text-dark-slate-gray font-bold mb-6 p-4 bg-gradient-to-r from-snow-white to-mint-green/10 rounded-lg border-l-4 border-soft-blue shadow-md">
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
                              ? "border-mint-green bg-mint-green/10"
                              : showResult && selectedOption === index && index !== currentScenario.correctAnswer
                                ? "border-soft-coral bg-soft-coral/10"
                                : selectedOption === index
                                  ? "border-soft-blue bg-soft-blue/10 shadow-md"
                                  : "border-cool-gray/20 hover:border-soft-blue hover:bg-soft-blue/5"
                          }`}
                        >
                          <div className="flex-1 flex items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                                selectedOption === index
                                  ? showResult && index !== currentScenario.correctAnswer
                                    ? "bg-soft-coral"
                                    : "bg-soft-blue"
                                  : "border-2 border-cool-gray/30"
                              }`}
                            >
                              {selectedOption === index && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-3 h-3 bg-snow-white rounded-full"
                                />
                              )}
                            </div>
                            <Label
                              htmlFor={`option-${index}`}
                              className={`text-lg cursor-pointer ${
                                showResult && index === currentScenario.correctAnswer
                                  ? "text-mint-green font-bold"
                                  : showResult && selectedOption === index && index !== currentScenario.correctAnswer
                                    ? "text-soft-coral font-bold"
                                    : selectedOption === index
                                      ? "text-soft-blue font-bold"
                                      : "text-dark-slate-gray"
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
                              <CheckCircle2 className="h-7 w-7 text-mint-green" />
                            </motion.div>
                          )}
                          {showResult && selectedOption === index && index !== currentScenario.correctAnswer && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <XCircle className="h-7 w-7 text-soft-coral" />
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
                            ? "bg-mint-green/10 border-2 border-mint-green/30 text-dark-slate-gray"
                            : "bg-soft-coral/10 border-2 border-soft-coral/30 text-dark-slate-gray"
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
                              <CheckCircle2 className="h-7 w-7 text-mint-green mt-0.5 flex-shrink-0" />
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
                              <AlertCircle className="h-7 w-7 text-soft-coral mt-0.5 flex-shrink-0" />
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
              <CardFooter className="flex justify-between items-center border-t border-cool-gray/10 bg-snow-white py-4 px-6">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      rotate: [0, 10, 0, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                  >
                    <Award className="h-7 w-7 text-soft-blue drop-shadow-md" />
                  </motion.div>
                  <motion.span
                    key={score}
                    initial={{ scale: 1.5, y: -10, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    className="font-bold text-xl text-soft-blue"
                  >
                    Score: {score}
                  </motion.span>
                </div>

                {!showResult ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleSubmit}
                      disabled={selectedOption === null}
                      className="bg-gradient-to-r from-soft-blue to-mint-green hover:from-soft-blue/90 hover:to-mint-green/90 text-lg font-bold px-8 py-6 h-auto shadow-lg text-snow-white"
                    >
                      Submit Diagnosis
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={nextScenario}
                      className="bg-gradient-to-r from-mint-green to-soft-blue hover:from-mint-green/90 hover:to-soft-blue/90 text-lg font-bold px-8 py-6 h-auto shadow-lg text-snow-white"
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
                      "oklch(0.55 0.15 210)", // soft-blue
                      "oklch(0.72 0.11 178)", // mint-green
                      "oklch(0.65 0.25 10)", // soft-coral
                      "oklch(0.98 0.02 100)", // snow-white
                      "oklch(0.35 0.05 180)", // cool-gray
                    ][Math.floor(Math.random() * 5)],
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
          <p className="text-sm text-soft-blue">Continue playing to improve your diagnostic skills!</p>
        </motion.div>
      </div>
    </section>
  )
}
