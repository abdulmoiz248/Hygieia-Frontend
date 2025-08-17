import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: "text" | "image" | "file"
  isRead: boolean
}

export interface Patient {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: "online" | "offline" | "away"
  isTyping?: boolean
}

interface ChatStore {
  patients: Patient[]
  selectedPatient: Patient | null
  messages: Record<string, Message[]>
  isLoading: boolean

  // Actions
  setPatients: (patients: Patient[]) => void
  setSelectedPatient: (patient: Patient | null) => void
  sendMessage: (patientId: string, content: string) => void
  markMessagesAsRead: (patientId: string) => void
  setPatientTyping: (patientId: string, isTyping: boolean) => void
  setLoading: (loading: boolean) => void
}

export const useChatStore = create<ChatStore>()(
  devtools(
    (set, get) => ({
      patients: [
        {
          id: "1",
          name: "Emma Wilson",
          lastMessage: "Thank you for the meal plan adjustments!",
          lastMessageTime: "2 min ago",
          unreadCount: 0,
          status: "online",
        },
        {
          id: "2",
          name: "Michael Chen",
          lastMessage: "I have a question about the carb portions",
          lastMessageTime: "15 min ago",
          unreadCount: 2,
          status: "online",
        },
        {
          id: "3",
          name: "Sarah Davis",
          lastMessage: "Weekly check-in: feeling great!",
          lastMessageTime: "1 hour ago",
          unreadCount: 0,
          status: "away",
        },
      ],
      selectedPatient: null,
      messages: {
        "1": [
          {
            id: "1",
            senderId: "1",
            senderName: "Emma Wilson",
            content: "Hi Dr. Johnson! I wanted to update you on my progress.",
            timestamp: "10:30 AM",
            type: "text",
            isRead: true,
          },
          {
            id: "2",
            senderId: "doctor",
            senderName: "Dr. Johnson",
            content: "That's great to hear! How are you feeling with the new meal plan?",
            timestamp: "10:32 AM",
            type: "text",
            isRead: true,
          },
          {
            id: "3",
            senderId: "1",
            senderName: "Emma Wilson",
            content:
              "Much better! I have more energy and I'm sleeping better too. Thank you for the meal plan adjustments!",
            timestamp: "10:35 AM",
            type: "text",
            isRead: true,
          },
        ],
        "2": [
          {
            id: "4",
            senderId: "2",
            senderName: "Michael Chen",
            content: "Hello, I have a question about the carb portions in my meal plan.",
            timestamp: "9:45 AM",
            type: "text",
            isRead: false,
          },
          {
            id: "5",
            senderId: "2",
            senderName: "Michael Chen",
            content: "Should I be measuring them cooked or uncooked?",
            timestamp: "9:46 AM",
            type: "text",
            isRead: false,
          },
        ],
      },
      isLoading: false,

      setPatients: (patients) => set({ patients }),

      setSelectedPatient: (patient) => set({ selectedPatient: patient }),

      sendMessage: (patientId, content) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: "doctor",
          senderName: "Dr. Johnson",
          content,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          isRead: true,
        }

        set((state) => ({
          messages: {
            ...state.messages,
            [patientId]: [...(state.messages[patientId] || []), newMessage],
          },
          patients: state.patients.map((p) =>
            p.id === patientId ? { ...p, lastMessage: content, lastMessageTime: "now" } : p,
          ),
        }))
      },

      markMessagesAsRead: (patientId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [patientId]: state.messages[patientId]?.map((msg) => ({ ...msg, isRead: true })) || [],
          },
          patients: state.patients.map((p) => (p.id === patientId ? { ...p, unreadCount: 0 } : p)),
        }))
      },

      setPatientTyping: (patientId, isTyping) => {
        set((state) => ({
          patients: state.patients.map((p) => (p.id === patientId ? { ...p, isTyping } : p)),
        }))
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: "chat-store" },
  ),
)
