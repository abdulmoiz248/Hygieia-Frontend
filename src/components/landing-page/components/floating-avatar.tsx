"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendChatMessage } from "../chatbot/action"

export default function FloatingAvatar() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ text: string; isBot: boolean; isHtml?: boolean }[]>([
    { text: "Hello! I'm Hygieia AI. How can I help with your health today?", isBot: true },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  const toggleChat = () => {
    setIsOpen(!isOpen)
    // Focus the input field when chat opens
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }

  const handleSendMessage = async(e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message
    const userMessage = message
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }])
    setMessage("")

    // Show typing indicator
    setIsTyping(true)

    try{
      const res=await sendChatMessage(userMessage) 
      setIsTyping(false)
      setMessages((prev) => [...prev, { text:res, isBot: true }])
   
    }catch(error){
     console.log(error)
     setIsTyping(false)
     setMessages((prev) => [...prev, { text: 'An Error cccured please try again later', isBot: true }])
    }
 
    
  }
  // Function to render message with markdown-like formatting
  const renderFormattedMessage = (text: string) => {
    // Replace **text** with bold
    const boldText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Convert line breaks to <br>
    const withLineBreaks = boldText.replace(/\n/g, "<br>")

    // Convert bullet points
    const withBullets = withLineBreaks.replace(/- (.*?)(<br|$)/g, "<li>$1</li>$2")

    // Wrap lists in <ul> tags if they contain <li>
    let finalHtml = withBullets
    if (finalHtml.includes("<li>")) {
      finalHtml = finalHtml.replace(/<li>(.*?)(<br><li>|<br>$|$)/g, "<li>$1</li>$2")
      finalHtml = finalHtml.replace(
        /(<li>.*?<\/li>)+/g,
        '<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0;">$&</ul>',
      )
    }

    return <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
  }

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <>
   
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 z-[100]"
            style={{ animation: "float 3s ease-in-out infinite alternate" }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleChat}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-[#2A5C82] to-[#34C759] text-white flex items-center justify-center shadow-lg"
            >
              <Bot className="w-8 h-8" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-[99] rounded-t-2xl sm:right-8 flex flex-col"
            style={{ maxHeight: "80vh" }}
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-[#2A5C82] to-[#34C759] p-4 text-white rounded-t-2xl flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Hygieia Health Assistant</h3>
                <p className="text-xs text-white/80">Online • Powered by AI</p>
              </div>
              <button onClick={toggleChat} className="ml-auto p-2 rounded-full hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-grow overflow-y-auto bg-gray-50" style={{ height: "calc(80vh - 140px)" }}>
              <div className="p-4">
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
                      {msg.isHtml ? renderFormattedMessage(msg.text) : <p className="text-sm">{msg.text}</p>}
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
            </div>

            {/* Chat input - Always visible at bottom */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-gray-100 flex bg-white sticky bottom-0 w-full"
            >
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your health question..."
                className="flex-1 border border-gray-200 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2A5C82]"
              />
              <Button
                type="submit"
                className="bg-[#2A5C82] hover:bg-[#1a3a5f] text-white rounded-l-none px-4 py-3 h-auto flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for float animation */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  )
}
