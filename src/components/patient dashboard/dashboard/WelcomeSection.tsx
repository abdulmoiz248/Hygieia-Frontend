

"use client"

import { motion } from "framer-motion"
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText'
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import TextType from "@/blocks/TextAnimations/TextType/TextType"
import { usePatientAppointmentsStore } from "@/store/patient/appointments-store"
import { usePatientProfileStore } from "@/store/patient/profile-store"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const splitFrom = { opacity: 0, y: 40 }
const splitTo = { opacity: 1, y: 0 }

export default function WelcomeSection() {
  const appointments = usePatientAppointmentsStore((state) => state.appointments)
  const userName = usePatientProfileStore((state) => state.profile?.name)
  const userEmail = usePatientProfileStore((state) => state.profile?.email)

  const [showDes, setShowDes] = useState(false)
  const showDesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const upcomingAppointmentsCount = useMemo(
    () => appointments.filter((apt) => apt.status === "upcoming").slice(0, 3).length,
    [appointments]
  )

  const welcomeText = useMemo(
    () => (
      <span>
        <span className="text-soft-coral">Welcome, </span>
        <span className="text-dark-slate-gray">{userName || userEmail}! 👋</span>
      </span>
    ),
    [userEmail, userName]
  )

  const rotatingText = useMemo(
    () => [
      `📅 You have ${upcomingAppointmentsCount} upcoming appointments`,
      "💊 Don’t forget to take your prescribed medicines.",
      "🧠 Remember to take short breaks for mental well-being.",
      "🏃‍♂️ Stay active — small steps make a big difference.",
    ],
    [upcomingAppointmentsCount]
  )

  const handleAnimationComplete = useCallback(() => {
    if (showDesTimerRef.current) {
      clearTimeout(showDesTimerRef.current)
    }

    showDesTimerRef.current = setTimeout(() => {
      setShowDes((previous) => (previous ? previous : true))
    }, 50)
  }, [])

  useEffect(() => {
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
   <div key="texttype-message" className="block mt-2 ">
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
