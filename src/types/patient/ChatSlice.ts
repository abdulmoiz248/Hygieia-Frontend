import {  createSlice, type PayloadAction } from "@reduxjs/toolkit"

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

interface ChatState {
  contacts: ChatContact[]
  messages: { [key: string]: ChatMessage[] }
  selectedContactId: string | null
  searchQuery: string
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
  ],
}

const initialState: ChatState = {
  contacts: initialContacts,
  messages: initialMessages,
  selectedContactId: null,
  searchQuery: "",
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectContact: (state, action: PayloadAction<string>) => {
      state.selectedContactId = action.payload
    },
    clearSelection: (state) => {
      state.selectedContactId = null
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    sendMessage: (state, action: PayloadAction<{ contactId: string; content: string }>) => {
      const { contactId, content } = action.payload
      const now = new Date()

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: content.trim(),
        sender: "user",
        timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
        messageTime: now,
        type: "text",
      }

      // Add message to chat
      if (!state.messages[contactId]) {
        state.messages[contactId] = []
      }
      state.messages[contactId].push(newMessage)

      const contactIndex = state.contacts.findIndex((c) => c.id === contactId)
      if (contactIndex !== -1) {
        const contact = { ...state.contacts[contactIndex] }
        contact.lastMessage = content.trim()
        contact.timestamp = "now"
        contact.lastActivity = now

        // Remove contact from current position
        state.contacts.splice(contactIndex, 1)
        // Add to top of list
        state.contacts.unshift(contact)
      }
    },
    receiveMessage: (state, action: PayloadAction<{ contactId: string; content: string }>) => {
      const { contactId, content } = action.payload
      const now = new Date()

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: content.trim(),
        sender: "contact",
        timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "delivered",
        messageTime: now,
        type: "text",
      }

      // Add message to chat
      if (!state.messages[contactId]) {
        state.messages[contactId] = []
      }
      state.messages[contactId].push(newMessage)

      // Move conversation to top and increment unread count
      const contactIndex = state.contacts.findIndex((c) => c.id === contactId)
      if (contactIndex !== -1) {
        const contact = { ...state.contacts[contactIndex] }
        contact.lastMessage = content.trim()
        contact.timestamp = "now"
        contact.lastActivity = now

        // Only increment unread if not currently selected
        if (state.selectedContactId !== contactId) {
          contact.unread += 1
        }

        // Remove and add to top
        state.contacts.splice(contactIndex, 1)
        state.contacts.unshift(contact)
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const contactId = action.payload
      const contact = state.contacts.find((c) => c.id === contactId)
      if (contact) {
        contact.unread = 0
      }
    },
    updateContactActivity: (state, action: PayloadAction<string>) => {
      const contactId = action.payload
      const contactIndex = state.contacts.findIndex((c) => c.id === contactId)
      if (contactIndex !== -1) {
        const contact = { ...state.contacts[contactIndex] }
        contact.lastActivity = new Date()

        // Update timestamp display based on activity
        const now = new Date()
        const diffMinutes = Math.floor((now.getTime() - contact.lastActivity.getTime()) / (1000 * 60))

        if (diffMinutes < 1) {
          contact.timestamp = "now"
        } else if (diffMinutes < 60) {
          contact.timestamp = `${diffMinutes}m ago`
        } else if (diffMinutes < 1440) {
          const hours = Math.floor(diffMinutes / 60)
          contact.timestamp = `${hours}h ago`
        } else {
          const days = Math.floor(diffMinutes / 1440)
          contact.timestamp = `${days}d ago`
        }

        state.contacts[contactIndex] = contact
      }
    },
    sortContactsByActivity: (state) => {
      state.contacts.sort((a, b) => {
        // Sort by last activity, most recent first
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      })
    },
  },
})

export const {
  selectContact,
  clearSelection,
  setSearchQuery,
  sendMessage,
  receiveMessage,
  markAsRead,
  updateContactActivity,
  sortContactsByActivity,
} = chatSlice.actions



export default chatSlice.reducer