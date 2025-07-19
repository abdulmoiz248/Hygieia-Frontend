"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: string
  suggestions?: string[]
}

const suggestionChips = [
  "What are my symptoms?",
  "Book an appointment",
  "Medication reminders",
  "Health tips",
  "Emergency contacts",
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your health assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
      suggestions: suggestionChips,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(content),
        sender: "bot",
        timestamp: new Date().toISOString(),
        suggestions: getRandomSuggestions(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getBotResponse = (userMessage: string): string => {
    const responses = [
      "I understand your concern. Let me help you with that. Based on your symptoms, I'd recommend consulting with a healthcare professional.",
      "That's a great question! For your health and safety, I suggest booking an appointment with a specialist who can provide personalized advice.",
      "I can help you with that. Here are some general recommendations, but please consult your doctor for specific medical advice.",
      "Thank you for sharing that information. Let me provide you with some helpful resources and next steps.",
       `${userMessage}` 
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getRandomSuggestions = (): string[] => {
    const allSuggestions = [
      "Tell me about preventive care",
      "How to manage stress?",
      "Healthy diet tips",
      "Exercise recommendations",
      "Sleep hygiene",
      "Mental health resources",
    ]
    return allSuggestions.slice(0, 3)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark-slate-gray">Health Assistant</h1>
        <p className="text-cool-gray">Get instant answers to your health questions</p>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="w-8 h-8 bg-soft-blue/20">
                      <AvatarFallback>
                        <Bot className="w-4 h-4 text-soft-blue" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[70%] ${message.sender === "user" ? "order-first" : ""}`}>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-soft-blue text-white ml-auto"
                          : "bg-gray-100 text-dark-slate-gray"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 bg-white hover:bg-soft-blue/10"
                            onClick={() => sendMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="w-8 h-8 bg-mint-green/20">
                      <AvatarFallback>
                        <User className="w-4 h-4 text-mint-green" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                <Avatar className="w-8 h-8 bg-soft-blue/20">
                  <AvatarFallback>
                    <Bot className="w-4 h-4 text-soft-blue" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cool-gray rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-cool-gray rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-cool-gray rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your health question..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage(inputValue)}
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="bg-soft-blue hover:bg-soft-blue/90"
              >
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
