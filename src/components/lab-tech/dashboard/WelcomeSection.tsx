

"use client"

import { motion } from "framer-motion"
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText'
import { useState } from "react"
import TextType from "@/blocks/TextAnimations/TextType/TextType"
import useLabTechnicianStore from "@/store/lab-tech/userStore"
import { useLabStore } from "@/store/lab-tech/labTech"

export default function WelcomeSection() {

    const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}


   const user=useLabTechnicianStore().profile
   const {getPendingCount}=useLabStore()
   
    
      const [showDes,setShowDes]=useState(false)
      const handleAnimationComplete = () => {
      setShowDes(true)
    };
  return (
   
       <motion.div variants={itemVariants}>
 
 <SplitText
   text={   <span>
       <span className="text-soft-coral">Welcome back, </span>
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
       text={ [
  `🧪 You have ${getPendingCount()} samples pending for processing.`,
  "📋 Review and validate today's test reports before submission.",
  "⚠️ Double-check patient details to avoid labeling errors.",
  "🧼 Maintain lab hygiene — disinfect equipment regularly."
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
