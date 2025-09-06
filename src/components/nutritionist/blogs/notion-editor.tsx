"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Heading1, Heading2, Heading3, List, Quote, Code, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotionEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

interface SlashCommand {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  action: () => void
}

export function NotionEditor({ content, onChange, placeholder = "Type '/' for commands..." }: NotionEditorProps) {
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 })
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
  const editorRef = useRef<HTMLDivElement>(null)
  const [slashPosition, setSlashPosition] = useState(0)

  const insertAtCursor = (text: string) => {
    if (!editorRef.current) return

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const textNode = range.startContainer
      if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent) {
        const textContent = textNode.textContent
        const slashIndex = textContent.lastIndexOf("/", range.startOffset)

        if (slashIndex !== -1) {
          const newRange = document.createRange()
          newRange.setStart(textNode, slashIndex)
          newRange.setEnd(textNode, range.startOffset)
          newRange.deleteContents()
          newRange.insertNode(document.createTextNode(text))

          const afterRange = document.createRange()
          afterRange.setStart(newRange.endContainer, newRange.endOffset)
          afterRange.collapse(true)
          selection.removeAllRanges()
          selection.addRange(afterRange)
        }
      }
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerText)
    }
    setShowSlashMenu(false)
  }

  const slashCommands: SlashCommand[] = [
    { id: "heading1", label: "Heading 1", icon: <Heading1 className="w-4 h-4" />, description: "Large section heading", action: () => insertAtCursor("# ") },
    { id: "heading2", label: "Heading 2", icon: <Heading2 className="w-4 h-4" />, description: "Medium section heading", action: () => insertAtCursor("## ") },
    { id: "heading3", label: "Heading 3", icon: <Heading3 className="w-4 h-4" />, description: "Small section heading", action: () => insertAtCursor("### ") },
    { id: "bullet", label: "Bullet List", icon: <List className="w-4 h-4" />, description: "Create a bullet point", action: () => insertAtCursor("- ") },
    { id: "quote", label: "Quote", icon: <Quote className="w-4 h-4" />, description: "Add a quote block", action: () => insertAtCursor("> ") },
    { id: "code", label: "Code Block", icon: <Code className="w-4 h-4" />, description: "Add a code block", action: () => insertAtCursor("```\n\n```") },
    { id: "divider", label: "Divider", icon: <Minus className="w-4 h-4" />, description: "Add a horizontal line", action: () => insertAtCursor("---") },
  ]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSlashMenu) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedCommandIndex((prev) => (prev < slashCommands.length - 1 ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedCommandIndex((prev) => (prev > 0 ? prev - 1 : slashCommands.length - 1))
      } else if (e.key === "Enter") {
        e.preventDefault()
        slashCommands[selectedCommandIndex].action()
        setShowSlashMenu(false)
      } else if (e.key === "Escape" || e.key === " ") {
        setShowSlashMenu(false)
      }
      return
    }
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const newContent = target.innerText
    onChange(newContent)

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const textNode = range.startContainer
      if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent) {
        const textBeforeCursor = textNode.textContent.substring(0, range.startOffset)
        const lastChar = textBeforeCursor.slice(-1)

        if (lastChar === "/") {
          const tempRange = document.createRange()
          tempRange.setStart(textNode, range.startOffset - 1)
          tempRange.setEnd(textNode, range.startOffset)
          const rect = tempRange.getBoundingClientRect()
          const editorRect = editorRef.current?.getBoundingClientRect()

          if (editorRect) {
            setSlashMenuPosition({
              x: rect.left - editorRect.left,
              y: rect.bottom - editorRect.top + 5,
            })
          }

          setSlashPosition(range.startOffset - 1)
          setShowSlashMenu(true)
          setSelectedCommandIndex(0)
        } else if (showSlashMenu) {
          const currentText = textNode.textContent.substring(slashPosition)
          if (!currentText.startsWith("/")) {
            setShowSlashMenu(false)
          }
        }
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSlashMenu && editorRef.current && !editorRef.current.contains(event.target as Node)) {
        setShowSlashMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showSlashMenu])

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== content) {
      editorRef.current.innerText = content
    }
  }, [content])

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          "min-h-[200px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring",
          "prose prose-sm max-w-none",
          !content && "text-muted-foreground",
        )}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {showSlashMenu && (
        <div
          className="absolute z-50 bg-popover border rounded-md shadow-lg py-2 min-w-[250px]"
          style={{
            left: slashMenuPosition.x,
            top: slashMenuPosition.y,
          }}
        >
          {slashCommands.map((command, index) => (
            <button
              key={command.id}
              onMouseDown={(e) => {
                e.preventDefault()
                command.action()
                setShowSlashMenu(false)
              }}
              className={cn(
                "w-full px-3 py-2 text-left hover:bg-accent flex items-center gap-3",
                index === selectedCommandIndex && "bg-accent",
              )}
            >
              {command.icon}
              <div>
                <div className="font-medium text-sm">{command.label}</div>
                <div className="text-xs text-muted-foreground">{command.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  )
}
