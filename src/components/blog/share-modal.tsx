"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clipboard, Mail, MessageCircle, Twitter, Facebook, Linkedin } from "lucide-react"
import { toast } from "sonner"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  postTitle: string
  postUrl: string
}

export function ShareModal({ isOpen, onClose, postTitle, postUrl }: ShareModalProps) {
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href)
    }
  }, [])

  const encodedTitle = encodeURIComponent(postTitle)
  const encodedUrl = encodeURIComponent(currentUrl || postUrl)

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => window.open(`https://wa.me/?text=${encodedTitle} ${encodedUrl}`, "_blank"),
    },
    {
      name: "Twitter (X)",
      icon: <Twitter className="w-5 h-5" />,
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, "_blank"),
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank"),
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      action: () =>
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
          "_blank",
        ),
    },
    {
      name: "Email",
      icon: <Mail className="w-5 h-5" />,
      action: () => window.open(`mailto:?subject=${encodedTitle}&body=${encodedUrl}`, "_blank"),
    },
    {
      name: "Copy Link",
      icon: <Clipboard className="w-5 h-5" />,
      action: async () => {
        try {
          await navigator.clipboard.writeText(currentUrl || postUrl)
          toast.success("Link Copied!", {
            description: "The blog post link has been copied to your clipboard.",
          })
        } catch (err) {
          console.error("Failed to copy: ", err)
          toast.error("Failed to copy link", {
            description: "Please try again.",
          })
        }
        onClose()
      },
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-snow-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-dark-slate-gray">Share this post</DialogTitle>
          <DialogDescription className="text-cool-gray">
            Share &quot;{postTitle}&quot; with your friends and followers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {shareOptions.map((option) => (
            <Button
              key={option.name}
              variant="outline"
              className="flex items-center hover:border-soft-coral justify-center gap-2 py-3 px-4 rounded-md border border-soft-blue/20 text-dark-slate-gray hover:bg-soft-blue/10  transition-all duration-200 bg-transparent"
              onClick={() => {
                option.action()
                if (option.name !== "Copy Link") onClose()
              }}
            >
              {option.icon}
              <span className="text-base font-medium">{option.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
