"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { Card } from "@/components/ui/card"

const leaderboardEntries = [
  { name: "Sara", achievement: "10,000 Steps", icon: "🏆", color: "#FFD700" },
  { name: "Michael", achievement: "30-Day Streak", icon: "🔥", color: "#FF4500" },
  { name: "Aisha", achievement: "Perfect Sleep Score", icon: "😴", color: "#8A2BE2" },
  { name: "James", achievement: "Nutrition Master", icon: "🥗", color: "#34C759" },
  { name: "Elena", achievement: "Meditation Guru", icon: "🧘", color: "#2A5C82" },
]

export default function Leaderboard() {
  const globeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!globeRef.current) return

    const createPulsingDot = () => {
      const dot = document.createElement("div")
      dot.className = "absolute w-2 h-2 bg-[#34C759] rounded-full animate-ping"

      // Random position on the globe
      const left = Math.random() * 80 + 10 // 10-90%
      const top = Math.random() * 80 + 10 // 10-90%

      dot.style.left = `${left}%`
      dot.style.top = `${top}%`

      // Random animation duration
      const duration = Math.random() * 2 + 1 // 1-3s
      dot.style.animationDuration = `${duration}s`

      // Remove after animation
      setTimeout(
        () => {
          dot.remove()
        },
        duration * 1000 * 3,
      )

      return dot
    }

    const interval = setInterval(() => {
      if (globeRef.current) {
        globeRef.current.appendChild(createPulsingDot())
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-4 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0c2842] mb-4">Leaderboard & Global Impact</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how Hygieia users around the world are improving their health
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-2xl font-bold text-[#0c2842] mb-6 flex items-center">
                <span className="mr-2">🏆</span> Top Achievers
              </h3>

              <div className="space-y-4">
                {leaderboardEntries.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-4 text-xl"
                      style={{ backgroundColor: `${entry.color}20`, color: entry.color }}
                    >
                      {entry.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[#0c2842]">{entry.name}</div>
                      <div className="text-sm text-gray-500">{entry.achievement}</div>
                    </div>
                    <div className="text-2xl">{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎖️"}</div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Global Impact */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <Card className="p-6 shadow-lg border-0 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-[#0c2842] mb-6 flex items-center">
                <Globe className="w-6 h-6 mr-2" /> Global Impact
              </h3>

              <div className="flex-1 relative">
                <div
                  ref={globeRef}
                  className="w-full h-80 rounded-xl bg-gradient-to-b from-[#2A5C82]/10 to-[#34C759]/10 relative overflow-hidden flex items-center justify-center"
                >
                  <div className="w-64 h-64 rounded-full bg-[#2A5C82]/20 relative overflow-hidden border border-[#2A5C82]/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Globe className="w-40 h-40 text-[#2A5C82]/40" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Active Users</div>
                    <div className="text-2xl font-bold text-[#2A5C82]">5M+</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Countries</div>
                    <div className="text-2xl font-bold text-[#8A2BE2]">120+</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Health Checks</div>
                    <div className="text-2xl font-bold text-[#34C759]">50M+</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Lives Improved</div>
                    <div className="text-2xl font-bold text-[#FF9500]">10M+</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
