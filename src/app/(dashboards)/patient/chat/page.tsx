"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChatList, ChatContact } from "@/components/patient dashboard/chat/ChatList"
import { ChatHeader } from "@/components/patient dashboard/chat/ChatHeader"
import { ChatMessages, ChatMessage } from "@/components/patient dashboard/chat/ChatMessages"
import { ChatInput } from "@/components/patient dashboard/chat/ChatInput"
import { EmptyState } from "@/components/patient dashboard/chat/EmptyState"

const initialContacts: ChatContact[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    avatar: "/doctor.png",
    lastMessage: "How are you feeling today?",
    timestamp: "2 hours ago",
    unread: 0,
    online: false,
    specialty: "Cardiologist",
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "Dr. Emily Rodriguez",
    avatar: "/doctor.png",
    lastMessage: "Please take your medication on time",
    timestamp: "1 hour ago",
    unread: 2,
    online: true,
    specialty: "Pediatrician",
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Dr. Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40&text=DMC",
    lastMessage: "Your test results look good",
    timestamp: "30 min ago",
    unread: 0,
    online: true,
    specialty: "Dermatologist",
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "4",
    name: "Dr. Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40&text=DMC",
    lastMessage: "Your test results look good",
    timestamp: "30 min ago",
    unread: 0,
    online: true,
    specialty: "Dermatologist",
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "5",
    name: "Dr. Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40&text=DMC",
    lastMessage: "Your test results look good",
    timestamp: "30 min ago",
    unread: 0,
    online: true,
    specialty: "Dermatologist",
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
  },
]

const initialMessages: { [key: string]: ChatMessage[] } = {
  "1": [
    {
      id: "1",
      content: "Hello! How are you feeling today?",
      sender: "doctor",
      timestamp: "2:30 PM",
      status: "read",
      messageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      content: "I'm feeling much better, thank you doctor",
      sender: "user",
      timestamp: "2:35 PM",
      status: "read",
      messageTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
    },
  ],
  "2": [
    {
      id: "3",
      content: "Please take your medication on time",
      sender: "doctor",
      timestamp: "1:00 PM",
      status: "delivered",
      messageTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: "4",
      content: "Don't forget the evening dose",
      sender: "doctor",
      timestamp: "1:05 PM",
      status: "delivered",
      messageTime: new Date(Date.now() - 1 * 60 * 60 * 1000 + 5 * 60 * 1000),
    },
  ],
  "3": [
    {
      id: "5",
      content: "Your test results look good",
      sender: "doctor",
      timestamp: "12:30 PM",
      status: "read",
      messageTime: new Date(Date.now() - 30 * 60 * 1000),
    },
  ],
}

export default function WhatsAppChat({ className }: { className?: string }) {
  const [contacts, setContacts] = useState<ChatContact[]>(() =>
    initialContacts.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()),
  )
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null)
  const [allMessages, setAllMessages] = useState<{ [key: string]: ChatMessage[] }>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [allMessages, selectedContact?.id, scrollToBottom])

  const moveContactToTop = useCallback((contactId: string, newMessage?: string) => {
    setContacts((prev) => {
      const updatedContacts = prev.map((contact) => {
        if (contact.id === contactId) {
          return {
            ...contact,
            lastActivity: new Date(),
            lastMessage: newMessage || contact.lastMessage,
            timestamp: "now",
          }
        }
        return contact
      })
      return updatedContacts.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
    })
  }, [])

  const markMessagesAsRead = useCallback((contactId: string) => {
    setAllMessages((prev) => ({
      ...prev,
      [contactId]: prev[contactId]?.map((msg) => (msg.sender === "doctor" ? { ...msg, status: "read" } : msg)) || [],
    }))
    setContacts((prev) => prev.map((contact) => (contact.id === contactId ? { ...contact, unread: 0 } : contact)))
  }, [])

  const handleContactSelect = useCallback(
    (contact: ChatContact) => {
      setSelectedContact(contact)
      markMessagesAsRead(contact.id)
    },
    [markMessagesAsRead],
  )

  const sendMessage = useCallback(() => {
    if (!inputValue.trim() || !selectedContact) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      messageTime: new Date(),
    }

    setAllMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }))

    moveContactToTop(selectedContact.id, inputValue)
    setInputValue("")

    // Simulate message delivery and read status
    setTimeout(() => {
      setAllMessages((prev) => ({
        ...prev,
        [selectedContact.id]:
          prev[selectedContact.id]?.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)) ||
          [],
      }))
    }, 1000)

    setTimeout(() => {
      setAllMessages((prev) => ({
        ...prev,
        [selectedContact.id]:
          prev[selectedContact.id]?.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)) || [],
      }))
    }, 3000)
  }, [inputValue, selectedContact, moveContactToTop])

  const currentMessages = selectedContact ? allMessages[selectedContact.id] || [] : []

  // Mobile: Show chat list when no contact selected, show chat when contact selected
  // Desktop: Always show both
  const showChatList = !isMobileView || !selectedContact
  const showChat = !isMobileView || selectedContact

  return (
    <div className={cn("flex h-full bg-snow-white relative", className)}>
      {/* Chat List */}
      <AnimatePresence>
        {showChatList && (
          <ChatList
            contacts={contacts}
            selectedContactId={selectedContact?.id || null}
            onSelect={handleContactSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isMobileView={isMobileView}
          />
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <AnimatePresence>
        {showChat && selectedContact && (
          <motion.div
            initial={isMobileView ? { x: 300 } : false}
            animate={isMobileView ? { x: 0 } : {}}
            exit={isMobileView ? { x: 300 } : {}}
            className={cn("flex flex-col bg-white", isMobileView ? "absolute inset-0 z-20" : "flex-1")}
          >
            <ChatHeader
              contact={selectedContact}
              isMobileView={isMobileView}
              onBack={() => setSelectedContact(null)}
            />
            <div className="flex-1 overflow-y-auto p-4 bg-snow-white">
              <ChatMessages
                messages={currentMessages}
                currentUser="user"
                ref={messagesEndRef}
              />
            </div>
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSend={sendMessage}
              disabled={!inputValue.trim()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State for Desktop */}
      {!isMobileView && !selectedContact && <EmptyState />}
    </div>
  )
}
