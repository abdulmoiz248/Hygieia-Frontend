import React from "react"

interface ButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "icon"
  onClick?: () => void
  [key: string]: any
}

const Button = ({ children, className = "", variant = "default", size = "default", onClick, ...props }: ButtonProps) => {
  const baseClass = "px-4 py-2 rounded-md font-medium transition-colors"
  const variants = {
    default: "bg-soft-blue text-snow-white hover:bg-soft-blue/90",
    outline: "border border-cool-gray/30 bg-snow-white text-dark-slate-gray hover:bg-cool-gray/10",
    ghost: "text-dark-slate-gray hover:bg-cool-gray/10"
  }
  const sizes = {
    default: "px-4 py-2",
    sm: "px-3 py-1.5 text-sm",
    icon: "p-2"
  }
  return (
    <button 
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button;
