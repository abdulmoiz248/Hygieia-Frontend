

"use client"

import { motion } from "framer-motion"
import {  useSelector } from "react-redux"
import type { RootState } from "@/store/patient/store"
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText'
import { useState } from "react"
import TextType from "@/blocks/TextAnimations/TextType/TextType"

export default function WelcomeSection() {

    const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}


       const appointments = useSelector((state: RootState) => state.appointments.appointments)
      const upcomingAppointments = appointments.filter((apt) => apt.status === "upcoming").slice(0, 3)
      const user=useSelector((state: RootState) => state.profile)
    
      const [showDes,setShowDes]=useState(false)
      const handleAnimationComplete = () => {
      setShowDes(true)
    };
  return (
   
       <motion.div variants={itemVariants}>
 
 <SplitText
   text={   <span>
       <span className="text-soft-coral">Welcome, </span>
       <span className="text-dark-slate-gray">{user.name}! 👋</span>
     </span>
     }
   className="text-3xl font-bold mb-2"
   delay={100}
   duration={0.4}
   ease="power3.out"
   splitType="chars"
   from={{ opacity: 0, y: 40 }}
   to={{ opacity: 1, y: 0 }}
   threshold={0.1}
   rootMargin="-100px"
   textAlign="center"
   onLetterAnimationComplete={handleAnimationComplete}
 />
 
 {showDes && (
   <div className="block mt-2 ">
     <TextType
       text={[
         `📅 You have ${upcomingAppointments.length} upcoming appointments`,
         "💊 Don’t forget to take your prescribed medicines.",
         "🧠 Remember to take short breaks for mental well-being.",
         "🏃‍♂️ Stay active — small steps make a big difference."
       ]}
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
