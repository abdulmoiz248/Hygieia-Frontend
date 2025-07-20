import React from "react"

interface BaseComponentProps {
  children: React.ReactNode
  className?: string
}

const Badge = ({ children, className = "" }: BaseComponentProps) => (
  <span className={`px-2 py-1 text-xs font-medium rounded-full bg-cool-gray/20 text-dark-slate-gray ${className}`}>
    {children}
  </span>
)

export default Badge; 