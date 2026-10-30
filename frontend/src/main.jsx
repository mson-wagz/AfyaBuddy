import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/output.css'
import './styles/custom.css'
import { ErrorBoundary } from "./ErrorBoundary"
import App from "./App"
import Landing from "./Landing"

function Root() {
  const [started, setStarted] = useState(false)
  return started ? <App onBack={() => setStarted(false)} /> : <Landing onStart={() => setStarted(true)} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </StrictMode>,
)