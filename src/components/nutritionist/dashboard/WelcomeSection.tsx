

"use client"

import { motion } from "framer-motion"
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText'
import { useState } from "react"
import TextType from "@/blocks/TextAnimations/TextType/TextType"

import useNutritionistStore from "@/store/nutritionist/userStore"
import { useAppointmentStore } from "@/store/nutritionist/appointment-store"
import { AppointmentStatus } from "@/types/patient/appointment"

export default function WelcomeSection() {

    const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}


     const {
    profile:user,
   
  loading
  } = useNutritionistStore()
     const { appointments,isLoading } = useAppointmentStore()
  const upcomingToday = appointments.filter((apt) => apt.status === AppointmentStatus.Upcoming).length
    
      const [showDes,setShowDes]=useState(false)
      const handleAnimationComplete = () => {
      setShowDes(true)
    };


    if(loading || isLoading){
      return <>loading...</>
    }
  return (
   
       <motion.div variants={itemVariants}>
 
 <SplitText
   text={   <span>
       <span className="text-soft-coral">Welcome, </span>
       <span className="text-dark-slate-gray">{user?.name}! 👋</span>
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
       text={ [

  `🥗 You have ${upcomingToday} meal plans pending for review.`,
  "📋 Check and update today's client nutrition reports before sharing.",
  "⚠️ Verify dietary restrictions and allergies to avoid mistakes.",
  "💧 Promote healthy habits — remind clients to stay hydrated."
]

}

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
