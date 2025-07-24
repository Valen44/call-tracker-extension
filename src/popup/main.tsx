import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import "./popup.css"
import { PopUp } from "./PopUp"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PopUp/>
  </StrictMode>,
)
