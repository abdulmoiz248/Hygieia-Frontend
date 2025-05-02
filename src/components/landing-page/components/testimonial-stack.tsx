"use client"

import type React from "react"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { useState, useRef } from "react"
import { User, Quote } from "lucide-react"
import Image from "next/image"

interface CardRotateProps {
  children: React.ReactNode
  onSendToBack: () => void
  sensitivity: number
}

function CardRotate({ children, onSendToBack, sensitivity }: CardRotateProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])

  function handleDragEnd(_: never, info: { offset: { x: number; y: number } }) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack()
    } else {
      x.set(0)
      y.set(0)
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  )
}

interface Testimonial {
  id: number
  quote: string
  name: string
  role: string
  rating: number
  avatar?: string
  accentColor?: string
}

interface TestimonialStackProps {
  randomRotation?: boolean
  sensitivity?: number
  cardDimensions?: { width: number; height: number }
  sendToBackOnClick?: boolean
  testimonials?: Testimonial[]
  animationConfig?: { stiffness: number; damping: number }
}

export default function TestimonialStack({
  randomRotation = true,
  sensitivity = 150,
  cardDimensions = { width: 320, height: 240 },
  testimonials = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = true,
}: TestimonialStackProps) {
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      quote:
        "This health platform transformed my wellness journey. The personalized recommendations and easy tracking tools have helped me achieve my health goals faster than I expected.",
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      rating: 5,
      accentColor: "soft-blue",
    },
    {
      id: 2,
      quote:
        "As someone with chronic health issues, this platform has been a game-changer. The symptom tracker and doctor connection features have made managing my condition so much easier.",
      name: "Michael Chen",
      role: "Patient Advocate",
      rating: 5,
      accentColor: "mint-green",
    },
    {
      id: 3,
      quote:
        "The climate health feature is brilliant! I never realized how weather changes were affecting my allergies until I started using this app. Now I can plan ahead and feel better.",
      name: "Priya Sharma",
      role: "Allergy Sufferer",
      rating: 4,
      accentColor: "soft-coral",
    },
    {
      id: 4,
      quote:
        "As a healthcare professional, I recommend this platform to all my patients. The educational resources and interactive tools help them understand their health better.",
      name: "Dr. James Wilson",
      role: "Family Physician",
      rating: 5,
      accentColor: "soft-blue",
    },
  ]

  const [cards, setCards] = useState(testimonials.length ? testimonials : defaultTestimonials)

  // Use a ref to store rotation values to ensure consistency between renders
  const rotationValues = useRef<number[]>([])

  // Initialize rotation values if they don't exist yet
  if (rotationValues.current.length === 0 && randomRotation) {
    // Generate fixed rotation values for each card
    rotationValues.current = Array(cards.length)
      .fill(0)
      .map(() => Math.floor(Math.random() * 8) - 4) // Fixed integer values between -4 and 4
  }

  const sendToBack = (id: number) => {
    setCards((prev) => {
      const newCards = [...prev]
      const index = newCards.findIndex((card) => card.id === id)
      const [card] = newCards.splice(index, 1)
      newCards.unshift(card)

      // Rearrange rotation values to match the new card order
      if (randomRotation && rotationValues.current.length > 0) {
        const rotationValue = rotationValues.current[index]
        rotationValues.current.splice(index, 1)
        rotationValues.current.unshift(rotationValue)
      }

      return newCards
    })
  }

  const getAccentColor = (color?: string) => {
    switch (color) {
      case "soft-blue":
        return "bg-soft-blue/10 border-soft-blue/20"
      case "mint-green":
        return "bg-mint-green/10 border-mint-green/20"
      case "soft-coral":
        return "bg-soft-coral/10 border-soft-coral/20"
      default:
        return "bg-soft-blue/10 border-soft-blue/20"
    }
  }

  const getTextColor = (color?: string) => {
    switch (color) {
      case "soft-blue":
        return "text-soft-blue"
      case "mint-green":
        return "text-mint-green"
      case "soft-coral":
        return "text-soft-coral"
      default:
        return "text-soft-blue"
    }
  }

 

  return (
    <div
      className="relative mx-auto"
      style={{
        width: `${cardDimensions.width}px`,
        height: `${cardDimensions.height + 40}px`,
        perspective: 1200,
      }}
      
    >
      {cards.map((card, index) => {
        // Use consistent rotation values from the ref
        const rotateValue = randomRotation ? rotationValues.current[index] || 0 : 0

        return (
          <CardRotate key={card.id} onSendToBack={() => sendToBack(card.id)} sensitivity={sensitivity}>
            <motion.div
              className={`rounded-2xl overflow-hidden border-2 border-snow-white shadow-lg ${getAccentColor(
                card.accentColor,
              )}`}
              onClick={() => sendToBackOnClick && sendToBack(card.id)}
              style={{
                width: `${cardDimensions.width}px`,
                height: `${cardDimensions.height}px`,
              }}
              
              animate={{
                rotateZ: (cards.length - index - 1) * 3 + rotateValue,
                scale: 1 + index * 0.05 - cards.length * 0.05,
                boxShadow:
                  index === cards.length - 1
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transformOrigin: "90% 90%",
              }}
              initial={{
                rotateZ: (cards.length - index - 1) * 3 + rotateValue,
                scale: 1 + index * 0.05 - cards.length * 0.05,
                boxShadow:
                  index === cards.length - 1
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transformOrigin: "90% 90%",
              }}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
            >
              <div className="w-full h-full bg-snow-white p-6 flex flex-col justify-between">
                <div className="flex-1 flex flex-col">
                  <div className={`mb-3 ${getTextColor(card.accentColor)}`}>
                    <Quote className="w-8 h-8 opacity-70" />
                  </div>
                  <p className="text-dark-slate-gray text-sm md:text-base flex-1 overflow-hidden">
                    {card.quote.length > 150 ? `${card.quote.substring(0, 150)}...` : card.quote}
                  </p>
                   
                </div>
                <div className="flex items-center mt-4 pt-3 border-t border-cool-gray/10">
                  {card.avatar ? (
                    <Image
                      fill
                      src={card.avatar }
                      alt={card.name}
                      className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-snow-white shadow-sm"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getAccentColor(
                        card.accentColor,
                      )}`}
                    >
                      <User className={`w-5 h-5 ${getTextColor(card.accentColor)}`} />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-dark-slate-gray">{card.name}</h4>
                    <p className="text-cool-gray text-xs">{card.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </CardRotate>
        )
      })}
      <div className="absolute bottom-0 left-0 right-0 text-center text-cool-gray text-xs py-2">
        Drag or click to shuffle testimonials
      </div>
    </div>
  )
}
