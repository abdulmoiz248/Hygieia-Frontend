"use client"

import { motion } from "framer-motion"
import { CheckCheck, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "./ChatMessages"

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user"

  const getStatusIcon = () => {
    switch (message.status) {
      case "sent":
        return <Clock className="w-3 h-3" />
      case "delivered":
        return <CheckCheck className="w-3 h-3" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-600" />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn("max-w-[75%] sm:max-w-[60%]", isUser ? "order-2" : "order-1")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm",
            isUser
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-white text-slate-900 border border-slate-200 rounded-bl-md",
          )}
        >
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        </div>

        <div
          className={cn(
            "flex items-center gap-1 mt-1 text-xs text-slate-500",
            isUser ? "justify-end" : "justify-start",
          )}
        >
          <span>{message.timestamp}</span>
          {isUser && <div className="flex items-center ml-1">{getStatusIcon()}</div>}
        </div>
      </div>
    </motion.div>
  )
}
