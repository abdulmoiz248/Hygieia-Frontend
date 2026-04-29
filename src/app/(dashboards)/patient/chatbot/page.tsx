"use client"

import React, { useEffect } from "react"
import { ChatSidebar } from "@/components/chatbot/ChatSidebar"
import { ChatArea } from "@/components/chatbot/ChatArea"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { useChatbotStore } from "@/store/patient/chatbot-store"

export default function ChatbotPage() {
  const { fetchInitialProfile, profile } = usePatientProfileStore()
  const { startNewChat, activeConversationId } = useChatbotStore()

  // Ensure we have the profile loaded
  useEffect(() => {
    if (!profile.id) {
      fetchInitialProfile()
    }
  }, [profile.id, fetchInitialProfile])

  // Reset chat if coming to the page afresh without an active conversation
  // Note: We only want to do this on initial mount if needed, 
  // but it's handled pretty well by the sidebar fetching.
  useEffect(() => {
    return () => {
      // Optional: Cleanup logic when leaving the chat page entirely
    }
  }, [])

  return (
    <div className="h-[calc(100vh-8rem)] w-full flex flex-row overflow-hidden border border-gray-200/60 rounded-xl shadow-sm bg-white/40">
      {/* Sidebar - Desktop */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <ChatArea />
    </div>
  )
}
