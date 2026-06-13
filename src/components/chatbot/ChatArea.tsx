import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Loader2, Sparkles } from "lucide-react"
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [loadingStateIdx, setLoadingStateIdx] = useState(0)
  const isMounted = useRef(false)

  const scrollToBottom = (smooth = true) => {
    const container = scrollContainerRef.current
    if (!container) return
    container.scrollTop = smooth && isMounted.current
      ? container.scrollHeight
      : container.scrollHeight
  }

  useEffect(() => {
    // After first paint, mark as mounted so subsequent scrolls can be smooth
    const timer = setTimeout(() => { isMounted.current = true }, 100)
    return () => clearTimeout(timer)
  }, [])

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
    <div className="relative flex h-full min-h-0 flex-1 flex-col bg-gradient-to-b from-snow-white/70 via-white/75 to-snow-white/90">

      {/* Scroll Area */}
      <div ref={scrollContainerRef} className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-2 sm:px-6 sm:pb-4 scrollbar-none">

        {isFetchingHistory ? (
          <div className="flex justify-center items-center h-full pt-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-soft-blue" />
            </motion.div>
          </div>
        ) : isInitial ? (
          <div className="flex min-h-full items-center justify-center py-6 sm:py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-3xl space-y-5 text-center"
            >
              <div className="relative inline-block mx-auto">
                <Avatar className="relative z-10 mx-auto h-20 w-20 border-4 border-white bg-white p-2 shadow-lg">
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
                <h2 className="text-2xl font-bold leading-tight tracking-tight text-dark-slate-gray sm:text-3xl">
                  Welcome back,{" "}
                  <span className="text-soft-coral">
                    {profile.name}
                  </span>
                </h2>

                <p className="mx-auto max-w-xl text-sm leading-relaxed text-cool-gray sm:text-base">
                  Your AI health companion is ready. Ask about your appointments,
                  lab results, or general health concerns.
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full flex flex-col space-y-8 pb-4">
            <div className="h-2 w-full shrink-0" />{/* top spacer - prevents first message clip */}
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
                      className="w-1.5 h-1.5 bg-mint-green rounded-full"
                      animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />

                    <motion.div
                      className="w-1.5 h-1.5 bg-soft-coral rounded-full"
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
                      className="text-sm font-medium text-soft-coral"
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
      <div className="shrink-0 px-3 pt-2 pb-2 sm:px-4 bg-white/80 backdrop-blur-xl border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] z-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center bg-white rounded-[28px] shadow-sm border border-gray-200/60 focus-within:border-soft-blue/40 focus-within:shadow-md transition-all duration-300 overflow-hidden">
            <div className="pl-4 py-3 flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
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
                    ? "bg-soft-blue text-white hover:scale-105 hover:bg-soft-blue/90 hover:shadow-md"
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
