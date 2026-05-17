"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Stethoscope,
  Apple,
  FlaskConical,
  ArrowRight,
  ChevronRight,
} from "lucide-react"
import { useDoctors } from "@/hooks/useDoctors"
import { useNutritionists } from "@/hooks/useNutritionist"
import { useLabTests } from "@/hooks/useLabTests"

/** Format a raw count into a display string, e.g. 523 → "500+" */
function formatCount(count: number | undefined): string {
  if (count === undefined) return "..."
  if (count === 0) return "0"
  const rounded = Math.floor(count / 100) * 100
  return rounded > 0 ? `${rounded}+` : `${count}+`
}

// ── Theme-aware service palette ─────────────────────────────────────────────
// Every color value is a CSS expression that references the custom properties
// defined in globals.css. color-mix() gives us transparent tints/borders
// without ever touching a hex or rgb literal.
const SERVICE_THEME = {
  doctors: {
    accent:       "var(--color-soft-blue)",
    accentLight:  "color-mix(in oklch, var(--color-soft-blue) 10%, transparent)",
    accentBorder: "color-mix(in oklch, var(--color-soft-blue) 25%, transparent)",
    shadow:       "color-mix(in oklch, var(--color-soft-blue) 30%, transparent)",
    gradient:     "linear-gradient(135deg, var(--color-soft-blue), oklch(from var(--color-soft-blue) calc(l - 0.15) c h))",
  },
  nutritionists: {
    accent:       "var(--color-mint-green)",
    accentLight:  "color-mix(in oklch, var(--color-mint-green) 10%, transparent)",
    accentBorder: "color-mix(in oklch, var(--color-mint-green) 25%, transparent)",
    shadow:       "color-mix(in oklch, var(--color-mint-green) 30%, transparent)",
    gradient:     "linear-gradient(135deg, var(--color-mint-green), oklch(from var(--color-mint-green) calc(l - 0.12) c h))",
  },
  "lab-tests": {
    accent:       "var(--color-soft-coral)",
    accentLight:  "color-mix(in oklch, var(--color-soft-coral) 10%, transparent)",
    accentBorder: "color-mix(in oklch, var(--color-soft-coral) 25%, transparent)",
    shadow:       "color-mix(in oklch, var(--color-soft-coral) 30%, transparent)",
    gradient:     "linear-gradient(135deg, var(--color-soft-coral), oklch(from var(--color-soft-coral) calc(l - 0.12) c h))",
  },
} as const

type ServiceId = keyof typeof SERVICE_THEME

