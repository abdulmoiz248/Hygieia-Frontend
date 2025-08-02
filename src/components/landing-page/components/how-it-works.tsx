"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, useInView, useScroll, useTransform } from "framer-motion"
import { Scan, Brain, Video, LineChart, ArrowRight } from 'lucide-react'
import { easeInOut } from "framer-motion"
import type { Variants } from "framer-motion"


const steps = [
  {
    title: "Symptom Scan",
    description: "Upload images or describe symptoms for instant analysis",
    icon: Scan,
    color: "bg-soft-blue/20 text-soft-blue",
    gradient: "from-soft-blue to-soft-blue/80",
  },
  {
    title: "AI Diagnosis",
    description: "Our advanced AI analyzes your data for accurate insights",
    icon: Brain,
    color: "bg-mint-green/20 text-mint-green",
    gradient: "from-mint-green to-mint-green/80",
  },
  {
    title: "Doctor Connect",
    description: "Connect with specialists via secure video consultations",
    icon: Video,
    color: "bg-soft-coral/20 text-soft-coral",
    gradient: "from-soft-coral to-soft-coral/80",
  },
  {
    title: "Wellness Plan",
    description: "Receive personalized health plans and track your progress",
    icon: LineChart,
    color: "bg-soft-blue/20 text-soft-blue",
    gradient: "from-soft-blue to-soft-blue/90",
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

 
 


const lineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (custom: number) => ({
    pathLength: activeStep === custom || activeStep === custom + 1 ? 1 : 0.3,
    opacity: activeStep === custom || activeStep === custom + 1 ? 1 : 0.3,
    transition: {
      pathLength: {
        duration: 0.8,
        ease: easeInOut,
        delay: activeStep === custom ? 0.2 : 0,
      },
      opacity: { duration: 0.4 },
    },
  }),
}


 

  return (
    <section
      ref={sectionRef}
      className="py-24  bg-gradient-to-b from-mint-green to-snow-white relative overflow-hidden"
      id="how-it-works"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-1/3 h-1/3 bg-soft-blue/20 rounded-full blur-3xl opacity-30"
          initial={{ x: "50%", y: "-50%", scale: 0.8 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-mint-green/20 rounded-full blur-3xl opacity-30"
          initial={{ x: "-50%", y: "50%", scale: 0.8 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
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
          <h2 className="text-3xl md:text-5xl font-bold text-dark-slate-gray mb-4">How It Works</h2>
          <p className="text-lg md:text-xl text-soft-blue max-w-2xl mx-auto">
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
                // Extract color information from step
                const colorClass = step.gradient.split(" ")[0].substring(5)
                
                // Map color classes to your theme colors
                const getGradientColor = (colorClass: string) => {
                  switch(colorClass) {
                    case 'soft-blue': return ['oklch(0.55 0.15 210)', 'oklch(0.55 0.15 210 / 0.8)']
                    case 'mint-green': return ['oklch(0.72 0.11 178)', 'oklch(0.72 0.11 178 / 0.8)']
                    case 'soft-coral': return ['oklch(0.65 0.25 10)', 'oklch(0.65 0.25 10 / 0.8)']
                    default: return ['oklch(0.55 0.15 210)', 'oklch(0.55 0.15 210 / 0.8)']
                  }
                }
                
                const [from, to] = getGradientColor(colorClass)

                return (
                  <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={from} />
                    <stop offset="100%" stopColor={to} />
                  </linearGradient>
                )
              })}
            </defs>
          </svg>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate={activeStep === index ? "active" : "inactive"}
              variants={{
                hidden: { y: 50, opacity: 0 },
                inactive: {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                },
                active: {
                  y: 0,
                  opacity: 1,
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }
                }
              }}
              className={`rounded-xl p-6 transition-all duration-500 transform border relative ${
                activeStep === index
                  ? `border-${step.gradient.split(" ")[0].substring(5)}/20 bg-gradient-to-br ${step.gradient} text-snow-white shadow-lg`
                  : "border-cool-gray/10 bg-snow-white shadow"
              }`}
            >
              <motion.div
                className={`w-16 h-16 rounded-full ${
                  activeStep === index ? "bg-snow-white/20" : step.color
                } flex items-center justify-center mb-4 mx-auto`}
                animate={activeStep === index ? { scale: [1, 1.1, 1], rotate: [0, 5, 0] } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <step.icon size={28} className={activeStep === index ? "text-snow-white" : ""} />
              </motion.div>
              <div className="text-center">
                <h3 className={`text-xl font-semibold mb-2 ${activeStep === index ? "text-snow-white" : "text-dark-slate-gray"}`}>
                  {step.title}
                </h3>
                <p className={activeStep === index ? "text-snow-white/90" : "text-cool-gray"}>{step.description}</p>
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
                    repeat: activeStep === index ? Infinity : 0,
                    repeatType: "reverse",
                  }}
                >
                  <ArrowRight
                    className={`${activeStep === index || activeStep === index + 1 ? "text-soft-blue" : "text-cool-gray/50"}`}
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
                  activeStep === index ? "bg-soft-blue" : "bg-cool-gray/30"
                }`}
                animate={{
                  scale: activeStep === index ? 1.25 : 1,
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
