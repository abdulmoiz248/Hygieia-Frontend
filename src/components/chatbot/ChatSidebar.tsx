import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Plus, Trash2, Edit2, Loader2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

  const [renameOpen, setRenameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [selectedConversationTitle, setSelectedConversationTitle] = useState("")
  const [renameTitle, setRenameTitle] = useState("")
  const [renameSubmitting, setRenameSubmitting] = useState(false)
  const [renameError, setRenameError] = useState("")
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)

  const MAX_RENAME_CHARS = 30

  useEffect(() => {
    if (patientId) fetchConversations(patientId)
  }, [patientId, fetchConversations])

  const handleRename = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation()
    setSelectedConversationId(id)
    setSelectedConversationTitle(currentTitle || "")
    setRenameTitle(currentTitle || "")
    setRenameError("")
    setRenameOpen(true)
  }

  const submitRename = async () => {
    if (!patientId || !selectedConversationId) return
    const nextTitle = renameTitle.trim()
    if (!nextTitle) { setRenameError("Name is required."); return }
    if (nextTitle.length > MAX_RENAME_CHARS) {
      setRenameError(`Max ${MAX_RENAME_CHARS} characters.`)
      return
    }
    setRenameSubmitting(true)
    setRenameError("")
    try {
      await renameConversation(patientId, selectedConversationId, nextTitle)
      setRenameOpen(false)
    } finally { setRenameSubmitting(false) }
  }

  const handleDelete = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation()
    setSelectedConversationId(id)
    setSelectedConversationTitle(currentTitle || "Untitled conversation")
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!patientId || !selectedConversationId) return
    setDeleteSubmitting(true)
    try {
      await deleteConversation(patientId, selectedConversationId)
      setDeleteOpen(false)
    } finally { setDeleteSubmitting(false) }
  }

  return (
    <div className="w-72 h-full min-h-0 flex flex-col border-r border-gray-100 bg-white/70 backdrop-blur-xl overflow-hidden">

      {/* Header */}
      <div className="relative flex-shrink-0">
        <div className="h-[3px] w-full bg-gradient-to-r from-soft-blue via-mint-green to-soft-coral" />
        <div className="px-4 border-b border-gray-100/80 h-[60px] flex items-center">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 h-9 rounded-xl bg-gradient-to-r from-soft-blue via-mint-green to-soft-coral text-white text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-soft-blue/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-none space-y-0.5">
        <p className="text-[10px] font-bold text-soft-blue/50 uppercase tracking-widest px-2 pb-2">
          Chat History
        </p>

        {error && (
          <div className="text-xs text-soft-coral px-3 py-2 rounded-xl bg-soft-coral/5 border border-soft-coral/15 mb-2">
            Failed to load: {error}
          </div>
        )}

        {isFetchingConversations && conversations.length === 0 ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-soft-blue/50" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-cool-gray/40" />
            </div>
            <p className="text-xs text-cool-gray/50">No previous chats</p>
          </div>
        ) : (
          <AnimatePresence>
            {conversations.map((conv) => {
              const isActive = activeConversationId === conv.conversation_id
              return (
                <motion.div
                  key={conv.conversation_id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                    isActive
                      ? "bg-soft-blue/6 border border-soft-blue/15"
                      : "border border-transparent hover:bg-gray-50 hover:border-gray-100"
                  }`}
                  onClick={() => patientId && loadConversation(patientId, conv.conversation_id)}
                >
                  <div className="flex items-start gap-2.5 pr-8">
                    {/* Icon */}
                    <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 transition-colors ${
                      isActive
                        ? "bg-gradient-to-br from-soft-blue to-mint-green text-white"
                        : "bg-gray-100 text-cool-gray/60 group-hover:bg-soft-blue/10 group-hover:text-soft-blue/70"
                    }`}>
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate leading-tight ${
                        isActive ? "text-dark-slate-gray" : "text-dark-slate-gray/70"
                      }`}>
                        {conv.title || "New Conversation"}
                      </p>
                      <p className="text-[11px] text-cool-gray/60 truncate mt-0.5 leading-tight">
                        {conv.preview || "No messages yet"}
                      </p>
                      <p className={`text-[10px] mt-1.5 font-medium ${isActive ? "text-soft-coral/60" : "text-cool-gray/40"}`}>
                        {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons — appear on hover */}
                  <div className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                    <button
                      onClick={(e) => handleRename(e, conv.conversation_id, conv.title)}
                      className="p-1.5 text-cool-gray/50 hover:text-soft-blue hover:bg-soft-blue/8 rounded-lg transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, conv.conversation_id, conv.title)}
                      className="p-1.5 text-cool-gray/50 hover:text-soft-coral hover:bg-soft-coral/8 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}

        {hasMoreConversations && (
          <div className="pt-2 pb-1">
            <button
              className="w-full py-2 text-xs font-medium text-soft-blue/70 hover:text-soft-blue border border-dashed border-soft-blue/20 rounded-xl hover:border-soft-blue/40 hover:bg-soft-blue/5 transition-all"
              onClick={() => patientId && fetchConversations(patientId, true)}
              disabled={isFetchingConversations}
            >
              {isFetchingConversations ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Load more"}
            </button>
          </div>
        )}
      </div>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={(open) => { setRenameOpen(open); if (!open) { setRenameError(""); setRenameSubmitting(false) } }}>
        <DialogContent className="sm:max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-dark-slate-gray text-base">Rename chat</DialogTitle>
            <DialogDescription className="text-cool-gray text-sm">Max 30 characters.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <input
              autoFocus
              value={renameTitle}
              maxLength={MAX_RENAME_CHARS}
              onChange={(e) => { setRenameTitle(e.target.value); setRenameError("") }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void submitRename() } }}
              placeholder="Enter chat name"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-dark-slate-gray outline-none focus:border-soft-blue focus:bg-white transition-colors"
            />
            <div className="flex justify-between text-xs text-cool-gray/60">
              <span>{renameTitle.length}/{MAX_RENAME_CHARS}</span>
              {renameError && <span className="text-soft-coral">{renameError}</span>}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRenameOpen(false)} className="rounded-xl text-sm" disabled={renameSubmitting}>Cancel</Button>
            <Button onClick={() => void submitRename()} className="rounded-xl bg-soft-blue text-white hover:bg-soft-blue/90 text-sm" disabled={renameSubmitting || !renameTitle.trim()}>
              {renameSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); if (!open) setDeleteSubmitting(false) }}>
        <DialogContent className="sm:max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-dark-slate-gray text-base">Delete chat</DialogTitle>
            <DialogDescription className="text-cool-gray text-sm">
              Permanently removes &quot;{selectedConversationTitle}&quot; and all its messages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-xl text-sm" disabled={deleteSubmitting}>Cancel</Button>
            <Button onClick={() => void confirmDelete()} className="rounded-xl bg-soft-coral text-white hover:bg-soft-coral/90 text-sm" disabled={deleteSubmitting}>
              {deleteSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}