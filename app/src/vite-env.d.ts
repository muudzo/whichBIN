// The two Supabase settings from app/.env.local (see app/.env.example). Both are safe in the browser.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
}
