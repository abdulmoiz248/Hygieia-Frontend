import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {   Send } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  return (
    <div className="p-4 bg-snow-white  flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={onChange}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && onSend()}
            className="pr-12 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-cool-gray rounded-full"
          />
        </div>
        <Button
          onClick={onSend}
          disabled={disabled}
          className="bg-soft-blue hover:bg-soft-blue/70 text-white rounded-full p-3 disabled:opacity-50 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
} 