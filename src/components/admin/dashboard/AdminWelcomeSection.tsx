"use client"

import { motion } from "framer-motion"
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText"
import TextType   from "@/blocks/TextAnimations/TextType/TextType"
import { useState, useEffect } from "react"
import { useAdminProfile } from "@/hooks/admin/dashboard/useAdminProfile"

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

/** Returns true if the string looks like an email address */
function looksLikeEmail(str: string): boolean {
  return str.includes("@")
}

export default function AdminWelcomeSection() {
  const [showDes, setShowDes]     = useState(false)
  const { data: profile, isLoading } = useAdminProfile()

  // Prefer profile.name; reject it if empty or if the backend echoed the email instead
  const rawName  = profile?.name?.trim() ?? ""
  const adminName = rawName && !looksLikeEmail(rawName) ? rawName : "Admin"

  const handleAnimationComplete = () => setShowDes(true)

  useEffect(() => {
    // Safety fallback — show description even if animation callback doesn't fire
    const timer = setTimeout(() => setShowDes(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Wait until we know the name so SplitText doesn't re-animate on update
  if (isLoading) {
    return (
      <div className="h-16 animate-pulse bg-gray-100 rounded-xl w-72" />
    )
  }

  return (
    <motion.div variants={itemVariants}>
      <SplitText
        text={
          <span>
            <span className="text-soft-coral mt-4">Welcome,&nbsp;</span>
            <span className="text-dark-slate-gray">{adminName}! 👋</span>
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
              "⚙️ Ensure all system tools and features are working smoothly.",
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            textColors={["-cool-gray"]}
            className="font-bold"
          />
        </div>
      )}
    </motion.div>
  )
}
