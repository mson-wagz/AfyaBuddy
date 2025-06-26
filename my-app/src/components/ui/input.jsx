import React from "react"

export const Input = React.forwardRef((props, ref) => (
  <input ref={ref} {...props} className={`border rounded px-3 py-2 ${props.className || ""}`} />
))