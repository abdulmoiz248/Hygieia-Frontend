import React from "react"
import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChatbotMessage } from "@/store/patient/chatbot-store"
import { UiComponentRenderer } from "./UiComponentRenderer"
import { QuickReplies } from "./QuickReplies"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { format } from "date-fns"

interface Props {
  message: ChatbotMessage
  isLatest: boolean
}

export function MessageBubble({ message, isLatest }: Props) {
  const { profile } = usePatientProfileStore()
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 w-full ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="shrink-0 mt-1">
        {isUser ? (
          <Avatar className="w-8 h-8">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-mint-green text-white">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="w-8 h-8 bg-soft-blue shadow-sm">
            <AvatarFallback className="bg-soft-blue text-white">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Main Message Content */}
        {message.content && (
          <div
            className={`p-3 rounded-2xl shadow-sm ${
              isUser
                ? "bg-soft-blue text-white rounded-tr-sm"
                : "bg-white text-dark-slate-gray rounded-tl-sm border border-gray-100"
            } ${message.status === "sending" ? "opacity-70" : ""}`}
          >
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
        )}

        {/* UI Components */}
        {!isUser && message.uiComponents && message.uiComponents.length > 0 && (
          <div className="w-full mt-2 space-y-3">
            {message.uiComponents.map((comp, idx) => (
              <UiComponentRenderer key={`${message.id}-comp-${idx}`} component={comp} />
            ))}
          </div>
        )}

        {/* Quick Replies (only show if it's the latest message from assistant) */}
        {!isUser && isLatest && message.quickReplies && message.quickReplies.length > 0 && (
          <QuickReplies replies={message.quickReplies} />
        )}

        {/* Metadata / Timestamp */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-cool-gray/50">
            {message.createdAt ? format(new Date(message.createdAt), "h:mm a") : "Just now"}
          </span>
          {isUser && message.status === "error" && (
            <span className="text-[10px] text-soft-coral font-medium">Failed to send</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
