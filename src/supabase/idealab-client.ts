import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_IDEALAB_SUPABASE_URL
const key = import.meta.env.VITE_IDEALAB_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn('IdeaLab Supabase credentials not configured')
}

export const idealab: SupabaseClient = createClient(url ?? '', key ?? '')
