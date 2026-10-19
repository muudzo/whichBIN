import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { createLocalScoreStore } from './services/scoreStore'
import './styles/global.css'

// The local store keeps the game playable before the database exists.
// After the architecture review, the Supabase store is passed in here instead.
const store = createLocalScoreStore()

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App store={store} />
  </StrictMode>,
)
