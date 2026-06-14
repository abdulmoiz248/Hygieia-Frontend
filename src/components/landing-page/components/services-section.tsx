"use client"

import { useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRouter } from "next/navigation"
import { Stethoscope, Apple, FlaskConical, ArrowRight } from "lucide-react"
import { useDoctors } from "@/hooks/useDoctors"
import { useNutritionists } from "@/hooks/useNutritionist"
import { useLabTests } from "@/hooks/useLabTests"

function formatCount(count: number | undefined): string {
  if (count === undefined) return "..."
  if (count === 0) return "0"
  const rounded = Math.floor(count / 100) * 100
  return rounded > 0 ? `${rounded}+` : `${count}+`
}

type ServiceId = "doctors" | "nutritionists" | "lab-tests"

const SERVICE_CONFIG = {
  doctors: {
    icon: Stethoscope,
    accentClass: "text-soft-blue",
    bgActive: "bg-gradient-to-br from-soft-blue to-soft-blue/80 text-snow-white shadow-lg",
    bgInactive: "bg-snow-white shadow",
    borderActive: "border-soft-blue/20",
    gradient: "from-soft-blue to-soft-blue/80",
    statColor: "text-soft-blue",
    iconBg: "bg-soft-blue/20 text-soft-blue",
  },
  nutritionists: {
    icon: Apple,
    accentClass: "text-mint-green",
    bgActive: "bg-gradient-to-br from-mint-green to-mint-green/80 text-snow-white shadow-lg",
    bgInactive: "bg-snow-white shadow",
    borderActive: "border-mint-green/20",
    gradient: "from-mint-green to-mint-green/80",
    statColor: "text-mint-green",
    iconBg: "bg-mint-green/20 text-mint-green",
  },
  "lab-tests": {
    icon: FlaskConical,
    accentClass: "text-soft-coral",
    bgActive: "bg-gradient-to-br from-soft-coral to-soft-coral/80 text-snow-white shadow-lg",
    bgInactive: "bg-snow-white shadow",
    borderActive: "border-soft-coral/20",
    gradient: "from-soft-coral to-soft-coral/80",
    statColor: "text-soft-coral",
    iconBg: "bg-soft-coral/20 text-soft-coral",
  },
} as const

