import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Singleton Supabase client для всего приложения
let supabaseInstance: SupabaseClient | null = null

export const useSupabase = () => {
  if (!process.client) return null
  
  if (!supabaseInstance) {
    const config = useRuntimeConfig()
    supabaseInstance = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )
    console.log('✅ Supabase client initialized')
  }
  
  return supabaseInstance
}
