import React from "react"

interface BaseComponentProps {
  children: React.ReactNode
  className?: string
}

const DialogContent = ({ children, className = "" }: BaseComponentProps) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

export default DialogContent; 