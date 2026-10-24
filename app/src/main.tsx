import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { chooseScoreStore } from './services/chooseScoreStore'
import './styles/global.css'

// The shared Supabase store when app/.env.local has its settings, otherwise the local one.
const store = chooseScoreStore(import.meta.env)

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App store={store} />
  </StrictMode>,
)
