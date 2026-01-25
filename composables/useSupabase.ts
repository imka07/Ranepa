import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Singleton Supabase client для всего приложения
let supabaseInstance: SupabaseClient | null = null

export const useSupabase = () => {
  if (!process.client) return null
  
  if (!supabaseInstance) {
    const config = useRuntimeConfig()
    
    supabaseInstance = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey,
      {
        auth: {
          // Явно настраиваем хранение сессии
          storage: window.localStorage,
          storageKey: 'sb-oftajdtaeqaylohgefba-auth-token',
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        }
      }
    )
    
    console.log('✅ Supabase client initialized with persistent storage')
  }
  
  return supabaseInstance
}
