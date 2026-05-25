import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Loader2, Sparkles, Activity, ShieldCheck, HeartPulse } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChatbotStore } from "@/store/patient/chatbot-store"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { MessageBubble } from "./MessageBubble"

const loadingStates = [
  "Analyzing your query...",
  "Consulting medical database...",
  "Choosing the best tool...",
  "Reviewing patient history...",
  "Formulating a response...",
  "Almost there..."
]

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
  const [loadingStateIdx, setLoadingStateIdx] = useState(0)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isSending, loadingStateIdx])

  useEffect(() => {
    if (isSending) {
      const interval = setInterval(() => {
        setLoadingStateIdx((prev) => (prev + 1) % loadingStates.length)
      }, 2500)

      return () => clearInterval(interval)
    } else {
      setLoadingStateIdx(0)
    }
  }, [isSending])

  const handleSend = () => {
    if (!inputValue.trim() || !patientId || isSending) return

    sendMessage(patientId, inputValue)
    setInputValue("")
  }

  const isInitial = !activeConversationId && messages.length === 0

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-gradient-to-b from-white/40 to-white/80 relative">

      {/* Sticky Header */}
      <div className="sticky top-0 z-30 shrink-0 bg-white/90 backdrop-blur-xl border-b border-gray-100/80">
        <div className="h-[3px] w-full bg-gradient-to-r from-soft-blue via-mint-green to-soft-coral" />

        {/* FIXED HEADER HEIGHT */}
        <div className="px-5 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-soft-blue to-mint-green flex items-center justify-center shadow-sm">
              <HeartPulse className="w-3.5 h-3.5 text-white" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-soft-coral leading-tight">
                Health Assistant
              </h2>

              <p className="text-[10px] text-cool-gray/60 leading-none">
                AI-powered health companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-mint-green/10 border border-mint-green/20 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-green animate-pulse" />

            <span className="text-[10px] font-semibold text-mint-green">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Decorative background */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-soft-blue/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-mint-green/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-4 scrollbar-none relative z-10">

        {isFetchingHistory ? (
          <div className="flex justify-center items-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-soft-blue" />
            </motion.div>
          </div>
        ) : isInitial ? (
          <div className="flex min-h-full items-center justify-center py-4 sm:py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-3xl space-y-6 sm:space-y-8 text-center"
            >
              <div className="relative inline-block mx-auto">
                <div className="absolute inset-0 bg-soft-blue/20 blur-2xl rounded-full" />

                <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-xl bg-white p-2 relative z-10">
                  <AvatarImage src="/logo/logo.png" className="object-contain" />

                  <AvatarFallback className="bg-soft-blue/10 text-soft-blue">
                    <Sparkles className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute bottom-0 right-0 w-6 h-6 bg-mint-green rounded-full border-4 border-white z-20 shadow-sm"
                />
              </div>

              <div className="space-y-3 px-2 sm:px-0">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-dark-slate-gray tracking-tight leading-tight">
                  Welcome back,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-soft-blue to-mint-green">
                    {profile.name}
                  </span>
                </h1>

                <p className="text-cool-gray text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                  Your AI health companion is ready. Ask about your appointments,
                  lab results, or general health concerns.
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full flex flex-col space-y-8 pb-2 pt-2">
            {messages.map((message, idx) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLatest={idx === messages.length - 1}
              />
            ))}

            {isSending && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex gap-3 w-full"
              >
                <div className="shrink-0 mt-1 relative">
                  <Avatar className="w-9 h-9 bg-white border border-soft-blue/20 shadow-[0_2px_10px_-3px_rgba(72,148,168,0.3)] p-[2px]">
                    <AvatarImage src="/logo/logo.png" className="object-contain p-1" />

                    <AvatarFallback>
                      <Sparkles className="w-4 h-4 text-soft-blue" />
                    </AvatarFallback>
                  </Avatar>

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute -inset-1 border-2 border-dashed border-soft-blue/30 rounded-full"
                  />
                </div>

                <div className="bg-white/90 backdrop-blur-md text-dark-slate-gray px-5 py-3.5 rounded-[24px] rounded-tl-sm border border-soft-blue/20 shadow-sm flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <motion.div
                      className="w-1.5 h-1.5 bg-soft-blue rounded-full"
                      animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />

                    <motion.div
                      className="w-1.5 h-1.5 bg-soft-blue rounded-full"
                      animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />

                    <motion.div
                      className="w-1.5 h-1.5 bg-soft-blue rounded-full"
                      animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>

                  <div className="w-[2px] h-4 bg-gray-200" />

                  <AnimatePresence mode="wait">
                    <motion.span
                      key={loadingStateIdx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium text-soft-blue"
                    >
                      {loadingStates[loadingStateIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} className="h-px w-full" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 mt-auto px-3 pt-2 pb-2 sm:px-4 bg-white/80 backdrop-blur-xl border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] z-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center bg-white rounded-[28px] shadow-sm border border-gray-200/60 focus-within:border-soft-blue/40 focus-within:shadow-md transition-all duration-300 overflow-hidden">
            <div className="pl-4 py-3 flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Message your AI Health Assistant..."
                className="w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none text-[15px] placeholder:text-cool-gray/60 resize-none min-h-[24px]"
                disabled={isSending || isFetchingHistory}
              />
            </div>

            <span className="hidden sm:inline-block text-[9px] text-cool-gray/40 font-medium leading-none pr-3 shrink-0 max-w-[140px] text-right">
              <span className="text-soft-blue/60">Hygieia AI</span> may make mistakes
            </span>

            <div className="pr-1.5 py-1.5 shrink-0">
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isSending || isFetchingHistory}
                className={`rounded-full h-10 w-10 p-0 transition-all duration-300 shadow-sm ${
                  inputValue.trim() && !isSending
                    ? "bg-gradient-to-r from-soft-blue to-mint-green hover:shadow-md hover:scale-105 text-white"
                    : "bg-gray-100 text-cool-gray"
                }`}
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send
                    className={`w-4 h-4 ${
                      inputValue.trim()
                        ? "translate-x-[-1px] translate-y-[1px]"
                        : ""
                    }`}
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}