import type { Ref } from 'vue'

export const useAuth = () => {
  const user = ref<{ id: string; name: string; email: string; phone?: string } | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const supabase = useSupabase()

  // Переводим ошибки на русский
  const translateError = (errorMessage: string): string => {
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

  // Загружаем пользователя из Supabase при инициализации
  const initUser = async () => {
    if (!supabase) {
      console.log('⚠️ Supabase не инициализирован в initUser')
      return
    }
    
    loading.value = true
    try {
      console.log('🔍 initUser: Получение сессии...')
      const { data: { session } } = await supabase.auth.getSession()
      console.log('🔍 initUser: Сессия =', session ? 'существует' : 'null')
      
      if (session?.user) {
        console.log('✅ initUser: Пользователь найден:', session.user.email)
        
        // Загружаем данные профиля из таблицы profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.warn('⚠️ Ошибка загрузки профиля:', profileError)
        }

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
      console.log('📝 Регистрация пользователя:', email)
      
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

      console.log('📝 Результат регистрации:', { authData, authError })

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
    if (!supabase) {
      console.error('❌ Supabase не инициализирован в login')
      throw new Error('Supabase не инициализирован')
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🔐 Попытка входа:', email)
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('🔐 Результат входа:', { 
        hasSession: !!data.session, 
        hasUser: !!data.user,
        error: authError 
      })

      if (authError) {
        console.error('❌ Ошибка авторизации:', authError)
        error.value = translateError(authError.message)
        throw new Error(error.value)
      }

      if (data.session && data.user) {
        console.log('✅ Сессия создана для:', data.user.email)
        
        // Проверяем что сессия сохранена в localStorage
        const storageKey = 'sb-oftajdtaeqaylohgefba-auth-token'
        const storedSession = localStorage.getItem(storageKey)
        console.log('💾 Сессия в localStorage:', storedSession ? 'есть' : 'НЕТ')
        
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
        
        // Ждем немного чтобы сессия точно сохранилась
        await new Promise(resolve => setTimeout(resolve, 100))
        
        return true
      }
      
      console.error('❌ Нет сессии или пользователя после входа')
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
      console.log('🚪 Выход из аккаунта')
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
      console.log('🔄 Auth state changed:', event, session ? 'session exists' : 'no session')
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('✅ Событие SIGNED_IN/TOKEN_REFRESHED - обновляем пользователя')
        initUser()
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 Событие SIGNED_OUT - очищаем данные')
        user.value = null
        isAuthenticated.value = false
      }
    })
  }

  onMounted(() => {
    console.log('🎬 useAuth mounted - инициализация пользователя')
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
  
  const supabase = useSupabase()
  if (!supabase) {
    console.log('⚠️ checkAuthSession: Supabase не инициализирован')
    return false
  }
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const hasSession = !!session
    console.log('🔍 checkAuthSession: session =', hasSession ? 'exists' : 'null')
    
    if (session) {
      console.log('✅ checkAuthSession: Пользователь:', session.user.email)
    }
    
    return hasSession
  } catch (err) {
    console.error('❌ Ошибка проверки сессии:', err)
    return false
  }
}
