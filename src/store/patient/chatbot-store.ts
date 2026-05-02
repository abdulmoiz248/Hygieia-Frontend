import { create } from "zustand"
import { devtools } from "zustand/middleware"
import {
  ConversationListItem,
  ChatHistoryMessage,
  UiComponent,
  PendingAction,
} from "@/types/patient-chat"
import * as chatbotApi from "@/api/patient/chatbotApi"

// We create a unified message type for the frontend that works for both local optimistic messages and fetched history
export interface ChatbotMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: string
  uiComponents?: UiComponent[]
  quickReplies?: { label: string; send: string }[]
  pendingAction?: PendingAction | null
  status?: "sending" | "sent" | "error" // Used for optimistic UI
}

interface ChatbotState {
  // Sidebar state
  conversations: ConversationListItem[]
  hasMoreConversations: boolean
  nextConversationBefore: string | null
  totalConversations: number
  isFetchingConversations: boolean

  // Active chat state
  activeConversationId: string | null
  messages: ChatbotMessage[]
  hasMoreHistory: boolean
  nextHistoryBefore: string | null
  isFetchingHistory: boolean
  isSending: boolean
  error: string | null

  // Actions
  fetchConversations: (patientId: string, loadMore?: boolean) => Promise<void>
  loadConversation: (patientId: string, conversationId: string) => Promise<void>
  startNewChat: () => void
  sendMessage: (patientId: string, content: string, confirmActionToken?: string) => Promise<void>
  confirmAction: (patientId: string, actionToken: string) => Promise<void>
  renameConversation: (patientId: string, conversationId: string, title: string) => Promise<void>
  deleteConversation: (patientId: string, conversationId: string) => Promise<void>
}

