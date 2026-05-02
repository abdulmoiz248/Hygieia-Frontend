import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Plus, Trash2, Edit2, Check, X, Loader2, MessageCircle } from "lucide-react"
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
    <div className="w-80 h-full min-h-0 border-r border-white/40 bg-white/70 backdrop-blur-2xl flex flex-col shadow-[2px_0_20px_rgba(0,0,0,0.02)] z-10 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-soft-blue/5 to-transparent pointer-events-none" />

      <div className="p-5 pt-16 md:pt-5 border-b border-gray-100/50 relative z-10">
        <Button
          onClick={startNewChat}
          className="w-full bg-gradient-to-r from-soft-blue to-mint-green text-white hover:shadow-lg hover:shadow-soft-blue/30 hover:-translate-y-0.5 transition-all duration-300 rounded-xl h-11 font-medium border border-white/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Start New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 scrollbar-none space-y-2 relative z-10">
        <div className="px-2 pb-2">
          <h3 className="text-xs font-semibold text-cool-gray uppercase tracking-wider">Chat History</h3>
        </div>

        {error && (
          <div className="text-xs text-soft-coral px-3 py-2 rounded-lg bg-soft-coral/10 border border-soft-coral/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-soft-coral" />
            Failed to load: {error}
          </div>
        )}

        {isFetchingConversations && conversations.length === 0 ? (
          <div className="flex justify-center p-6">
            <Loader2 className="w-6 h-6 animate-spin text-soft-blue" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center p-6 flex flex-col items-center justify-center space-y-3 opacity-60">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-cool-gray" />
            </div>
            <p className="text-sm text-cool-gray">No previous chats</p>
          </div>
        ) : (
          <AnimatePresence>
            {conversations.map((conv) => (
              <motion.div
                key={conv.conversation_id}
                initial={{ opacity: 0, x: -10, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.98 }}
                className={`group relative p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeConversationId === conv.conversation_id
                    ? "bg-white shadow-sm border border-soft-blue/20 ring-1 ring-soft-blue/10"
                    : "hover:bg-white/80 border border-transparent hover:shadow-sm"
                }`}
                onClick={() => patientId && loadConversation(patientId, conv.conversation_id)}
              >
                {editingId === conv.conversation_id ? (
                  <form onSubmit={(e) => submitRename(e, conv.conversation_id)} className="flex items-center gap-2 bg-white rounded-lg p-1">
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border-b-2 border-soft-blue bg-transparent text-dark-slate-gray focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button type="button" onClick={(e) => submitRename(e, conv.conversation_id)} className="p-1.5 text-mint-green hover:bg-mint-green/10 rounded-md transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={cancelRename} className="p-1.5 text-soft-coral hover:bg-soft-coral/10 rounded-md transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl mt-0.5 transition-colors ${
                        activeConversationId === conv.conversation_id 
                          ? "bg-gradient-to-br from-soft-blue to-mint-green text-white" 
                          : "bg-gray-100/80 text-cool-gray group-hover:bg-gray-200/60 group-hover:text-soft-blue"
                      }`}>
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className={`text-[14px] font-medium truncate ${
                          activeConversationId === conv.conversation_id ? "text-dark-slate-gray" : "text-gray-600"
                        }`}>
                          {conv.title || "New Conversation"}
                        </h4>
                        <p className="text-[12px] text-cool-gray/80 truncate mt-0.5">
                          {conv.preview || "No messages yet"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-gray-100 shadow-sm">
                      <button
                        onClick={(e) => handleRename(e, conv.conversation_id, conv.title)}
                        className="p-1.5 text-cool-gray hover:text-soft-blue hover:bg-soft-blue/10 rounded-md transition-colors"
                        title="Rename"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, conv.conversation_id)}
                        className="p-1.5 text-cool-gray hover:text-soft-coral hover:bg-soft-coral/10 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 text-[10px] text-cool-gray/50 text-right font-medium">
                      {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {hasMoreConversations && (
          <div className="pt-2 pb-4">
            <Button
              variant="outline"
              className="w-full text-xs font-medium text-soft-blue border-soft-blue/20 bg-white/50 hover:bg-soft-blue hover:text-white transition-all rounded-xl shadow-sm"
              onClick={() => patientId && fetchConversations(patientId, true)}
              disabled={isFetchingConversations}
            >
              {isFetchingConversations ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
