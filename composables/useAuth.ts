import { createClient } from '@supabase/supabase-js'
import type { Ref } from 'vue'

// Singleton Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!process.client) return null
  
  if (!supabaseClient) {
    const config = useRuntimeConfig()
    supabaseClient = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )
  }
  
  return supabaseClient
}

// Перевод ошибок на русский
function translateError(errorMessage: string): string {
  const translations: Record<string, string> = {
    'Invalid login credentials': 'Неверный email или пароль',
    'Email not confirmed': 'Email не подтвержден. Проверьте почту',
    'User already registered': 'Пользователь с таким email уже существует',
    'Password should be at least 6 characters': 'Пароль должен быть не менее 6 символов',
    'Unable to validate email address: invalid format': 'Неверный формат email',
    'Signup requires a valid password': 'Необходимо указать пароль',
    'Email rate limit exceeded': 'Превышен лимит попыток. Попробуйте позже',
    'Network request failed': 'Ошибка сети. Проверьте интернет-соединение'
  }

  // Проверяем точное совпадение
  if (translations[errorMessage]) {
    return translations[errorMessage]
  }

  // Проверяем частичное совпадение
  for (const [key, value] of Object.entries(translations)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }

  // Если перевод не найден, возвращаем оригинальное сообщение
  return errorMessage
}

export const useAuth = () => {
  const user = ref<{ id: string; name: string; email: string; phone?: string } | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const supabase = getSupabaseClient()

  // Загружаем пользователя из Supabase при инициализации
  const initUser = async () => {
    if (!supabase) return
    
    loading.value = true
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Загружаем данные профиля из таблицы profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        user.value = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.email!.split('@')[0],
          phone: profile?.phone
        }
        isAuthenticated.value = true
        console.log('✅ Пользователь авторизован:', user.value)
      } else {
        user.value = null
        isAuthenticated.value = false
        console.log('❌ Пользователь не авторизован')
      }
    } catch (err) {
      console.error('❌ Ошибка инициализации пользователя:', err)
      user.value = null
      isAuthenticated.value = false
    } finally {
      loading.value = false
    }
  }

  // Регистрация
  const register = async (name: string, email: string, phone: string, password: string) => {
    if (!supabase) throw new Error('Supabase не инициализирован')
    
    loading.value = true
    error.value = null
    
    try {
      // Регистрируем пользователя через Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      })

      if (authError) {
        error.value = translateError(authError.message)
        throw new Error(error.value)
      }

      if (authData.user) {
        // Создаем запись в таблице profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name,
            email,
            phone
          })

        if (profileError) {
          console.error('Ошибка создания профиля:', profileError)
          // Не бросаем ошибку, т.к. пользователь уже создан в auth
        }

        user.value = {
          id: authData.user.id,
          name,
          email,
          phone
        }
        isAuthenticated.value = true
        console.log('✅ Регистрация успешна:', user.value)
        return true
      }
      
      return false
    } catch (err: any) {
      console.error('❌ Ошибка регистрации:', err)
      error.value = err.message || 'Ошибка регистрации'
      return false
    } finally {
      loading.value = false
    }
  }

  // Вход
  const login = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase не инициализирован')
    
    loading.value = true
    error.value = null
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        error.value = translateError(authError.message)
        throw new Error(error.value)
      }

      if (data.user) {
        // Загружаем данные профиля
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        user.value = {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || data.user.email!.split('@')[0],
          phone: profile?.phone
        }
        isAuthenticated.value = true
        console.log('✅ Вход успешен:', user.value)
        return true
      }
      
      return false
    } catch (err: any) {
      console.error('❌ Ошибка входа:', err)
      error.value = err.message || 'Неверный email или пароль'
      return false
    } finally {
      loading.value = false
    }
  }

  // Выход
  const logout = async () => {
    if (!supabase) return
    
    loading.value = true
    try {
      await supabase.auth.signOut()
      user.value = null
      isAuthenticated.value = false
      console.log('✅ Выход выполнен')
    } catch (err) {
      console.error('❌ Ошибка выхода:', err)
    } finally {
      loading.value = false
    }
  }

  // Отслеживаем изменения состояния авторизации
  if (process.client && supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event)
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        initUser()
      } else if (event === 'SIGNED_OUT') {
        user.value = null
        isAuthenticated.value = false
      }
    })
  }

  onMounted(() => {
    initUser()
  })

  return {
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout
  }
}

// Вспомогательная функция для проверки сессии (для middleware)
export const checkAuthSession = async () => {
  if (!process.client) return false
  
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const hasSession = !!session
    console.log('🔍 checkAuthSession: session =', hasSession ? 'exists' : 'null')
    return hasSession
  } catch (err) {
    console.error('❌ Ошибка проверки сессии:', err)
    return false
  }
}
