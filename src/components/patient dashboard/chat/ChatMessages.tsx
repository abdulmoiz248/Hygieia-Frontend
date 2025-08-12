"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  ImageIcon,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

import {
  selectContact,
  clearSelection,
  setSearchQuery,
  sendMessage,
  markAsRead,
  receiveMessage,
} from "@/types/patient/ChatSlice"

import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"
import { AppDispatch, RootState } from "@/store/patient/store"


export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
// Export interfaces as named exports
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

export default function ModernPatientChat() {
  const dispatch = useAppDispatch()
  const { contacts, messages, selectedContactId, searchQuery } = useAppSelector((state) => state.chat)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || null
  const currentMessages = selectedContact ? messages[selectedContact.id] || [] : []

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-[var(--color-soft-blue)] text-white"
      case "nurse":
        return "bg-[var(--color-mint-green)] text-[var(--color-dark-slate-gray)]"
      case "therapist":
        return "bg-[var(--color-soft-coral)] text-white"
      default:
        return "bg-[var(--color-cool-gray)] text-white"
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedContact) return

    dispatch(sendMessage({ contactId: selectedContact.id, content: inputValue.trim() }))
    setInputValue("")
    setIsTyping(false)

    // Auto-resize textarea back to single line
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }

    // Simulate doctor response after 2-3 seconds
    if (selectedContact.role === "doctor") {
      setTimeout(
        () => {
          const responses = [
            "Thank you for the update. I'll review this information.",
            "That sounds good. Keep monitoring and let me know if anything changes.",
            "I've noted this in your file. Continue with your current treatment plan.",
            "Great progress! Let's schedule a follow-up appointment.",
          ]
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]
          dispatch(receiveMessage({ contactId: selectedContact.id, content: randomResponse }))
        },
        2000 + Math.random() * 1000,
      )
    }
  }

  const handleSelectContact = (contactId: string) => {
    dispatch(selectContact(contactId))
    dispatch(markAsRead(contactId))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    setIsTyping(e.target.value.length > 0)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "😈",
    "👍",
    "👎",
    "👌",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "🖕",
    "👇",
    "☝️",
    "👋",
    "🤚",
    "🖐️",
    "✋",
    "🖖",
    "👏",
    "🙌",
    "🤲",
    "🤝",
    "🙏",
    "✍️",
    "💪",
    "🦾",
    "🦿",
    "🦵",
    "🦶",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮️",
  ]

  const handleEmojiSelect = (emoji: string) => {
    if (inputRef.current) {
      const textarea = inputRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = inputValue.slice(0, start) + emoji + inputValue.slice(end)

      setInputValue(newValue)
      setIsTyping(newValue.length > 0)

      // Focus back to textarea and set cursor position after emoji
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + emoji.length, start + emoji.length)
      }, 0)
    }
    setShowEmojiPicker(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showEmojiPicker && !target.closest(".emoji-picker") && !target.closest(".emoji-button")) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showEmojiPicker])

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Enhanced scrolling with smooth animation and proper timing
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100

      // Only auto-scroll if user is near the bottom or it's a new message
      if (isNearBottom || currentMessages.length > 0) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          })
        }, 50)
      }
    }
  }, [currentMessages])

  // Scroll to bottom when selecting a new contact
  useEffect(() => {
    if (selectedContact && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "auto",
          block: "end",
        })
      }, 100)
    }
  }, [selectedContact])

  if (!selectedContact) {
    return (
      <div className="chat-container m-0 p-0 bg-[var(--color-snow-white)] rounded-lg border border-gray-200">
        <div className="chat-header bg-white border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-[var(--color-dark-slate-gray)] mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-cool-gray)]" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-gray-50 border-0"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
          </div>
        </div>

        <div className="chat-messages hide-scrollbar">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => handleSelectContact(contact.id)}
              className="contact-item w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                  <AvatarFallback className="bg-[var(--color-soft-blue)] text-white">
                    {contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {contact.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-mint-green)] rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-[var(--color-dark-slate-gray)] truncate">{contact.name}</h3>
                  <span className="text-xs text-[var(--color-cool-gray)] flex-shrink-0">{contact.timestamp}</span>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(contact.role)}`}>{contact.role}</Badge>
                  <span className="text-xs text-[var(--color-cool-gray)] truncate">{contact.specialty}</span>
                </div>

                <p className="text-sm text-[var(--color-cool-gray)] truncate">{contact.lastMessage}</p>
              </div>

              {contact.unread > 0 && (
                <Badge className="bg-[var(--color-soft-coral)] text-white text-xs flex-shrink-0">
                  {contact.unread}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="chat-container bg-[var(--color-snow-white)] rounded-lg border border-gray-200">
      <div className="chat-header bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(clearSelection())}
              className="text-[var(--color-cool-gray)] hover:text-[var(--color-soft-blue)] p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
              <AvatarFallback className="bg-[var(--color-soft-blue)] text-white">
                {selectedContact.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="text-left">
              <h3 className="font-semibold text-[var(--color-dark-slate-gray)]">{selectedContact.name}</h3>
              <div className="flex items-center space-x-2">
                <Badge className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(selectedContact.role)}`}>
                  {selectedContact.role}
                </Badge>
                <span className="text-sm text-[var(--color-cool-gray)]">{selectedContact.specialty}</span>
                {selectedContact.online && <div className="w-2 h-2 bg-[var(--color-mint-green)] rounded-full"></div>}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--color-cool-gray)] hover:text-[var(--color-soft-blue)]"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--color-cool-gray)] hover:text-[var(--color-soft-blue)]"
              title="Video Call"
            >
              <Video className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--color-cool-gray)] hover:text-[var(--color-soft-blue)]"
              title="More Options"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div ref={messagesContainerRef} className="chat-messages hide-scrollbar p-4 space-y-4">
        {currentMessages.map((message) => (
          <div
            key={message.id}
            className={`message-bubble flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === "user"
                  ? "bg-[var(--color-soft-blue)] text-white"
                  : "bg-gray-100 text-[var(--color-dark-slate-gray)]"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <div className="flex items-center justify-between mt-1">
                <p
                  className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-[var(--color-cool-gray)]"}`}
                >
                  {message.timestamp}
                </p>
                {message.sender === "user" && (
                  <div className={`text-xs ${message.status === "read" ? "text-blue-200" : "text-blue-100"}`}>
                    {message.status === "sent" && "✓"}
                    {message.status === "delivered" && "✓✓"}
                    {message.status === "read" && "✓✓"}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && selectedContact.online && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-[var(--color-dark-slate-gray)] px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[var(--color-cool-gray)] rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-[var(--color-cool-gray)] rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[var(--color-cool-gray)] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <div className="chat-input border-t border-gray-200 p-4">
        {showAttachments && (
          <div className="mb-3 flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--color-cool-gray)] hover:text-[var(--color-soft-blue)] flex items-center space-x-1"
              title="Send Image"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-xs">Image</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--color-cool-gray)] hover:text-[var(--color-soft-blue)] flex items-center space-x-1"
              title="Send File"
            >
              <FileText className="w-4 h-4" />
              <span className="text-xs">File</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--color-cool-gray)] hover:text-[var(--color-soft-blue)] flex items-center space-x-1"
              title="Voice Message"
            >
              <Mic className="w-4 h-4" />
              <span className="text-xs">Voice</span>
            </Button>
          </div>
        )}

        {showEmojiPicker && (
          <div className="emoji-picker absolute bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-80 max-h-60 overflow-y-auto z-50">
            <div className="grid grid-cols-10 gap-1">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAttachments(!showAttachments)}
            className="text-[var(--color-cool-gray)] hover:text-[var(--color-soft-blue)] p-2 flex-shrink-0"
            title="Attachments"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-[40px] max-h-[120px] resize-none pr-20 bg-gray-50 border-0 focus:bg-white"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`emoji-button p-1 ${
                  showEmojiPicker
                    ? "text-[var(--color-soft-blue)] bg-blue-50"
                    : "text-[var(--color-cool-gray)] hover:text-[var(--color-soft-blue)]"
                }`}
                title="Add Emoji"
              >
                <Smile className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="sm"
                className="bg-[var(--color-soft-blue)] hover:bg-[var(--color-soft-blue)]/90 text-white p-1"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
