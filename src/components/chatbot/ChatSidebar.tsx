import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Plus, Trash2, Edit2, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChatbotStore } from "@/store/patient/chatbot-store"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import { formatDistanceToNow } from "date-fns"

export function ChatSidebar() {
  const { profile } = usePatientProfileStore()
  const patientId = profile.id
  
  const {
    conversations,
    activeConversationId,
    isFetchingConversations,
    error,
    hasMoreConversations,
    fetchConversations,
    loadConversation,
    startNewChat,
    deleteConversation,
    renameConversation,
  } = useChatbotStore()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  useEffect(() => {
    if (patientId) {
      fetchConversations(patientId)
    }
  }, [patientId, fetchConversations])

  const handleRename = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation()
    setEditingId(id)
    setEditTitle(currentTitle)
  }

  const submitRename = async (e: React.MouseEvent | React.FormEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (editTitle.trim() && patientId) {
    
      await renameConversation(patientId, id, editTitle.trim())
    }
    setEditingId(null)
  }

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(null)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this conversation?") && patientId) {
      await deleteConversation(patientId, id)
    }
  }

  return (
    <div className="w-80 h-full border-r bg-white/50 backdrop-blur-md flex flex-col hidden md:flex">
      <div className="p-4 border-b">
        <Button
          onClick={startNewChat}
          className="w-full bg-gradient-to-r from-soft-blue to-mint-green text-white hover:opacity-90 transition-all duration-300 shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-none space-y-2">
        {error && (
          <div className="text-xs text-soft-coral px-2 py-1 rounded-md bg-soft-coral/10 border border-soft-coral/20">
            Failed to load chats: {error}
          </div>
        )}
        {isFetchingConversations && conversations.length === 0 ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-soft-blue" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center p-4 text-cool-gray/60 text-sm">
            No previous conversations
          </div>
        ) : (
          <AnimatePresence>
            {conversations.map((conv) => (
              <motion.div
                key={conv.conversation_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  activeConversationId === conv.conversation_id
                    ? "bg-soft-blue/10 border border-soft-blue/20"
                    : "hover:bg-gray-100 border border-transparent"
                }`}
                onClick={() => patientId && loadConversation(patientId, conv.conversation_id)}
              >
                {editingId === conv.conversation_id ? (
                  <form onSubmit={(e) => submitRename(e, conv.conversation_id)} className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border rounded bg-white text-dark-slate-gray focus:outline-none focus:border-soft-blue"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button type="button" onClick={(e) => submitRename(e, conv.conversation_id)} className="text-mint-green hover:opacity-80">
                      <Check className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={cancelRename} className="text-soft-coral hover:opacity-80">
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <MessageSquare className={`w-5 h-5 ${
                        activeConversationId === conv.conversation_id ? "text-soft-blue" : "text-cool-gray"
                      }`} />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-medium text-dark-slate-gray truncate">
                          {conv.title || "New Conversation"}
                        </h4>
                        <p className="text-xs text-cool-gray/70 truncate">
                          {conv.preview || "No messages yet"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={(e) => handleRename(e, conv.conversation_id, conv.title)}
                        className="p-1 text-cool-gray hover:text-soft-blue bg-white/80 rounded"
                        title="Rename"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, conv.conversation_id)}
                        className="p-1 text-cool-gray hover:text-soft-coral bg-white/80 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 text-[10px] text-cool-gray/50 text-right">
                      {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {hasMoreConversations && (
          <Button
            variant="ghost"
            className="w-full text-xs text-soft-blue hover:text-soft-blue/80"
            onClick={() => patientId && fetchConversations(patientId, true)}
            disabled={isFetchingConversations}
          >
            {isFetchingConversations ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load More"}
          </Button>
        )}
      </div>
    </div>
  )
}
