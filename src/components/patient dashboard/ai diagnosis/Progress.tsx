import React from "react"

interface ProgressProps {
  value: number
  className?: string
}

const Progress = ({ value, className = "" }: ProgressProps) => (
  <div className={`w-full bg-cool-gray/20 rounded-full h-2 ${className}`}>
    <div 
      className="bg-soft-blue h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    ></div>
  </div>
)

export default Progress; 