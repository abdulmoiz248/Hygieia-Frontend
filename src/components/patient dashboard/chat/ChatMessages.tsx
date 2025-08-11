"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { ChatSidebar } from "./chat-sidebar"
import { ChatArea } from "./ChatArea"
import { EmptyChat } from "./EmptyState"


export interface ChatContact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  specialty: string
  lastActivity: Date
  role: "doctor" | "nurse" | "therapist" | "admin"
  department?: string
}

export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: string
  status: "sent" | "delivered" | "read"
  messageTime: Date
  type: "text" | "image" | "file" | "appointment" | "prescription"
  metadata?: {
    fileName?: string
    fileSize?: string
    appointmentDate?: string
    prescriptionDetails?: string
  }
}

const initialContacts: ChatContact[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=48&width=48&text=SJ",
    lastMessage: "Your blood pressure readings look much better this week",
    timestamp: "2m ago",
    unread: 0,
    online: true,
    specialty: "Cardiologist",
    role: "doctor",
    department: "Cardiology",
    lastActivity: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "2",
    name: "Dr. Emily Rodriguez",
    avatar: "/placeholder.svg?height=48&width=48&text=ER",
    lastMessage: "Please remember to take your medication with food",
    timestamp: "1h ago",
    unread: 2,
    online: true,
    specialty: "Internal Medicine",
    role: "doctor",
    department: "Internal Medicine",
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Nurse Jennifer Kim",
    avatar: "/placeholder.svg?height=48&width=48&text=JK",
    lastMessage: "Your appointment is confirmed for tomorrow at 2 PM",
    timestamp: "3h ago",
    unread: 0,
    online: false,
    specialty: "Registered Nurse",
    role: "nurse",
    department: "General Care",
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "4",
    name: "Dr. Michael Chen",
    avatar: "/placeholder.svg?height=48&width=48&text=MC",
    lastMessage: "Your test results are ready for review",
    timestamp: "1d ago",
    unread: 1,
    online: false,
    specialty: "Dermatologist",
    role: "doctor",
    department: "Dermatology",
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

const initialMessages: { [key: string]: ChatMessage[] } = {
  "1": [
    {
      id: "1",
      content: "Hello! I've reviewed your latest blood pressure readings from this week.",
      sender: "contact",
      timestamp: "2:30 PM",
      status: "read",
      messageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "text",
    },
    {
      id: "2",
      content: "Your numbers are looking much better! Keep up the great work with your medication routine.",
      sender: "contact",
      timestamp: "2:31 PM",
      status: "read",
      messageTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 1 * 60 * 1000),
      type: "text",
    },
    {
      id: "3",
      content: "Thank you Dr. Johnson! I've been following the diet plan you recommended.",
      sender: "user",
      timestamp: "2:35 PM",
      status: "read",
      messageTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
      type: "text",
    },
    {
      id: "4",
      content: "That's wonderful to hear. Let's schedule a follow-up in 2 weeks to monitor your progress.",
      sender: "contact",
      timestamp: "2:36 PM",
      status: "delivered",
      messageTime: new Date(Date.now() - 2 * 60 * 1000),
      type: "text",
    },
  ],
  "2": [
    {
      id: "5",
      content: "Good morning! Just a friendly reminder about your medication schedule.",
      sender: "contact",
      timestamp: "9:00 AM",
      status: "delivered",
      messageTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      type: "text",
    },
    {
      id: "6",
      content: "Please remember to take your medication with food to avoid stomach irritation.",
      sender: "contact",
      timestamp: "9:01 AM",
      status: "delivered",
      messageTime: new Date(Date.now() - 1 * 60 * 60 * 1000 + 1 * 60 * 1000),
      type: "text",
    },
  ],
}

export default function ModernPatientChat() {
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
      [contactId]: prev[contactId]?.map((msg) => (msg.sender === "contact" ? { ...msg, status: "read" } : msg)) || [],
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
      type: "text",
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
  const showSidebar = !isMobileView || !selectedContact
  const showChat = !isMobileView || selectedContact

  return (
    <div className="flex h-full w-full mt-0 bg-[var(--color-snow-white)] rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <ChatSidebar
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
        {showChat && selectedContact ? (
          <ChatArea
            contact={selectedContact}
            messages={currentMessages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={sendMessage}
            onBack={() => setSelectedContact(null)}
            isMobileView={isMobileView}
            messagesEndRef={messagesEndRef}
          />
        ) : (
          !isMobileView && <EmptyChat />
        )}
      </AnimatePresence>
    </div>
  )
}
