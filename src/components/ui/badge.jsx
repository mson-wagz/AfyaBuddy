import React from "react"

export const Badge = ({ children, className = "", variant = "default", ...props }) => {
  const base =
    "inline-block px-2 py-1 rounded text-xs font-semibold mr-2 mb-2 " +
    (variant === "destructive"
      ? "bg-red-100 text-red-800"
      : variant === "secondary"
      ? "bg-gray-200 text-gray-800"
      : variant === "outline"
      ? "border border-gray-400 text-gray-800"
      : "bg-blue-100 text-blue-800")
  return (
    <span className={`${base} ${className}`} {...props}>
      {children}
    </span>
  )
}