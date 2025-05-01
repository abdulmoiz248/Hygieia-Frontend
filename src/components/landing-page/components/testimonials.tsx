"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fitness Enthusiast",
    quote:
      "Hygieia has completely transformed my approach to health. The personalized recommendations and AI diagnostics are incredibly accurate!",
    avatar: "/doctor.png",
  },
  {
    name: "Dr. Michael Chen",
    role: "Cardiologist",
    quote:
      "As a healthcare professional, I'm impressed by Hygieia's accuracy. It's a valuable tool that complements traditional medical care.",
    avatar: "/doctor.png",
  },
  {
    name: "Aisha Patel",
    role: "Working Mom",
    quote:
      "The convenience of getting health assessments from home has been a game-changer for my family. Hygieia gives me peace of mind.",
    avatar: "/doctor.png",
  },
  {
    name: "James Wilson",
    role: "Marathon Runner",
    quote:
      "I use Hygieia to track my performance and health metrics. The insights have helped me optimize my training and recovery.",
    avatar: "/doctor.png",
  },
  {
    name: "Elena Rodriguez",
    role: "Wellness Coach",
    quote:
      "I recommend Hygieia to all my clients. The combination of ancient wisdom and modern AI creates a holistic approach to health.",
    avatar: "/doctor.png",
  },
]

export default function Testimonials() {
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!carouselRef.current) return

    let scrollAmount = 0
    const scrollSpeed = 1
    const gap = 16

    const scroll = () => {
      if (!carouselRef.current) return

      scrollAmount += scrollSpeed

      const itemWidth = carouselRef.current.querySelector("div")?.offsetWidth || 0
      const totalWidth = (itemWidth + gap) * testimonials.length

      if (scrollAmount >= totalWidth) {
        scrollAmount = 0
      }

      carouselRef.current.scrollLeft = scrollAmount

      requestAnimationFrame(scroll)
    }

    const animation = requestAnimationFrame(scroll)

    const handleMouseEnter = () => {
      cancelAnimationFrame(animation)
    }

    const handleMouseLeave = () => {
      requestAnimationFrame(scroll)
    }

    carouselRef.current.addEventListener("mouseenter", handleMouseEnter)
    carouselRef.current.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animation)
      if (carouselRef.current) {
        carouselRef.current.removeEventListener("mouseenter", handleMouseEnter)
        carouselRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <section className="py-20 px-4 md:px-10 bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]">
      <div className="max-w-7xl mx-auto">
        <motion.div
        
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0c2842] mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how Hygieia is changing lives around the world
          </p>
        </motion.div>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto space-x-4 pb-8 hide-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          {testimonials.concat(testimonials).map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-full md:w-[400px]"
            >
              <Card className="p-6 h-full border-0 shadow-lg">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-[#0c2842]">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>

                <blockquote className="text-gray-700 italic">"{testimonial.quote}"</blockquote>

                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
