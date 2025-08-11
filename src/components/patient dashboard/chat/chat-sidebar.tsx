"use client"

import { motion } from "framer-motion"
import { Search, MessageSquare, Users, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { ChatContact } from "./ChatMessages"

interface ChatSidebarProps {
  contacts: ChatContact[]
  selectedContactId: string | null
  onSelect: (contact: ChatContact) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  isMobileView: boolean
}

export function ChatSidebar({
  contacts,
  selectedContactId,
  onSelect,
  searchQuery,
  onSearchChange,
  isMobileView,
}: ChatSidebarProps) {
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-[var(--color-soft-blue)] text-white"
      case "nurse":
        return "bg-[var(--color-mint-green)] text-[var(--color-dark-slate-gray)]"
      case "therapist":
        return "bg-[var(--color-soft-coral)] text-white"
      default:
        return "bg-[var(--color-cool-gray)] text-white"
    }
  }

  return (
    <motion.div
      initial={isMobileView ? { x: -300 } : false}
      animate={isMobileView ? { x: 0 } : {}}
      exit={isMobileView ? { x: -300 } : {}}
      className={cn(
        "bg-white mt-0 border-r border-gray-200 flex flex-col",
        isMobileView ? "absolute inset-y-0 left-0 z-30 w-full" : "w-80 flex-shrink-0",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-dark-slate-gray)]">Messages</h1>
            <p className="text-sm text-[var(--color-cool-gray)]">Healthcare Team</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-50">
              <Users className="h-4 w-4 text-[var(--color-cool-gray)]" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-50">
              <Settings className="h-4 w-4 text-[var(--color-cool-gray)]" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-cool-gray)]" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[var(--color-soft-blue)] text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="p-2">
          {filteredContacts.map((contact) => (
            <motion.button
              key={contact.id}
              onClick={() => onSelect(contact)}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all duration-200 mb-1",
                "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-soft-blue)] focus:ring-offset-1",
                selectedContactId === contact.id
                  ? "bg-[var(--color-soft-blue)]/10 border border-[var(--color-soft-blue)]/20"
                  : "hover:bg-gray-50",
              )}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[var(--color-soft-blue)] to-[var(--color-mint-green)] text-white font-medium text-sm">
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-[var(--color-mint-green)] border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-[var(--color-dark-slate-gray)] truncate text-sm">{contact.name}</h3>
                    <div className="flex items-center gap-2">
                      {contact.unread > 0 && (
                        <Badge
                          variant="default"
                          className="bg-[var(--color-soft-coral)] hover:bg-[var(--color-soft-coral)]/90 h-4 min-w-4 text-xs px-1.5"
                        >
                          {contact.unread}
                        </Badge>
                      )}
                      <span className="text-xs text-[var(--color-cool-gray)]">{contact.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className={cn("text-xs px-2 py-0.5", getRoleColor(contact.role))}>
                      {contact.specialty}
                    </Badge>
                  </div>

                  <p className="text-xs text-[var(--color-cool-gray)] truncate">{contact.lastMessage}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <MessageSquare className="h-10 w-10 text-[var(--color-cool-gray)]/50 mb-3" />
            <p className="text-[var(--color-cool-gray)] text-center text-sm">No conversations found</p>
            <p className="text-[var(--color-cool-gray)]/70 text-xs text-center mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
