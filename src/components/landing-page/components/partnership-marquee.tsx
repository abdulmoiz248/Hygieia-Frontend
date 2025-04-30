"use client"

import { useState } from "react"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

const partners = [
  "COMSATS University",
  "National Health Services",
  "MediPharm",
  "Global Health Initiative",
  "TechMed Solutions",
  "Healthcare Alliance",
  "Wellness Partners",
  "Medical Research Institute",
]

export default function PartnershipMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!marqueeRef.current) return

    const marquee = marqueeRef.current
    let animationId: number
    let position = 0

    const animate = () => {
      if (!isPaused) {
        position -= 1
        marquee.style.transform = `translateX(${position}px)`

        // Reset position when first item is out of view
        const firstItem = marquee.querySelector("div")
        if (firstItem) {
          const itemWidth = firstItem.offsetWidth
          if (position <= -itemWidth) {
            position += itemWidth
            // Move first item to the end
            marquee.appendChild(firstItem)
            marquee.style.transform = `translateX(${position}px)`
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isPaused])

  return (
    <section className="py-12 bg-[#0c2842] text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h3 className="text-xl font-bold">Trusted by Leading Organizations</h3>
      </motion.div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div ref={marqueeRef} className="flex items-center space-x-12 py-4" style={{ width: "fit-content" }}>
          {partners.concat(partners).map((partner, index) => (
            <div key={index} className="flex items-center bg-white/10 px-6 py-3 rounded-lg">
              <span className="text-lg font-medium">{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
