"use client"

import { motion } from "framer-motion"
import SplitText from '@/blocks/TextAnimations/SplitText/SplitText'
import { useEffect, useState } from "react"
import TextType from "@/blocks/TextAnimations/TextType/TextType"

export default function AdminWelcomeSection() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const [showDes, setShowDes] = useState(false)
  const [adminName, setAdminName] = useState("Admin")

  useEffect(() => {
    const name = localStorage.getItem('name') || 'Admin'
    setAdminName(name)
  }, [])

  const handleAnimationComplete = () => {
    setShowDes(true)
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowDes(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div variants={itemVariants}>
      <SplitText
        text={
          <span>
            <span className="text-soft-coral">Welcome,</span>
            <span className="text-dark-slate-gray"> {adminName}! 👋</span>
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
        <div className="block mt-2">
          <TextType
            text={[
              "📊 Monitor platform activity and user engagement metrics.",
              "✅ Review and approve pending blog posts and content.",
              "📧 Manage communication channels and user inquiries.",
              "⚙️ Ensure all system tools and features are working smoothly."
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
