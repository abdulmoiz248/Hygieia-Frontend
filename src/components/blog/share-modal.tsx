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
      <DialogContent className="sm:max-w-[480px] bg-gradient-to-br from-snow-white to-mint-green/5 p-8 rounded-2xl shadow-2xl border border-soft-blue/20">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-soft-blue to-mint-green bg-clip-text text-transparent">
            Share this post
          </DialogTitle>
          <DialogDescription className="text-cool-gray text-base">
            Share &quot;{postTitle}&quot; with your friends and followers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-6">
          {shareOptions.map((option) => (
            <Button
              key={option.name}
              variant="outline"
              className="flex items-center justify-center gap-3 py-6 px-4 rounded-xl border-2 border-soft-blue/20 text-dark-slate-gray hover:bg-gradient-to-br hover:from-soft-blue/10 hover:to-mint-green/10 hover:border-soft-blue/40 hover:scale-105 transition-all duration-300 bg-snow-white shadow-sm hover:shadow-md group"
              onClick={() => {
                option.action()
                if (option.name !== "Copy Link") onClose()
              }}
            >
              <span className="group-hover:scale-110 transition-transform duration-300">
                {option.icon}
              </span>
              <span className="text-sm font-semibold">{option.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
