import React from "react"

interface BaseComponentProps {
  children: React.ReactNode
  className?: string
}

const CardContent = ({ children, className = "" }: BaseComponentProps) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

export default CardContent;
