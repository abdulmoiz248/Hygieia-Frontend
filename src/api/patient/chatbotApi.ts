import api from "@/lib/axios"
import type {
  ChatRequest,
  ChatConfirmRequest,
  ChatResponseData,
  ChatHistoryResponseData,
  ConversationListResponseData,
} from "@/types/patient-chat"

const BASE_URL = "/recommendations/chat"

type ApiEnvelope<T> = {
  data?: T | ApiEnvelope<T>
  success?: boolean
  message?: string
  statusCode?: number
}

const getAuthHeaders = () => {
  if (typeof window === "undefined") return undefined
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : undefined
}

const unwrapData = <T>(payload: unknown): T => {
  const first = payload as ApiEnvelope<T> | T
  if (first && typeof first === "object" && "data" in (first as ApiEnvelope<T>)) {
    const d1 = (first as ApiEnvelope<T>).data
    if (d1 && typeof d1 === "object" && "data" in (d1 as ApiEnvelope<T>)) {
      return (d1 as ApiEnvelope<T>).data as T
    }
    return d1 as T
  }
  return first as T
}

/**
 * Send a chat message
 */
export async function sendChatMessage(data: ChatRequest): Promise<ChatResponseData> {
  const response = await api.post(BASE_URL, data, { headers: getAuthHeaders() })
  return unwrapData<ChatResponseData>(response.data)
}

/**
 * Confirm a pending action
 */
export async function confirmChatAction(data: ChatConfirmRequest): Promise<ChatResponseData> {
  const response = await api.post(`${BASE_URL}/confirm`, data, { headers: getAuthHeaders() })
  return unwrapData<ChatResponseData>(response.data)
}

/**
 * Get a list of conversations for the sidebar
 */
export async function getConversations(params: {
  patientId: string
  limit?: number
  before?: string
  include_archived?: boolean
  search?: string
}): Promise<ConversationListResponseData> {
  const response = await api.get(
    `${BASE_URL}/conversations/${params.patientId}`,
    { params: { 
        limit: params.limit, 
        before: params.before,
        include_archived: params.include_archived,
        search: params.search
    }, headers: getAuthHeaders() }
  )
  return unwrapData<ConversationListResponseData>(response.data)
}

/**
 * Get the history for a specific conversation
 */
export async function getChatHistory(params: {
  patientId: string
  conversation_id: string
  limit?: number
  before?: string
}): Promise<ChatHistoryResponseData> {
  const response = await api.get(
    `${BASE_URL}/history/${params.patientId}`,
    { params: {
        conversation_id: params.conversation_id,
        limit: params.limit,
        before: params.before
    }, headers: getAuthHeaders() }
  )
  return unwrapData<ChatHistoryResponseData>(response.data)
}

/**
 * Rename a conversation
 */
export async function renameConversation(
  
   patientId: string,conversationId: string, title: string 
): Promise<void> {
  await api.patch(
    `${BASE_URL}/${conversationId}/title`,
    {
      title: title,
      patientId: patientId,
      patient_id: patientId,
    },
    { headers: getAuthHeaders() }
  )
}

/**
 * Delete / soft-archive a conversation
 */
export async function deleteConversation(conversationId: string, patientId: string): Promise<void> {
  await api.delete(`${BASE_URL}/${conversationId}`, { params: { patient_id: patientId }, headers: getAuthHeaders() })
}

/**
 * Unarchive a conversation
 */
export async function unarchiveConversation(
  conversationId: string,
  data: { patientId: string }
): Promise<void> {
  await api.post(`${BASE_URL}/${conversationId}/unarchive`, data, { headers: getAuthHeaders() })
}
