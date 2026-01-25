import { createClient } from '@supabase/supabase-js'

let supabase: ReturnType<typeof createClient> | null = null

/**
 * Получает или создает Supabase клиент с service_role ключом
 * Используется на сервере для обхода RLS
 */
export function getSupabaseClient() {
  if (supabase) {
    return supabase
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)')
  }

  // Используем service_role key для обхода RLS на сервере
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  return supabase
}
