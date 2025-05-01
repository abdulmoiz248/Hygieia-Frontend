"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import confetti from "canvas-confetti"

const questions = [
  {
    id: 1,
    question: "How many hours of sleep do you get per night?",
    options: ["😴 < 5 hours", "😐 5-6 hours", "🙂 7-8 hours", "😊 > 8 hours"],
    type: "emoji",
  },
  {
    id: 2,
    question: "How would you rate your stress level?",
    type: "slider",
    min: 0,
    max: 10,
    step: 1,
    labels: ["Very Low", "Moderate", "Very High"],
  },
  {
    id: 3,
    question: "How many servings of fruits and vegetables do you eat daily?",
    options: ["🍎 0-1", "🥗 2-3", "🥦 4-5", "🍓 > 5"],
    type: "emoji",
  },
  {
    id: 4,
    question: "How often do you exercise per week?",
    options: ["🧘 Never", "🚶 1-2 times", "🏃 3-4 times", "💪 5+ times"],
    type: "emoji",
  },
]

export default function HealthScoreQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | undefined)[]>(Array(questions.length).fill(undefined))
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [sliderValue, setSliderValue] = useState<number[]>([5])

  // Initialize slider value when reaching the slider question
  useEffect(() => {
    if (questions[currentQuestion]?.type === "slider") {
      setSliderValue([answers[currentQuestion] !== undefined ? (answers[currentQuestion] as number) : 5])
    }
  }, [currentQuestion, answers])

  const handleEmojiAnswer = (index: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = index
    setAnswers(newAnswers)

    // Add a small delay before moving to the next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        calculateScore(newAnswers)
      }
    }, 300)
  }

  const handleSliderAnswer = (value: number[]) => {
    setSliderValue(value)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value[0]
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    // Ensure we have an answer for the current question
    if (answers[currentQuestion] === undefined && questions[currentQuestion].type === "slider") {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = sliderValue[0]
      setAnswers(newAnswers)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScore(answers)
    }
  }

  const calculateScore = (allAnswers: (number | undefined)[]) => {
    // Check if all questions are answered
    if (allAnswers.some((answer) => answer === undefined)) {
      alert("Please answer all questions before seeing your results.")
      return
    }

    // Simple scoring algorithm
    let totalScore = 0
    let answeredQuestions = 0

    allAnswers.forEach((answer, index) => {
      if (answer === undefined) return

      answeredQuestions++
      const question = questions[index]

      if (question.type === "emoji") {
        // For emoji questions, higher index = better health habit (0-3 scale)
        totalScore += answer * 25 // Scale to 0-75
      } else if (question.type === "slider") {
        // For stress slider, lower is better (reverse score)
        // Scale is 0-10, so reverse and convert to 0-100
        totalScore += (10 - answer) * 10 // Scale to 0-100
      }
    })

    // Calculate average score only from answered questions
    const normalizedScore = answeredQuestions > 0 ? Math.round(totalScore / answeredQuestions) : 0

    // Ensure score is within 0-100 range
    const finalScore = Math.min(100, Math.max(0, normalizedScore))
    setScore(finalScore)
    setShowResults(true)

    // Trigger confetti effect for good scores
    if (finalScore > 70) {
      triggerConfetti()
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers(Array(questions.length).fill(undefined))
    setShowResults(false)
    setScore(0)
    setSliderValue([5])
  }

  // Calculate progress percentage
  const progressPercentage = Math.round(((currentQuestion + 1) / questions.length) * 100)

  // Get score color based on score value
  const getScoreColor = () => {
    if (score > 70) return "text-mint-green"
    if (score > 40) return "text-soft-coral"
    return "text-soft-coral"
  }

  // Get score stroke color based on score value
  const getScoreStrokeColor = () => {
    if (score > 70) return "oklch(0.72 0.11 178)" // mint-green
    if (score > 40) return "oklch(0.65 0.25 10)" // soft-coral
    return "oklch(0.65 0.25 10)" // soft-coral (for low scores)
  }

  return (
    <section className="py-20 px-4 md:px-10 bg-gradient-to-br from-snow-white to-mint-green/70">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-slate-gray mb-4">What's Your Health Score?</h2>
          <p className="text-lg text-cool-gray">
            Take our quick quiz to discover your personal health score and get customized recommendations
          </p>
        </motion.div>

        <div className="bg-snow-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-8">
                  <div className="flex justify-between mb-2 text-sm text-cool-gray">
                    <span>
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span>{progressPercentage}% Complete</span>
                  </div>
                  <div className="w-full h-2 bg-cool-gray/10 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-soft-blue to-mint-green rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-dark-slate-gray mb-8">
                  {questions[currentQuestion].question}
                </h3>

                {questions[currentQuestion].type === "emoji" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {questions[currentQuestion].options?.map((option, index) => {
                      const [emoji, text] = option.split(" ")
                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleEmojiAnswer(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            answers[currentQuestion] === index
                              ? "border-mint-green bg-mint-green/10"
                              : "border-cool-gray/20 hover:border-soft-blue"
                          }`}
                        >
                          <div className="text-2xl mb-2">{emoji}</div>
                          <div className="text-sm text-cool-gray">{text}</div>
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                {questions[currentQuestion].type === "slider" && (
                  <div className="py-8">
                    <Slider
                      value={sliderValue}
                      max={questions[currentQuestion].max}
                      min={questions[currentQuestion].min}
                      step={questions[currentQuestion].step}
                      onValueChange={handleSliderAnswer}
                      className="mb-8"
                    />

                    <div className="flex justify-between text-sm text-cool-gray mb-4">
                      {questions[currentQuestion].labels?.map((label, index) => (
                        <span key={index}>{label}</span>
                      ))}
                    </div>

                    <div className="text-center mb-8 text-lg font-medium text-soft-blue">
                      Selected: {sliderValue[0]}
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleNext} className="bg-soft-blue hover:bg-soft-blue/90 text-snow-white">
                        {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-dark-slate-gray mb-6">Your Health Score</h3>

                <div className="relative w-64 h-64 mx-auto mb-8">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="oklch(0.35 0.05 180 / 0.2)" strokeWidth="10" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={getScoreStrokeColor()}
                      strokeWidth="10"
                      strokeDasharray={`${score * 2.83} 283`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      initial={{ strokeDasharray: "0 283" }}
                      animate={{ strokeDasharray: `${score * 2.83} 283` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <motion.text
                      x="50"
                      y="50"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fontSize="24"
                      fontWeight="bold"
                      fill="oklch(0.15 0.05 210)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {score}
                    </motion.text>
                    <motion.text
                      x="50"
                      y="65"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fontSize="12"
                      fill="oklch(0.35 0.05 180)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      out of 100
                    </motion.text>
                  </svg>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-bold mb-2 text-dark-slate-gray">
                    {score > 70
                      ? "Excellent Health Habits!"
                      : score > 40
                        ? "Good Progress, Room to Improve"
                        : "Time to Focus on Your Health"}
                  </h4>
                  <p className="text-cool-gray">
                    {score > 70
                      ? "You're doing great! Keep up these healthy habits for long-term wellness."
                      : score > 40
                        ? "You have some good habits, but could benefit from a few lifestyle adjustments."
                        : "Your current habits may be impacting your health. Let's work together to improve them."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button onClick={resetQuiz} variant="outline" className="border-soft-blue text-soft-blue">
                    Retake Quiz
                  </Button>
                  <Button className="bg-mint-green hover:bg-mint-green/90 text-snow-white">
                    Get Personalized Plan
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