export const useChatbotStore = create<ChatbotState>()(
  devtools(
    (set, get) => ({
      conversations: [],
      hasMoreConversations: false,
      nextConversationBefore: null,
      totalConversations: 0,
      isFetchingConversations: false,

      activeConversationId: null,
      messages: [],
      hasMoreHistory: false,
      nextHistoryBefore: null,
      isFetchingHistory: false,
      isSending: false,
      error: null,

      fetchConversations: async (patientId, loadMore = false) => {
        const { isFetchingConversations, nextConversationBefore } = get()
        if (isFetchingConversations) return
        if (loadMore && !nextConversationBefore) return

        set({ isFetchingConversations: true, error: null })
        try {
          const params = {
            patientId,
            limit: 20,
            ...(loadMore && nextConversationBefore ? { before: nextConversationBefore } : {}),
          }
          const data = await chatbotApi.getConversations(params)
          set((state) => ({
            conversations: loadMore ? [...state.conversations, ...data.items] : data.items,
            hasMoreConversations: data.has_more,
            nextConversationBefore: data.next_before,
            totalConversations: data.total_conversations ?? state.totalConversations,
            isFetchingConversations: false,
          }))
          // If this is the initial fetch and there's no active conversation, auto-load the newest one
          if (!loadMore && data.items && data.items.length > 0 && !get().activeConversationId) {
            // fire-and-forget: load conversation history for the most recent conversation
            get().loadConversation(patientId, data.items[0].conversation_id).catch(() => {})
          }
        } catch (error: any) {
          set({ error: error?.message || "Failed to fetch conversations", isFetchingConversations: false })
        }
      },

      loadConversation: async (patientId, conversationId) => {
        set({
          activeConversationId: conversationId,
          messages: [],
          hasMoreHistory: false,
          nextHistoryBefore: null,
          isFetchingHistory: true,
          error: null,
        })

        try {
          const data = await chatbotApi.getChatHistory({ patientId, conversation_id: conversationId })
          // Assuming history comes oldest-to-newest, if it's newest-to-oldest we need to reverse it.
          // We will map it to our internal format.
          const mappedMessages: ChatbotMessage[] = data.items.map((msg) => ({
            id: msg.message_id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.created_at,
            uiComponents: msg.ui_components as UiComponent[],
            quickReplies: msg.quick_replies,
            pendingAction: msg.pending_action,
            status: "sent",
          }))

          set({
            messages: mappedMessages,
            hasMoreHistory: data.has_more,
            nextHistoryBefore: data.next_before,
            isFetchingHistory: false,
          })
        } catch (error: any) {
          set({ error: error?.message || "Failed to load conversation", isFetchingHistory: false })
        }
      },

      startNewChat: () => {
        set({
          activeConversationId: null,
          messages: [],
          hasMoreHistory: false,
          nextHistoryBefore: null,
          error: null,
        })
      },

      sendMessage: async (patientId, content, confirmActionToken) => {
        const { activeConversationId, messages } = get()

        const optimisticMessage: ChatbotMessage = {
          id: `temp-${Date.now()}`,
          role: "user",
          content,
          createdAt: new Date().toISOString(),
          status: "sending",
        }

        set({
          messages: [...messages, optimisticMessage],
          isSending: true,
          error: null,
        })

        try {
          const data = await chatbotApi.sendChatMessage({
            patientId,
            messages: [{ role: "user", content }],
            conversationId: activeConversationId ?? undefined,
            confirmActionToken,
          })

          const assistantMessage: ChatbotMessage = {
            id: `msg-${Date.now()}`,
            role: data.message.role,
            content: data.message.content,
            createdAt: data.message.created_at,
            uiComponents: data.ui_components,
            quickReplies: data.quick_replies,
            pendingAction: data.pending_action,
            status: "sent",
          }

          set((state) => {
            const updatedMessages = state.messages.map((m) =>
              m.id === optimisticMessage.id ? { ...m, status: "sent" } : m
            )
            return {
              messages: [...updatedMessages, assistantMessage],
              activeConversationId: data.conversation_id,
              isSending: false,
            }
          })

          // If this was a new conversation, refresh the sidebar
          if (!activeConversationId && data.conversation_id) {
             get().fetchConversations(patientId)
          } else {
             // We can also optimistically update the conversation preview in the list
             set((state) => {
                 const convs = [...state.conversations]
                 const idx = convs.findIndex(c => c.conversation_id === data.conversation_id)
                 if(idx >= 0) {
                     convs[idx].preview = data.message.content
                     convs[idx].updated_at = new Date().toISOString()
                     // Move to top
                     const [c] = convs.splice(idx, 1)
                     convs.unshift(c)
                 }
                 return { conversations: convs }
             })
          }
        } catch (error: any) {
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === optimisticMessage.id ? { ...m, status: "error" } : m
            ),
            error: error?.message || "Failed to send message",
            isSending: false,
          }))
        }
      },

      confirmAction: async (patientId, actionToken) => {
        const { activeConversationId, messages } = get()
        if (!activeConversationId) return

        try {
          set({ isSending: true, error: null })
          const data = await chatbotApi.confirmChatAction({
            patientId,
            conversationId: activeConversationId,
            actionToken,
          })
          
          const assistantMessage: ChatbotMessage = {
            id: `msg-${Date.now()}`,
            role: data.message.role,
            content: data.message.content,
            createdAt: data.message.created_at,
            uiComponents: data.ui_components,
            quickReplies: data.quick_replies,
            pendingAction: data.pending_action,
            status: "sent",
          }

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isSending: false,
          }))
          
        } catch (error: any) {
          set({ error: error?.message || "Failed to confirm action", isSending: false })
        }
      },

      renameConversation: async (patientId, conversationId, title) => {
          try {
            await chatbotApi.renameConversation(patientId, conversationId, title)
              set(state => ({
                  conversations: state.conversations.map(c => 
                      c.conversation_id === conversationId ? { ...c, title } : c
                  )
              }))
          } catch (error: any) {
              console.error("Failed to rename conversation", error)
          }
      },

      deleteConversation: async (patientId, conversationId) => {
          try {
              await chatbotApi.deleteConversation(conversationId, patientId)
              set(state => {
                  const newState: Partial<ChatbotState> = {
                      conversations: state.conversations.filter(c => c.conversation_id !== conversationId)
                  }
                  if (state.activeConversationId === conversationId) {
                      newState.activeConversationId = null
                      newState.messages = []
                  }
                  return newState
              })
          } catch (error: any) {
              console.error("Failed to delete conversation", error)
          }
      }
    }),
    { name: "patient-chatbot-store" }
  )
)
