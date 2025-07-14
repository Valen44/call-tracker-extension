import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/popup.css'
import './css/callList.css'
import './css/stats.css'
import PopUp from './PopUp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PopUp />
  </StrictMode>,
)
