"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, ArrowRight, Heart, Brain, Activity, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MissionStats() {
  const heartbeatRef = useRef<SVGSVGElement>(null)
  const [dashOffset, setDashOffset] = useState(1000)

  useEffect(() => {
    // Use CSS animations instead of anime.js
    const interval = setInterval(() => {
      setDashOffset((prev) => (prev === 1000 ? 0 : 1000))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const router=useRouter();
  return (
    <section className="py-20  px-4 md:px-10 bg-gradient-to-b from-snow-white to-mint-green">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 relative"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark-slate-gray mb-6">Democratizing AI-Driven Healthcare</h2>
            <p className="text-lg text-gray-700 mb-8">
              At Hygieia, we believe that quality healthcare should be accessible to everyone, regardless of location or
              economic status. By combining ancient wisdom with cutting-edge AI technology, we&apos;re creating a future
              where personalized healthcare is just a tap away.
            </p>

            {/* Heartbeat SVG */}
            <div className="relative h-20 mb-8 ">
              <svg
                ref={heartbeatRef}
                width="100%"
                height="100%"
                viewBox="0 0 400 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="heartbeat-path"
                  d="M0,50 L50,50 L70,20 L100,80 L130,10 L160,90 L190,50 L220,50 L240,30 L270,70 L300,50 L400,50"
                  stroke="#34C759"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  strokeDasharray="1000"
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset  1.5s ease-in-out" }}
                
                />
              </svg>
            </div>

            {/* Mission Cards */}
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: "Preventive Care",
                  description: "Identify health risks before they become serious issues",
                  color: "#FF3B30",
                },
                {
                  icon: <Brain className="w-6 h-6" />,
                  title: "AI Diagnostics",
                  description: "Advanced algorithms trained on millions of medical records",
                  color: "#8A2BE2",
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Global Access",
                  description: "Healthcare for everyone, everywhere, anytime",
                  color: "#34C759",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0c2842]">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Doctor CTA Card */}
            <motion.div whileHover={{ scale: 1.05, rotateY: 5 }} className="transform perspective-1000">
              <Card className="p-6 border-2 border-[#2A5C82]/20 shadow-lg bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#2A5C82]/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-[#2A5C82]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-soft-blue">Are you a healthcare provider?</h3>
                    <p className="text-gray-600 mb-2">Join our network of top doctors</p>
                  </div>
                </div>
                <Button  onClick={() => router.push('/join-us')} className="w-full mt-4 bg-soft-blue hover:bg-[#1a3a5f] text-white">
                  Join Hygieia <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Diagnoses", value: "2M+", color: "#34C759", icon: <Activity className="w-6 h-6" /> },
                { label: "Accuracy", value: "95%", color: "#ff6f61", icon: <Brain className="w-6 h-6" /> },
                { label: "Countries", value: "120+", color: "#2A5C82", icon: <Users className="w-6 h-6" /> },
                { label: "Users", value: "5M+", color: "#2c3e50", icon: <User className="w-6 h-6" /> },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md p-6 text-center"
                >
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <CountUp value={stat.value} color={stat.color} delay={index * 0.2} />
                  <p className="text-gray-600 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Impact Chart */}
            <Card className="p-6 border-0 shadow-md">
              <h3 className="text-xl font-bold text-[#0c2842] mb-4">Global Health Impact</h3>

              <div className="space-y-4">
                {[
                  { label: "Early Disease Detection", percentage: 65, color: "#34C759" },
                  { label: "Healthcare Cost Reduction", percentage: 40, color: "#2A5C82" },
                  { label: "Remote Area Coverage", percentage: 85, color: "#8A2BE2" },
                  { label: "User Health Improvement", percentage: 72, color: "#FF9500" },
                ].map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <span className="font-medium" style={{ color: item.color }}>
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, delay: 0.2 * index }}
                        viewport={{ once: true }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* CTA Buttons */}
            <div className="space-y-4 mt-8">
              <Button  onClick={() => router.push('/login')} className="w-full py-6 bg-soft-blue text-white text-lg relative overflow-hidden group">
                <span>Login / Register</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Button>

              <Button  onClick={() => router.push('/e-commerce')} className="w-full py-6 bg-cool-gray text-white text-lg relative overflow-hidden group">
                <span>Track Your Fitness Now</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


function CountUp({ value, color, delay = 0 }: { value: string; color: string; delay?: number }) {
  const [count, setCount] = useState(0)
  const finalValue = Number.parseInt(value.replace(/\D/g, "")) || 100

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    // Delay the animation start
    const timer = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / 2000, 1) // 2 seconds duration

        // Easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3)

        const currentCount = Math.floor(easedProgress * finalValue)
        setCount(currentCount)

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)
    }, delay * 1000)

    return () => {
      clearTimeout(timer)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [finalValue, delay])

  return (
    <div className="text-4xl font-bold" style={{ color }}>
      {value.includes("+") ? `${count}+` : value.includes("%") ? `${count}%` : count}
    </div>
  )
}