export default function ServicesSection() {
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const isSectionInView = useInView(sectionRef, { once: false, amount: 0.2 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const [activeService, setActiveService] = useState<ServiceId | null>(null)

  const { data: doctors,       isLoading: loadingDoctors       } = useDoctors()
  const { data: nutritionists, isLoading: loadingNutritionists } = useNutritionists()
  const { data: labTests,      isLoading: loadingLabTests      } = useLabTests()

  const doctorCount       = doctors?.length
  const nutritionistCount = nutritionists?.length
  const labTestCount      = labTests?.length

  const totalProfessionals =
    doctorCount !== undefined && nutritionistCount !== undefined
      ? doctorCount + nutritionistCount
      : null

  const services = [
    {
      id: "doctors" as ServiceId,
      label: "Doctors",
      description: "Board-certified physicians across 50+ specialties for consultations and treatment plans.",
      href: "/doctors",
      statValue: loadingDoctors ? "..." : formatCount(doctorCount),
      statLabel: "Verified Doctors",
    },
    {
      id: "nutritionists" as ServiceId,
      label: "Nutritionists",
      description: "Certified nutrition experts for sustainable diet plans and energy optimisation.",
      href: "/nutritionists",
      statValue: loadingNutritionists ? "..." : formatCount(nutritionistCount),
      statLabel: "Certified Nutritionists",
    },
    {
      id: "lab-tests" as ServiceId,
      label: "Lab Tests",
      description: "Diagnostic tests with home sample collection and fast, secure digital results.",
      href: "/lab-tests",
      statValue: loadingLabTests ? "..." : labTestCount !== undefined ? `${labTestCount}+` : "...",
      statLabel: "Tests Available",
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 md:px-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, var(--color-snow-white) 0%, var(--color-snow-white) 12%, var(--color-mint-green) 88%, var(--color-mint-green) 100%)",
      }}
      id="services"
    >
      {/* Background blobs matching HowItWorks style */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-snow-white via-snow-white/95 to-transparent" />
        <motion.div
          className="absolute top-28 right-6 w-1/3 h-1/3 bg-soft-blue/20 rounded-full blur-3xl opacity-20"
          initial={{ x: "35%", y: "-20%", scale: 0.8 }}
          animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-16 left-8 w-1/3 h-1/3 bg-mint-green/20 rounded-full blur-3xl opacity-25"
          initial={{ x: "-35%", y: "35%", scale: 0.8 }}
          animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, -10, 0] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </div>

      <motion.div style={{ opacity }} className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Section header — mirrors HowItWorks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isSectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-slate-gray mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {totalProfessionals !== null
              ? `${totalProfessionals}+ Healthcare Professionals — One Platform`
              : "Everything Your Health Needs, In One Place"}
          </p>
        </motion.div>

        {/* Cards — identical structure/animation to HowItWorks steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative">
          {services.map((service, index) => {
            const config   = SERVICE_CONFIG[service.id]
            const isActive = activeService === service.id
            const Icon     = config.icon

            return (
              <motion.div
                key={service.id}
                initial="hidden"
                animate={isSectionInView ? (isActive ? "active" : "inactive") : "hidden"}
                variants={{
                  hidden: { y: 24, opacity: 0, scale: 0.98 },
                  inactive: {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    boxShadow: "0 8px 18px -14px rgba(15, 40, 64, 0.35)",
                    transition: { duration: 0.55, delay: isSectionInView ? index * 0.08 : 0, ease: [0.25, 0.1, 0.25, 1] },
                  },
                  active: {
                    y: 0,
                    opacity: 1,
                    scale: 1.025,
                    boxShadow: "0 18px 32px -20px rgba(15, 40, 64, 0.38)",
                    transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] },
                  },
                }}
                className={`rounded-xl p-5 transition-colors duration-300 transform border relative cursor-pointer ${
                  isActive
                    ? `${config.bgActive} ${config.borderActive}`
                    : `${config.bgInactive} border-cool-gray/10`
                }`}
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
                onClick={() => router.push(service.href)}
              >
                {/* Icon circle */}
                <motion.div
                  className={`w-16 h-16 rounded-full ${
                    isActive ? "bg-snow-white/20" : config.iconBg
                  } flex items-center justify-center mb-3 mx-auto`}
                  animate={isActive ? { scale: 1.06, rotate: 3 } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Icon size={28} className={isActive ? "text-snow-white" : ""} />
                </motion.div>

                {/* Text content */}
                <div className="text-center">
                  <h3 className={`text-xl font-semibold mb-2 ${isActive ? "text-snow-white" : "text-dark-slate-gray"}`}>
                    {service.label}
                  </h3>
                  <p className={`text-sm ${isActive ? "text-snow-white/90" : "text-cool-gray"}`}>
                    {service.description}
                  </p>
                </div>

                {/* Stat pill */}
                <div className={`mt-4 mx-auto w-fit px-4 py-1.5 rounded-full text-sm font-bold ${
                  isActive ? "bg-snow-white/20 text-snow-white" : `${config.iconBg}`
                }`}>
                  {service.statValue} {service.statLabel}
                </div>

                {/* CTA arrow */}
                <motion.div
                  className={`flex items-center justify-center gap-1 mt-3 text-sm font-semibold ${
                    isActive ? "text-snow-white" : config.accentClass
                  }`}
                  animate={isActive ? { x: [0, 5, 0] } : { x: 0 }}
                  transition={{ duration: 0.8, repeat: isActive ? Infinity : 0, repeatType: "reverse" }}
                >
                  <span>Explore {service.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Dot indicators — identical to HowItWorks */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {services.map((service) => (
              <motion.button
                key={service.id}
                onClick={() => setActiveService(activeService === service.id ? null : service.id)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeService === service.id ? "bg-soft-blue" : "bg-cool-gray/30"
                }`}
                animate={{ scale: activeService === service.id ? 1.25 : 1 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Highlight ${service.label}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
