"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, useInView, useScroll, useTransform, Variants } from "framer-motion"
import { Scan, Brain, Video, LineChart, ArrowRight } from "lucide-react"

const steps = [
  {
    title: "Symptom Scan",
    description: "Upload images or describe symptoms for instant analysis",
    icon: Scan,
    color: "bg-blue-100 text-blue-600",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "AI Diagnosis",
    description: "Our advanced AI analyzes your data for accurate insights",
    icon: Brain,
    color: "bg-teal-100 text-teal-600",
    gradient: "from-teal-400 to-teal-500",
  },
  {
    title: "Doctor Connect",
    description: "Connect with specialists via secure video consultations",
    icon: Video,
    color: "bg-purple-100 text-purple-600",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    title: "Wellness Plan",
    description: "Receive personalized health plans and track your progress",
    icon: LineChart,
    color: "bg-blue-100 text-blue-600",
    gradient: "from-blue-400 to-blue-500",
  },
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const controls = useAnimation()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100])

  useEffect(() => {
    if (isInView) {
      controls.start("visible")

      // Auto-advance through steps
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [controls, isInView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const activeCardVariants = {
    inactive: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    active: {
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  }

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: number) => ({
      pathLength: activeStep === custom || activeStep === custom + 1 ? 1 : 0.3,
      opacity: activeStep === custom || activeStep === custom + 1 ? 1 : 0.3,
      transition: {
        pathLength: {
          duration: 0.8,
          ease: "easeInOut",
          delay: activeStep === custom ? 0.2 : 0,
        },
        opacity: { duration: 0.4 },
      },
    }),
  }

  const particleVariants = (i: number) => ({
    initial: {
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.3,
      scale: Math.random() * 0.5 + 0.5,
    },
    animate: {
      y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
      opacity: [Math.random() * 0.5 + 0.3, Math.random() * 0.5 + 0.3],
      scale: [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5],
      transition: {
        duration: Math.random() * 10 + 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: i * 0.2,
      },
    },
  })

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden"
      id="how-it-works"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 rounded-full blur-3xl opacity-30"
          initial={{ x: "50%", y: "-50%", scale: 0.8 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-teal-100 rounded-full blur-3xl opacity-30"
          initial={{ x: "-50%", y: "50%", scale: 0.8 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

       
      </div>

      <motion.div style={{ opacity, y }} className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-blue-900 mb-4">How It Works</h2>
          <p className="text-lg md:text-xl text-blue-700 max-w-2xl mx-auto">
            4 Steps to Smarter Health – No Waiting Rooms, No Delays
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 relative"
        >
          {/* Connection lines between steps */}
          <svg className="absolute top-1/2 left-0 w-full h-8 -translate-y-1/2 hidden md:block pointer-events-none z-0">
            {steps.map((_, index) => {
              if (index < steps.length - 1) {
                return (
                  <motion.line
                    key={index}
                    custom={index}
                    variants={lineVariants}
                    initial="hidden"
                    animate="visible"
                    x1={`${(100 / steps.length) * (index + 0.5)}%`}
                    y1="50%"
                    x2={`${(100 / steps.length) * (index + 1.5)}%`}
                    y2="50%"
                    stroke={`url(#gradient-${index})`}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    strokeLinecap="round"
                  />
                )
              }
              return null
            })}

            {/* Gradients for connection lines */}
            <defs>
              {steps.map((step, index) => {
                // Extract color information safely
                const gradientColors = {
                  from: step.gradient.includes("blue")
                    ? "#3b82f6"
                    : step.gradient.includes("teal")
                      ? "#14b8a6"
                      : step.gradient.includes("purple")
                        ? "#9333ea"
                        : "#3b82f6",
                  to: step.gradient.includes("blue")
                    ? "#60a5fa"
                    : step.gradient.includes("teal")
                      ? "#2dd4bf"
                      : step.gradient.includes("purple")
                        ? "#a855f7"
                        : "#60a5fa",
                }

                return (
                  <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={gradientColors.from} />
                    <stop offset="100%" stopColor={gradientColors.to} />
                  </linearGradient>
                )
              })}
            </defs>
          </svg>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              animate={activeStep === index ? "active" : "inactive"}
              variants={activeCardVariants}
              className={`rounded-xl p-6 transition-all duration-500 transform border relative ${
                activeStep === index
                  ? `border-${step.gradient.split(" ")[0].substring(5)}-200 bg-gradient-to-br ${step.gradient} text-white shadow-lg`
                  : "border-gray-100 bg-white shadow"
              }`}
            >
              <motion.div
                className={`w-16 h-16 rounded-full ${
                  activeStep === index ? "bg-white/20" : step.color
                } flex items-center justify-center mb-4 mx-auto`}
                animate={activeStep === index ? { scale: [1, 1.1, 1], rotate: [0, 5, 0] } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <step.icon size={28} className={activeStep === index ? "text-white" : ""} />
              </motion.div>
              <div className="text-center">
                <h3 className={`text-xl font-semibold mb-2 ${activeStep === index ? "text-white" : "text-blue-900"}`}>
                  {step.title}
                </h3>
                <p className={activeStep === index ? "text-white/90" : "text-gray-600"}>{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <motion.div
                  className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10"
                  animate={
                    activeStep === index
                      ? { x: [0, 5, 0], opacity: 1 }
                      : { x: 0, opacity: activeStep === index + 1 ? 1 : 0.3 }
                  }
                  transition={{
                    duration: 0.8,
                    repeat: activeStep === index ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                >
                  <ArrowRight
                    className={`${activeStep === index || activeStep === index + 1 ? "text-blue-400" : "text-blue-200"}`}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === index ? "bg-blue-600" : "bg-gray-300"
                }`}
                animate={{
                  scale: activeStep === index ? 1.25 : 1,
                  backgroundColor: activeStep === index ? "#2563eb" : "#d1d5db",
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
