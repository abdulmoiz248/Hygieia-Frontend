"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Landmark, Castle, Stethoscope, Cpu, Sparkles } from "lucide-react"

const timelineItems = [
  {
    era: "Ancient Rome",
    icon: <Landmark className="w-8 h-8" />,
    title: "Hygieia Goddess",
    description: "Ancient Rome: Public Baths Prevented Disease",
    year: "500 BCE",
  },
  {
    era: "Medieval",
    icon: <Castle className="w-8 h-8" />,
    title: "Middle Ages",
    description: "Monastic medicine preserved ancient healing knowledge",
    year: "500-1500 CE",
  },
  {
    era: "1950s",
    icon: <Stethoscope className="w-8 h-8" />,
    title: "Modern Medicine",
    description: "Antibiotics revolutionized infection treatment",
    year: "1950s",
  },
  {
    era: "Today",
    icon: <Cpu className="w-8 h-8" />,
    title: "Digital Health",
    description: "Telemedicine expands healthcare access globally",
    year: "Present",
  },
  {
    era: "Future",
    icon: <Sparkles className="w-8 h-8" />,
    title: "Hygieia AI",
    description: "AI-powered personalized healthcare for everyone",
    year: "Tomorrow",
  },
]

export default function HistoricalTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <section className="py-20 px-4 md:px-10 bg-gradient-to-b from-mint-green to-snow-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-slate-gray mb-4">
            From Ancient Wisdom to AI Innovation
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Trace the evolution of healthcare from the goddess Hygieia to our AI-powered future
          </p>
        </motion.div>

        <div ref={ref} className="relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-dark-slate-gray to-soft-blue rounded-full"></div>

          <div className="relative space-y-16">
            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex flex-col md:flex-row items-center md:items-start gap-6 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className="w-full md:w-5/12 text-center md:text-left">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <span className="text-sm font-semibold text-soft-coral">{item.year}</span>
                    <h3 className="text-xl font-bold text-soft-blue mt-1">{item.era}</h3>
                    <p className="text-cool-gray mt-2">{item.description}</p>
                  </motion.div>
                </div>

                {/* Icon */}
                <div className="w-full md:w-2/12 flex justify-center md:justify-center">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="w-16 h-16 rounded-full bg-white border-4 border-mint-green flex items-center justify-center z-10 shadow-lg text-[#2A5C82]"
                  >
                    {item.icon}
                  </motion.div>
                </div>

                {/* Spacer */}
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