export default function ServicesSection() {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const [hoveredId, setHoveredId] = useState<ServiceId | null>(null)

  // ── Real-time data ──────────────────────────────────────────────────────
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

  // ── Service definitions ─────────────────────────────────────────────────
  const services = [
    {
      id: "doctors" as ServiceId,
      icon: Stethoscope,
      label: "Doctors",
      tagline: "Expert Medical Care",
      description: `Connect with ${
        doctorCount ? `${doctorCount} board-certified` : "board-certified"
      } physicians across 50+ specialties for consultations, second opinions, and personalized treatment plans.`,
      href: "/doctors",
      stats: {
        value: loadingDoctors ? "..." : formatCount(doctorCount),
        label: "Verified Doctors",
      },
    },
    {
      id: "nutritionists" as ServiceId,
      icon: Apple,
      label: "Nutritionists",
      tagline: "Personalized Nutrition",
      description: `Work with ${
        nutritionistCount ? `${nutritionistCount} certified` : "certified"
      } nutrition experts to build sustainable diet plans, manage weight, and optimize your energy levels.`,
      href: "/nutritionists",
      stats: {
        value: loadingNutritionists ? "..." : formatCount(nutritionistCount),
        label: "Nutritionists",
      },
    },
    {
      id: "lab-tests" as ServiceId,
      icon: FlaskConical,
      label: "Lab Tests",
      tagline: "Precision Diagnostics",
      description: `Book from ${
        labTestCount ?? "300+"
      } diagnostic tests with home sample collection, fast turnaround times, and secure digital results.`,
      href: "/lab-tests",
      stats: {
        value: loadingLabTests ? "..." : (labTestCount !== undefined ? `${labTestCount}+` : "..."),
        label: "Tests Available",
      },
    },
  ]

  return (
    <section
      className="relative py-24 px-4 md:px-10 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, var(--color-snow-white), color-mix(in oklch, var(--color-mint-green) 20%, var(--color-snow-white)))`,
      }}
      id="services"
    >
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-soft-blue) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-mint-green) 0%, transparent 70%)" }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="var(--color-soft-blue)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 shadow-sm"
            style={{
              background: "color-mix(in oklch, var(--color-snow-white) 80%, transparent)",
              border:     "1px solid color-mix(in oklch, var(--color-soft-blue) 15%, transparent)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "var(--color-mint-green)" }}
            />
            <span
              className="text-sm font-semibold tracking-wide uppercase"
              style={{ color: "var(--color-soft-blue)" }}
            >
              Our Services
            </span>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold leading-tight mb-5"
            style={{ color: "var(--color-dark-slate-gray)" }}
          >
            {totalProfessionals !== null ? (
              <>{totalProfessionals}+ Healthcare Professionals,{" "}</>
            ) : (
              <>Everything Your Health Needs,{" "}</>
            )}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green))",
              }}
            >
              In One Place
            </span>
          </h2>

          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--color-cool-gray)" }}>
            From expert consultations to precision diagnostics — Hygieia brings the full spectrum of
            healthcare to your fingertips.
          </p>
        </motion.div>

        {/* Service cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {services.map((service, index) => {
            const Icon      = service.icon
            const theme     = SERVICE_THEME[service.id]
            const isHovered = hoveredId === service.id

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative rounded-3xl overflow-hidden flex flex-col cursor-pointer"
                style={{
                  background:  "var(--color-snow-white)",
                  border:      `1px solid ${isHovered ? theme.accentBorder : "color-mix(in oklch, var(--color-dark-slate-gray) 10%, transparent)"}`,
                  boxShadow:   isHovered
                    ? `0 24px 48px -12px ${theme.shadow}, 0 0 0 1px ${theme.accentBorder}`
                    : "0 4px 20px color-mix(in oklch, var(--color-dark-slate-gray) 7%, transparent)",
                  transform:   isHovered ? "translateY(-6px)" : "translateY(0)",
                  transition:  "transform 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease",
                }}
              >
                {/* Top gradient strip */}
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: isHovered ? theme.gradient : "transparent",
                    transition: "background 0.5s ease",
                  }}
                />

                {/* Card body */}
                <div className="flex flex-col flex-1 p-7">
                  {/* Icon + stat row */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{
                        background: isHovered ? theme.gradient : theme.accentLight,
                        transition: "background 0.3s ease",
                      }}
                    >
                      <Icon
                        className="w-7 h-7"
                        style={{
                          color:      isHovered ? "var(--color-snow-white)" : theme.accent,
                          transition: "color 0.3s ease",
                        }}
                      />
                    </motion.div>

                    {/* Live stat badge */}
                    <div className="text-right">
                      <motion.div
                        key={service.stats.value}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35 }}
                        className="text-2xl font-bold leading-none"
                        style={{ color: theme.accent }}
                      >
                        {service.stats.value}
                      </motion.div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--color-cool-gray)" }}>
                        {service.stats.label}
                      </div>
                    </div>
                  </div>

                  {/* Tagline + heading */}
                  <div className="mb-3">
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: theme.accent }}
                    >
                      {service.tagline}
                    </span>
                    <h3
                      className="text-2xl font-bold mt-1"
                      style={{ color: "var(--color-dark-slate-gray)" }}
                    >
                      {service.label}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "var(--color-cool-gray)" }}>
                    {service.description}
                  </p>

                  {/* CTA button */}
                  <button
                    onClick={() => router.push(service.href)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-semibold text-sm"
                    style={{
                      background:  isHovered ? theme.gradient : theme.accentLight,
                      color:       isHovered ? "var(--color-snow-white)" : theme.accent,
                      border:      `1.5px solid ${isHovered ? "transparent" : theme.accentBorder}`,
                      transition:  "background 0.3s ease, color 0.3s ease, border-color 0.3s ease",
                    }}
                  >
                    <span>Find {service.label}</span>
                    <motion.span
                      animate={{ x: isHovered ? 4 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-sm"
          style={{
            background: "color-mix(in oklch, var(--color-snow-white) 70%, transparent)",
            border:     "1px solid color-mix(in oklch, var(--color-snow-white) 60%, transparent)",
          }}
        >
          <div>
            <p className="font-bold text-lg" style={{ color: "var(--color-dark-slate-gray)" }}>
              Not sure where to start?
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-cool-gray)" }}>
              Let our AI guide you to the right specialist for your needs.
            </p>
          </div>
          <button
            onClick={() => router.push("/doctors")}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
            style={{
              background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green))",
              color:      "var(--color-snow-white)",
            }}
          >
            Talk to Hygieia AI
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}