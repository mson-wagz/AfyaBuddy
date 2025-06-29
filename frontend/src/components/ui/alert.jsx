import React from "react"

export const Alert = ({ children, className = "", ...props }) => (
  <div className={`border-l-4 border-yellow-400 p-4 mb-2 rounded ${className}`} {...props}>
    {children}
  </div>
)

export const AlertDescription = ({ children, className = "", ...props }) => (
  <div className={`text-sm ${className}`} {...props}>
    {children}
  </div>
)