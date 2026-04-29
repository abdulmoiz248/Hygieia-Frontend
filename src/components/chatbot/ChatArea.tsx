import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Loader2, Bot } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useChatbotStore } from "@/store/patient/chatbot-store"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { MessageBubble } from "./MessageBubble"

export function ChatArea() {
  const { profile } = usePatientProfileStore()
  const patientId = profile.id
  
  const {
    activeConversationId,
    messages,
    isFetchingHistory,
    isSending,
    sendMessage,
  } = useChatbotStore()

  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isSending])

  const handleSend = () => {
    if (!inputValue.trim() || !patientId || isSending) return
    sendMessage(patientId, inputValue)
    setInputValue("")
  }

  const isInitial = !activeConversationId && messages.length === 0

  return (
    <div className="flex-1 flex flex-col h-full bg-white/60 relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        {isFetchingHistory ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-soft-blue" />
          </div>
        ) : isInitial ? (
          <div className="flex flex-1 items-center justify-center flex-col text-center h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 max-w-md"
            >
              <h1 className="text-3xl font-bold text-dark-slate-gray">
                Hi <span className="text-soft-coral">{profile.name}</span> 👋
              </h1>
              <p className="text-cool-gray">
                I'm your AI health assistant. Ask me anything about your health, appointments, or lab tests.
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {messages.map((message, idx) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                isLatest={idx === messages.length - 1} 
              />
            ))}
            
            {isSending && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                 <div className="shrink-0 mt-1">
                   <Avatar className="w-8 h-8 bg-soft-blue/20">
                     <AvatarFallback>
                       <Bot className="w-4 h-4 text-soft-blue" />
                     </AvatarFallback>
                   </Avatar>
                 </div>
                 <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-sm flex items-center h-[44px]">
                   <div className="flex gap-1.5">
                     <motion.div className="w-2 h-2 bg-soft-blue/50 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                     <motion.div className="w-2 h-2 bg-soft-blue/50 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                     <motion.div className="w-2 h-2 bg-soft-blue/50 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                   </div>
                 </div>
               </motion.div>
            )}
            
            <div ref={messagesEndRef} className="h-px w-full" />
          </div>
        )}
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-sm border-t">
        <div className="max-w-4xl mx-auto flex gap-2 items-end">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
                if(e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            }}
            placeholder="Type your health question..."
            className="flex-1 shadow-sm border-gray-200 focus-visible:ring-soft-blue min-h-[44px]"
            disabled={isSending || isFetchingHistory}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending || isFetchingHistory}
            className="bg-soft-blue hover:bg-soft-blue/90 h-[44px] w-[44px] p-0 shrink-0 shadow-sm"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </Button>
        </div>
        <div className="text-center mt-2">
            <span className="text-[10px] text-cool-gray/50">
                AI Assistant can make mistakes. Please verify important information.
            </span>
        </div>
      </div>
    </div>
  )
}
