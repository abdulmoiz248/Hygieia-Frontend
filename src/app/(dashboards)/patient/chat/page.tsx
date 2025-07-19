"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "doctor"
  timestamp: string
  status: "sent" | "delivered" | "read"
}

interface ChatContact {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  specialty?: string
}

const mockContacts: ChatContact[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Your test results look good. Let's schedule a follow-up.",
    timestamp: "2 min ago",
    unread: 2,
    online: true,
    specialty: "Cardiologist",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Please take the medication as prescribed.",
    timestamp: "1 hour ago",
    unread: 0,
    online: false,
    specialty: "Dermatologist",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "How are you feeling today?",
    timestamp: "Yesterday",
    unread: 1,
    online: true,
    specialty: "Pediatrician",
  },
]

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    content: "Hello! I've reviewed your recent blood work results.",
    sender: "doctor",
    timestamp: "10:30 AM",
    status: "read",
  },
  {
    id: "2",
    content: "That's great to hear! What do the results show?",
    sender: "user",
    timestamp: "10:32 AM",
    status: "read",
  },
  {
    id: "3",
    content:
      "Your cholesterol levels have improved significantly since your last visit. The medication is working well.",
    sender: "doctor",
    timestamp: "10:35 AM",
    status: "read",
  },
  {
    id: "4",
    content: "That's wonderful news! Should I continue with the same dosage?",
    sender: "user",
    timestamp: "10:37 AM",
    status: "delivered",
  },
]

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<ChatContact>(mockContacts[0])
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r bg-white">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-dark-slate-gray mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cool-gray w-4 h-4" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </div>

        {/* Contacts List */}
        <div className="overflow-y-auto">
          {mockContacts.map((contact) => (
            <motion.div
              key={contact.id}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              className={`p-4 cursor-pointer border-b transition-colors ${
                selectedContact.id === contact.id ? "bg-soft-blue/10 border-l-4 border-l-soft-blue" : ""
              }`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-mint-green rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-dark-slate-gray truncate">{contact.name}</h3>
                    <span className="text-xs text-cool-gray">{contact.timestamp}</span>
                  </div>
                  <p className="text-sm text-cool-gray truncate">{contact.lastMessage}</p>
                  {contact.specialty && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {contact.specialty}
                    </Badge>
                  )}
                </div>

                {contact.unread > 0 && (
                  <div className="w-5 h-5 bg-soft-blue rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{contact.unread}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {selectedContact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {selectedContact.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-mint-green rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-dark-slate-gray">{selectedContact.name}</h3>
              <p className="text-sm text-cool-gray">{selectedContact.online ? "Online" : "Last seen 2 hours ago"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] ${message.sender === "user" ? "order-first" : ""}`}>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.sender === "user" ? "bg-soft-blue text-white" : "bg-white text-dark-slate-gray shadow-sm"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div
                    className={`flex items-center gap-1 mt-1 text-xs text-cool-gray ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{message.timestamp}</span>
                    {message.sender === "user" && (
                      <div className="flex">
                        <div
                          className={`w-1 h-1 rounded-full ${
                            message.status === "read" ? "bg-soft-blue" : "bg-cool-gray"
                          }`}
                        />
                        <div
                          className={`w-1 h-1 rounded-full ml-0.5 ${
                            message.status === "read" ? "bg-soft-blue" : "bg-cool-gray"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button variant="ghost" size="icon">
              <Smile className="w-5 h-5" />
            </Button>
            <Button onClick={sendMessage} disabled={!inputValue.trim()} className="bg-soft-blue hover:bg-soft-blue/90">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
