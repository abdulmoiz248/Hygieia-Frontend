

"use client"

import { motion } from "framer-motion"
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText'
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import TextType from "@/blocks/TextAnimations/TextType/TextType"

import useNutritionistStore from "@/store/nutritionist/userStore"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"
import { AppointmentStatus } from "@/types/patient/appointment"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const splitFrom = { opacity: 0, y: 40 }
const splitTo = { opacity: 1, y: 0 }

export default function WelcomeSection() {
  const userName = useNutritionistStore((state) => state.profile?.name)
  const appointments = useAppointmentStore((state) => state.appointments)
  const upcomingToday = appointments.filter((apt) => apt.status === AppointmentStatus.Upcoming).length
    
  const [showDes, setShowDes] = useState(false)
  const showDesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const welcomeText = useMemo(
    () => (
      <span>
        <span className="text-soft-coral">Welcome, </span>
        <span className="text-dark-slate-gray">{userName}! 👋</span>
      </span>
    ),
    [userName]
  )

  const rotatingText = useMemo(
    () => [
      `🥗 You have ${upcomingToday} meal plans pending for review.`,
      "📋 Check and update today's client nutrition reports before sharing.",
      "⚠️ Verify dietary restrictions and allergies to avoid mistakes.",
      "💧 Promote healthy habits — remind clients to stay hydrated.",
    ],
    [upcomingToday]
  )

  const handleAnimationComplete = useCallback(() => {
    setShowDes((previous) => (previous ? previous : true))
  }, [])


  useEffect(() => {
    showDesTimerRef.current = setTimeout(() => setShowDes(true), 500)
    return () => {
      if (showDesTimerRef.current) {
        clearTimeout(showDesTimerRef.current)
      }
    }
  }, [])

  return (
   
       <motion.div variants={itemVariants}>
 
 <SplitText
   text={welcomeText}
   className="text-3xl font-bold mb-2"
   delay={100}
   duration={0.4}
   ease="power3.out"
   splitType="chars"
   from={splitFrom}
   to={splitTo}
   threshold={0.1}
   rootMargin="-100px"
   textAlign="center"
   onLetterAnimationComplete={handleAnimationComplete}
 />
 
 {showDes && (
   <div className="block mt-2 ">
     <TextType
       text={rotatingText}

       typingSpeed={75}
       pauseDuration={1500}
       showCursor={true}
       cursorCharacter="|"
     textColors={['-cool-gray']}
     className="font-bold"
     />
   </div>
 )}
 
    </motion.div>
  )
}
