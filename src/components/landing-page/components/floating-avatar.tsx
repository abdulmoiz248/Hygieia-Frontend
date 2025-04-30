"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, MessageCircle, Heart, Activity, Calendar, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FloatingAvatar() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: "Hello! I'm Hygieia AI. How can I help with your health today?", isBot: true },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message
    const userMessage = message
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }])
    setMessage("")

    // Show typing indicator
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)

      // Generate a contextual response based on keywords
      let response = "I'm here to help with your health questions. Could you provide more details?"

      const lowerCaseMessage = userMessage.toLowerCase()

      if (lowerCaseMessage.includes("headache") || lowerCaseMessage.includes("pain")) {
        response =
          "I notice you mentioned pain. Make sure you're staying hydrated and consider taking a break from screens. If your headache persists for more than 24 hours, please consult a healthcare professional."
      } else if (lowerCaseMessage.includes("sleep") || lowerCaseMessage.includes("tired")) {
        response =
          "Quality sleep is essential for health. Try to maintain a consistent sleep schedule, avoid screens before bed, and create a comfortable sleep environment. Our app can help track your sleep patterns."
      } else if (
        lowerCaseMessage.includes("diet") ||
        lowerCaseMessage.includes("food") ||
        lowerCaseMessage.includes("eat")
      ) {
        response =
          "A balanced diet is key to overall health. Our nutrition module can help you plan meals rich in nutrients. Would you like me to provide some healthy recipe suggestions?"
      } else if (lowerCaseMessage.includes("exercise") || lowerCaseMessage.includes("workout")) {
        response =
          "Regular physical activity is great for both physical and mental health! I can suggest exercises tailored to your fitness level and goals. What type of activities do you enjoy?"
      } else if (lowerCaseMessage.includes("stress") || lowerCaseMessage.includes("anxiety")) {
        response =
          "I'm sorry to hear you're feeling stressed. Deep breathing exercises, meditation, and physical activity can help manage stress. Would you like me to guide you through a quick relaxation technique?"
      }

      setMessages((prev) => [...prev, { text: response, isBot: true }])
    }, 1500)
  }

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Scroll when messages change
  useState(() => {
    scrollToBottom()
  }, [messages])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-8 right-8 z-50"
        style={{ animation: "float 3s ease-in-out infinite alternate" }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-[#2A5C82] to-[#34C759] text-white flex items-center justify-center shadow-lg"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-8 w-80 md:w-96 bg-white rounded-2xl shadow-2xl z-40 overflow-hidden"
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-[#2A5C82] to-[#34C759] p-4 text-white">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Hygieia Health Assistant</h3>
                  <p className="text-xs text-white/80">Online • Powered by AI</p>
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="h-80 overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-4 flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                  {msg.isBot && (
                    <div className="w-8 h-8 rounded-full bg-[#2A5C82] flex items-center justify-center mr-2 flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl py-2 px-4 max-w-[80%] ${
                      msg.isBot ? "bg-white border border-gray-200 text-gray-800" : "bg-[#2A5C82] text-white"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="mb-4 flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-[#2A5C82] flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="rounded-2xl py-3 px-4 bg-white border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="flex border-t border-gray-100 p-2">
              <button className="flex-1 p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                <Heart className="w-5 h-5 mx-auto" />
              </button>
              <button className="flex-1 p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                <Activity className="w-5 h-5 mx-auto" />
              </button>
              <button className="flex-1 p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 mx-auto" />
              </button>
              <button className="flex-1 p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                <Settings className="w-5 h-5 mx-auto" />
              </button>
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your health question..."
                className="flex-1 border border-gray-200 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A5C82]"
              />
              <Button type="submit" className="bg-[#2A5C82] hover:bg-[#1a3a5f] text-white rounded-l-none">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
