import React from "react"

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b">{children}</div>
)

export default CardHeader;
