"use client"

//import { useState, useEffect } from "react"
import { toast as sonnerToast } from "sonner"

type ToastOptions = {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

function toast({ title, description, duration, action }: ToastOptions) {
  const id = crypto.randomUUID()

  sonnerToast(title || "Notification", {
    description,
    duration,
    action,
    id,
  })

  return {
    id,
    dismiss: () => sonnerToast.dismiss(id),
    update: (updated: ToastOptions) => {
      sonnerToast.dismiss(id)
      sonnerToast(updated.title || title || "Updated", {
        description: updated.description || description,
        duration: updated.duration || duration,
        action: updated.action || action,
        id,
      })
    },
  }
}

function useToast() {
  // const [toasts, setToasts] = useState([])

  // useEffect(() => {
  //   // noop for API compatibility
  // }, [])

  return {
   // toasts,
    toast,
    dismiss: (id?: string) => {
      if (id) sonnerToast.dismiss(id)
      else sonnerToast.dismiss()
    },
  }
}

export { useToast, toast }
