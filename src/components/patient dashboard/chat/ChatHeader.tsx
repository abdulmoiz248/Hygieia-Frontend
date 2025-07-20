import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {  ArrowLeft } from "lucide-react"

export interface ChatContact {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  specialty?: string
  isTyping?: boolean
  lastActivity: Date
}

interface ChatHeaderProps {
  contact: ChatContact
  isMobileView: boolean
  onBack: () => void
}

export function ChatHeader({ contact, isMobileView, onBack }: ChatHeaderProps) {
  return (
    <div className="p-4 bg-soft-blue border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobileView && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={contact.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                {contact.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            {contact.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-snow-white truncate">{contact.name}</h3>
            
          </div>
        </div>
       
      </div>
    </div>
  )
} 