"use client"

import type React from "react"

import { motion } from "framer-motion"
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ChatContact, ChatMessage } from "./ChatMessages"
import { MessageBubble } from "./MessageBubble"

interface ChatAreaProps {
  contact: ChatContact
  messages: ChatMessage[]
  inputValue: string
  onInputChange: (value: string) => void
  onSendMessage: () => void
  onBack: () => void
  isMobileView: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function ChatArea({
  contact,
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  onBack,
  isMobileView,
  messagesEndRef,
}: ChatAreaProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-blue-100 text-blue-800"
      case "nurse":
        return "bg-green-100 text-green-800"
      case "therapist":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <motion.div
      initial={isMobileView ? { x: 300 } : false}
      animate={isMobileView ? { x: 0 } : {}}
      exit={isMobileView ? { x: 300 } : {}}
      className={cn("flex flex-col bg-white", isMobileView ? "absolute inset-0 z-20" : "flex-1")}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isMobileView && (
              <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}

            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                    {contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {contact.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">{contact.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={cn("text-xs", getRoleColor(contact.role))}>
                    {contact.specialty}
                  </Badge>
                  <span className="text-xs text-slate-500">{contact.online ? "Online" : "Last seen recently"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-6 space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-end gap-3">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 flex-shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && onSendMessage()}
              className="pr-12 bg-slate-50 border-slate-200 focus:bg-white rounded-full py-3"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={onSendMessage}
            disabled={!inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-10 w-10 p-0 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
