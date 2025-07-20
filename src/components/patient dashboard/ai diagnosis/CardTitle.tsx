import React from "react"

interface BaseComponentProps {
  children: React.ReactNode
  className?: string
}

const CardTitle = ({ children, className = "" }: BaseComponentProps) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
)

export default CardTitle;
