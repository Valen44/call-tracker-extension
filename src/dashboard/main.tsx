import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import "./dashboard.css"
import { Dashboard } from "./Dashboard"
import "./preloadTheme"
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster richColors/>
    <Dashboard/>
  </StrictMode>,
)

