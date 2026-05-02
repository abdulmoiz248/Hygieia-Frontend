import React from "react"
import { motion } from "framer-motion"
import { User, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChatbotMessage } from "@/store/patient/chatbot-store"
import { UiComponentRenderer } from "./UiComponentRenderer"
import { QuickReplies } from "./QuickReplies"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { format } from "date-fns"

const parseMarkdown = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-dark-slate-gray">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-cool-gray/90">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('[') && part.endsWith(')')) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return <a key={i} href={match[2]} target="_blank" rel="noreferrer" className="text-soft-blue underline underline-offset-4 decoration-soft-blue/30 hover:decoration-soft-blue transition-colors duration-200">{match[1]}</a>;
      }
    }
    return <span key={i}>{part}</span>;
  });
};

interface Props {
  message: ChatbotMessage
  isLatest: boolean
}

export function MessageBubble({ message, isLatest }: Props) {
  const { profile } = usePatientProfileStore()
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 w-full group ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="shrink-0 mt-1">
        {isUser ? (
          <Avatar className="w-9 h-9 ring-2 ring-soft-blue/20 ring-offset-2 ring-offset-white shadow-sm transition-all duration-300 group-hover:ring-soft-blue/40">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-soft-blue to-mint-green text-white">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="relative">
            <Avatar className="w-9 h-9 bg-white border border-soft-blue/20 shadow-[0_2px_10px_-3px_rgba(72,148,168,0.3)] p-[2px] transition-transform duration-300 group-hover:scale-105">
              <AvatarImage src="/logo/logo.png" className="object-contain p-1" />
              <AvatarFallback className="bg-soft-blue/10 text-soft-blue">
                <Sparkles className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            {isLatest && message.status !== "error" && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-mint-green rounded-full border-2 border-white"></span>
            )}
          </div>
        )}
      </div>

      <div className={`flex flex-col w-full sm:max-w-[85%] max-w-[90%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Main Message Content */}
        {message.content && (
          <div
            className={`px-5 py-4 shadow-sm backdrop-blur-sm relative overflow-hidden ${
              isUser
                ? "bg-gradient-to-br from-soft-blue to-[#3a7c8e] text-white rounded-[24px] rounded-tr-sm shadow-soft-blue/20"
                : "bg-white/90 text-dark-slate-gray rounded-[24px] rounded-tl-sm border border-gray-100/80 shadow-gray-200/40"
            } ${message.status === "sending" ? "opacity-70 animate-pulse" : ""}`}
          >
            {/* Subtle gloss effect for user bubble */}
            {isUser && (
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            )}
            <div className={`text-[15px] whitespace-pre-wrap leading-[1.65] tracking-[0.01em] relative z-10 ${isUser ? "text-white" : "text-gray-700"}`}>
              {isUser ? message.content : parseMarkdown(message.content)}
            </div>
          </div>
        )}

        {/* UI Components */}
        {!isUser && message.uiComponents && message.uiComponents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, marginTop: 0 }}
            animate={{ opacity: 1, marginTop: 12 }}
            className="w-full space-y-3"
          >
            {message.uiComponents.map((comp, idx) => (
              <UiComponentRenderer key={`${message.id}-comp-${idx}`} component={comp} />
            ))}
          </motion.div>
        )}

        {/* Quick Replies */}
        {!isUser && isLatest && message.quickReplies && message.quickReplies.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4"
          >
            <QuickReplies replies={message.quickReplies} />
          </motion.div>
        )}

        {/* Metadata / Timestamp */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`flex items-center gap-2 mt-1.5 px-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
          <span className="text-[11px] text-cool-gray/50 font-medium">
            {message.createdAt ? format(new Date(message.createdAt), "h:mm a") : "Just now"}
          </span>
          {isUser && message.status === "error" && (
            <span className="text-[11px] text-soft-coral font-medium flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-soft-coral" />
              Failed to send
            </span>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

