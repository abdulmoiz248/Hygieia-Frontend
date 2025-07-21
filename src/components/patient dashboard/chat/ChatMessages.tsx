import { AnimatePresence, motion } from "framer-motion"
import { Check, CheckCheck } from "lucide-react"
import { forwardRef, useEffect, useRef } from "react"

export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "doctor"
  timestamp: string
  status: "sent" | "delivered" | "read"
  messageTime: Date
}

interface ChatMessagesProps {
  messages: ChatMessage[]
  currentUser: "user" | "doctor"
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages, currentUser }) => {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
      <div className="space-y-3">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[75%] sm:max-w-[60%]">
                <div
                  className={`p-3 rounded-2xl shadow-sm ${
                    message.sender === currentUser
                      ? "bg-soft-blue text-white rounded-br-md"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">{message.content}</p>
                </div>
                <div
                  className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                    message.sender === currentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <span className="text-soft-coral">{message.timestamp}</span>
                  {message.sender === currentUser && (
                    <div className="flex items-center ml-1">
                      {message.status === "sent" && <Check className="w-3 h-3" />}
                      {message.status === "delivered" && <CheckCheck className="w-3 h-3" />}
                      {message.status === "read" && <CheckCheck className="w-3 h-3 text-soft-coral" />}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>
    )
  }
)
ChatMessages.displayName = "ChatMessages"
