import React from "react"

interface BaseComponentProps {
  children: React.ReactNode
  className?: string
}

const DialogTitle = ({ children, className = "" }: BaseComponentProps) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
)

export default DialogTitle; 