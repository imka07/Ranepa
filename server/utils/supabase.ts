import { createClient } from '@supabase/supabase-js'

let supabase: ReturnType<typeof createClient> | null = null

/**
 * Получает или создает Supabase клиент
 */
export function getSupabaseClient() {
  if (supabase) {
    return supabase
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials (SUPABASE_URL or SUPABASE_ANON_KEY)')
  }

  supabase = createClient(supabaseUrl, supabaseKey)
  return supabase
}
