"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot,  Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUser } from "@/lib/data"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const user = getUser()
  const userName = user.name
  const userDp = user.avatar

  const isInitial = messages.length === 0

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("chatMessages")
    if (saved) setMessages(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (!isInitial) scrollToBottom()
    sessionStorage.setItem("chatMessages", JSON.stringify(messages))
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

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(content),
        sender: "bot",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getBotResponse = (userMessage: string): string => {
    const responses = [
      "I'm here to help you with any health-related questions!",
      "Let's figure out what’s going on together.",
      "Ask me anything about health, symptoms, or appointments.",
      `${userMessage}`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleNewChat = () => {
    setMessages([])
    sessionStorage.removeItem("chatMessages")
  }

  return (
    <div className="h-[calc(100vh-8rem)] w-full flex flex-col relative">
      {isInitial ? (
        <div className="flex flex-1 items-center justify-center flex-col text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 w-full max-w-xl"
          >
            <h1 className="text-4xl font-bold text-dark-slate-gray">
              Hi <span className="text-soft-coral">{userName}</span> 👋
            </h1>

            <p className="text-cool-gray text-lg">
              I&apos;m your AI health assistant. What would you like to ask today?
            </p>
            <div className="w-full mt-6 flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage(inputValue)}
                placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-dark-slate-gray">
                Your <span className="text-soft-coral">Own Health Assistant</span>
              </h1>
              <p className="text-cool-gray text-sm">Ask anything. I got you.</p>
            </div>
          <Button
  onClick={handleNewChat}
  className="bg-gradient-to-r from-soft-blue to-mint-green text-white hover:opacity-90 transition-all duration-300 shadow-md px-4 py-2 rounded-xl text-sm font-semibold"
>
  🧹 New Chat
</Button>

          </div>

          <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
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
                        <Avatar className="w-8 h-8 bg-soft-blue">
                          <AvatarFallback>
                            <Bot className="w-4 h-4 text-snow-white" />
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
                      </div>

                      {message.sender === "user" && (
                        <Avatar className="w-8 h-8">
                          {userDp && (
                            <img
                              src={userDp}
                              alt={userName}
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                            />
                          )}
                          <AvatarFallback className="bg-mint-green text-white font-semibold">
                            {userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

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
                    {isTyping ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
