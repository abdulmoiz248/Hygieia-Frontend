import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useChatbotStore } from "@/store/patient/chatbot-store"
import { usePatientProfileStore } from "@/store/patient/profile-store"

interface QuickRepliesProps {
  replies?: { label: string; send: string }[]
  disabled?: boolean
}

export function QuickReplies({ replies, disabled }: QuickRepliesProps) {
  const { sendMessage } = useChatbotStore()
  const { profile } = usePatientProfileStore()
  const patientId = profile.id

  if (!replies || replies.length === 0) return null

  const handleReply = (sendString: string) => {
    if (patientId && !disabled) {
      sendMessage(patientId, sendString)
    }
  }

  const colorVariants = [
    "border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-white",
    "border-mint-green text-mint-green hover:bg-mint-green hover:text-white",
    "border-soft-coral text-soft-coral hover:bg-soft-coral hover:text-white",
  ]

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {replies.map((reply, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReply(reply.send)}
            disabled={disabled}
            className={`rounded-full transition-colors ${colorVariants[index % colorVariants.length]}`}
          >
            {reply.label}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}