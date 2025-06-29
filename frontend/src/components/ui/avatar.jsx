import React from "react"

export const Avatar = ({ children, className = "", ...props }) => (
  <div className={`inline-flex items-center justify-center rounded-full bg-gray-200 ${className}`} {...props}>
    {children}
  </div>
)

export const AvatarFallback = ({ children, className = "", ...props }) => (
  <span className={`text-xs font-bold text-gray-600 ${className}`} {...props}>
    {children}
  </span>
)