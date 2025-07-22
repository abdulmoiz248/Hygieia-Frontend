"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Copy, Facebook, Twitter, Linkedin, Mail, MessageCircle, Download, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ShareProfileProps {
  doctorId: string
  doctorName: string
}

export function ShareProfile({ doctorId, doctorName }: ShareProfileProps) {
  const [copied, setCopied] = useState(false)
  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/doctor/${doctorId}`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Profile link copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const shareVia = (platform: string) => {
    const text = `Check out ${doctorName}'s profile`
    const url = profileUrl

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank")
    }
  }

  return (
    <Dialog >
      <DialogTrigger className="" asChild>
        <Button
          variant="outline"
          className="group border-soft-blue/20 hover:border-soft-blue hover:bg-soft-blue/5 bg-transparent"
        >
          <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Share Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-snow-white">
        <DialogHeader>
          <DialogTitle className="gradient-text text-soft-blue">Share {doctorName}'s Profile</DialogTitle>
          <DialogDescription>Share this doctor's profile with others via link or QR code</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
         <TabsList className="grid w-full grid-cols-2">
  <TabsTrigger
    value="link"
    className="data-[state=active]:bg-mint-green data-[state=active]:text-white"
  >
    Share Link
  </TabsTrigger>
  <TabsTrigger
    value="qr"
    className="data-[state=active]:bg-mint-green data-[state=active]:text-white"
  >
    QR Code
  </TabsTrigger>
</TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-url">Profile URL</Label>
              <div className="flex space-x-2">
                <Input id="profile-url" value={profileUrl} readOnly className="flex-1" />
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(profileUrl)}
                  className="bg-mint-green hover:bg-mint-green/90"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-3 ">
              <Label className="text-soft-coral">Share via</Label>
              <div className="grid grid-cols-2 gap-2 ">
                <Button variant="outline" size="sm" onClick={() => shareVia("facebook")} className="justify-start hover:bg-mint-green hover:text-white">
                  <Facebook className="w-4 h-4 mr-2 text-blue-600 hover:bg-mint-green hover:text-white" />
                  Facebook
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareVia("twitter")} className="justify-start hover:bg-mint-green hover:text-white">
                  <Twitter className="w-4 h-4 mr-2 text-sky-500 hover:bg-mint-green hover:text-white" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareVia("linkedin")} className="justify-start hover:bg-mint-green hover:text-white">
                  <Linkedin className="w-4 h-4 mr-2 text-blue-700 hover:bg-mint-green hover:text-white" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareVia("whatsapp")} className="justify-start hover:bg-mint-green hover:text-white">
                  <MessageCircle className="w-4 h-4 mr-2 text-green-600 hover:bg-mint-green hover:text-white" />
                  WhatsApp
                </Button>
               
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">Scan this QR code to view the profile</p>
              <Button
                variant="outline"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(profileUrl)}`
                  link.download = `${doctorName}-profile-qr.png`
                  link.click()
                }}
                className="w-full bg-soft-blue text-white hover:bg-soft-blue/90"
            
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
