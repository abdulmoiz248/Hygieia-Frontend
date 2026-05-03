"use client"

import React, { useEffect, useState } from "react"
import { ChatSidebar } from "@/components/chatbot/ChatSidebar"
import { ChatArea } from "@/components/chatbot/ChatArea"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { useChatbotStore } from "@/store/patient/chatbot-store"
import { Menu, X } from "lucide-react"

export default function ChatbotPage() {
  const { fetchInitialProfile, profile } = usePatientProfileStore()
  const { activeConversationId } = useChatbotStore()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Ensure we have the profile loaded
  useEffect(() => {
    if (!profile.id) {
      fetchInitialProfile()
    }
  }, [profile.id, fetchInitialProfile])

  // Close sidebar on mobile when conversation changes
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [activeConversationId])

  return (
    <div className="relative w-full flex min-h-0 flex-row overflow-hidden border border-white/60 rounded-2xl shadow-xl bg-white/40 backdrop-blur-3xl h-full">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-dark-slate-gray/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="absolute top-4 left-4 z-50 md:hidden p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-gray-200/50 text-dark-slate-gray hover:bg-gray-50 transition-colors"
      >
        {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar - Desktop & Mobile */}
      <div className={`
        absolute md:relative z-40 h-full min-h-0 transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <ChatSidebar />
      </div>

      {/* Main Chat Area */}
      <ChatArea />
    </div>
  )
}

