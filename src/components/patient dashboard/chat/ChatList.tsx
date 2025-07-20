import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ChatContact {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  specialty?: string
  lastActivity: Date
}

interface ChatListProps {
  contacts: ChatContact[]
  selectedContactId: string | null
  onSelect: (contact: ChatContact) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  isMobileView: boolean
}

export function ChatList({ contacts, selectedContactId, onSelect, searchQuery, onSearchChange, isMobileView }: ChatListProps) {
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.specialty?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTimestamp = (timestamp: string, messageTime: Date) => {
    const now = new Date()
    const diff = now.getTime() - messageTime.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (timestamp === "now") return "now"
    if (minutes < 1) return "now"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days === 1) return "Yesterday"
    return timestamp
  }

  return (
    <motion.div
      initial={isMobileView ? { x: -300 } : false}
      animate={isMobileView ? { x: 0 } : {}}
      exit={isMobileView ? { x: -300 } : {}}
      className={cn(
        "bg-snow-white border-r border-gray-200 flex flex-col",
        isMobileView ? "absolute inset-0 z-10" : "w-80",
      )}
    >
      {/* Chat List Header */}
      <div className="p-4 border-b border-gray-200 bg-snow-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-soft-coral">Messages</h2>
         
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-slate-gray w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 border-gray-300 focus:border-cool-gray focus:ring-1 focus:ring-cool-gray bg-gray-50 rounded-lg"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto ">
        <AnimatePresence>
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              className={cn(
                "p-4 cursor-pointer border-b border-gray-100 transition-all duration-200",
                selectedContactId === contact.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : "hover:bg-gray-50",
              )}
              onClick={() => onSelect(contact)}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-soft-blue border-2 border-cool-gray  text-snow-white font-semibold text-sm">
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                
                </div>
                <div className="flex-1 min-w-0 bg-snow-white ">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-dark-slate-gray truncate text-sm ">{contact.name}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatTimestamp(contact.timestamp, contact.lastActivity)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1 mr-2">{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <div className="w-5 h-5 bg-soft-coral rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-white font-medium">{contact.unread}</span>
                      </div>
                    )}
                  </div>
                  {contact.specialty && (
                    <Badge variant="outline" className="text-xs border-cool-gray text-snow-white bg-soft-coral mt-1">
                      {contact.specialty}
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 