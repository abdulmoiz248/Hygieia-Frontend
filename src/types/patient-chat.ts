export interface ChatRequest {
  patientId: string
  messages: { role: string; content: string }[]
  conversationId?: string
  confirmActionToken?: string
}

export interface ChatConfirmRequest {
  patientId: string
  conversationId: string
  actionToken: string
}

export interface ChatMessageOut {
  role: 'assistant' | 'user' | 'system'
  content: string
  created_at: string
}

export interface PendingAction {
  action: string
  action_token: string
  summary: string
  args: Record<string, unknown>
}

export interface ChatHistoryMessage {
  message_id: string
  conversation_id: string
  role: 'assistant' | 'user' | 'system'
  content: string
  created_at: string
  ui_components?: Record<string, unknown>[]
  quick_replies?: { label: string; send: string }[]
  pending_action?: PendingAction | null
}

export interface ConversationListItem {
  conversation_id: string
  title: string
  preview: string
  created_at: string
  updated_at: string
  archived_at: string | null
  message_count: number
  last_message_role: 'assistant' | 'user' | 'system'
}

export interface ChatMeta {
  model: string
  latency_ms: number
  error?: string
}

export type UiComponent = Record<string, unknown> & { type: string }

export interface ChatResponseData {
  conversation_id: string
  message: ChatMessageOut
  ui_components: UiComponent[]
  quick_replies: { label: string; send: string }[]
  pending_action: PendingAction | null
  meta: ChatMeta
}

export interface ChatHistoryResponseData {
  items: ChatHistoryMessage[]
  has_more: boolean
  next_before: string | null
}

export interface ConversationListResponseData {
  items: ConversationListItem[]
  has_more: boolean
  next_before: string | null
  total_conversations?: number
}
