import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/output.css'
import { ErrorBoundary } from "./ErrorBoundary"
import App from "./App"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
