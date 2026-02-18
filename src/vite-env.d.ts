/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IDEALAB_SUPABASE_URL: string
  readonly VITE_IDEALAB_SUPABASE_ANON_KEY: string
  readonly VITE_HACKSATHON_SUPABASE_URL?: string
  readonly VITE_HACKSATHON_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
