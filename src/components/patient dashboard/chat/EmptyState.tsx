import { Send } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-snow-white">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-4 bg-soft-blue rounded-full flex items-center justify-center">
          <Send className="w-16 h-16 text-black" />
        </div>
        <h3 className="text-xl font-semibold text-soft-coral mb-2">Select a conversation</h3>
        <p className="text-gray-500">Choose a doctor from the list to start messaging</p>
      </div>
    </div>
  )
} 