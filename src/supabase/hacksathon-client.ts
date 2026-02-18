import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_HACKSATHON_SUPABASE_URL
const key = import.meta.env.VITE_HACKSATHON_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

if (url && key) {
  client = createClient(url, key)
} else {
  console.warn('Hacksathon Supabase credentials not configured — using static fallbacks')
}

export const hacksathon = client
