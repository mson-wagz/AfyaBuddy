import React from "react"

export const Card = ({ children, className = "", ...props }) => (
  <div className={`rounded-lg shadow border p-2 bg-white ${className}`} {...props}>{children}</div>
)

export const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-4 ${className}`} {...props}>{children}</div>
)

export const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`border-b px-4 py-2 font-bold text-lg ${className}`} {...props}>{children}</div>
)

export const CardTitle = ({ children, className = "", ...props }) => (
  <div className={`text-xl font-semibold mb-2 ${className}`} {...props}>{children}</div>
)