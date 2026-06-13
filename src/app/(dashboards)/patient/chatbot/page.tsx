"use client"

import React, { useEffect, useState } from "react"
import { ChatSidebar } from "@/components/chatbot/ChatSidebar"
import { ChatArea } from "@/components/chatbot/ChatArea"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { useChatbotStore } from "@/store/patient/chatbot-store"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export default function ChatbotPage() {
  const { fetchInitialProfile, profile } = usePatientProfileStore()
  const { activeConversationId } = useChatbotStore()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    if (!profile.id) fetchInitialProfile()
  }, [profile.id, fetchInitialProfile])

  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [activeConversationId])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex h-full min-h-0 w-full flex-col gap-5"
    >
      <motion.div
        variants={itemVariants}
        className="shrink-0"
      >
        <h1 className="text-3xl font-bold text-soft-coral">AI Health Assistant</h1>
        <p className="mt-1 max-w-2xl text-cool-gray">
          Ask health questions, review your care history, and get helpful next-step guidance in one place.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="relative flex min-h-0 flex-1 flex-row overflow-hidden rounded-2xl border border-white/45 bg-white/45 shadow-sm backdrop-blur-xl"
      >
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-dark-slate-gray/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="absolute left-4 top-4 z-50 rounded-xl border border-white/60 bg-white/90 p-2 text-dark-slate-gray shadow-sm backdrop-blur-md transition-colors hover:bg-snow-white md:hidden"
          aria-label="Toggle chat history"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className={`
          absolute md:relative z-40 h-full min-h-0 transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          <ChatSidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <ChatArea />
        </div>
      </motion.div>
    </motion.div>
  )
}
