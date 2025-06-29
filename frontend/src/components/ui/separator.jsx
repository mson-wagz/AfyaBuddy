import React from "react"

export const Separator = ({ className = "", ...props }) => (
  <hr className={`my-4 border-t border-gray-300 ${className}`} {...props} />
)