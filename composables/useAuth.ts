import { ref, onMounted } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: string
}

export const useAuth = () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Загружаем текущего пользователя
  const fetchCurrentUser = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch('/api/auth/me')
      user.value = response.user
      isAuthenticated.value = true
    } catch (err: any) {
      // Если токен истекол или невалиден, очистяем
      if (err.status === 401) {
        user.value = null
        isAuthenticated.value = false
      }
    } finally {
      isLoading.value = false
    }
  }

  // Регистрация
  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name,
          email,
          phone,
          password
        }
      })

      user.value = response.user
      isAuthenticated.value = true

      return { success: true }
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Ошибка регистрации'
      error.value = errorMessage
      console.error('Register error:', err)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Выход
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email,
          password
        }
      })

      user.value = response.user
      isAuthenticated.value = true

      return { success: true }
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Неверные данные для входа'
      error.value = errorMessage
      console.error('Login error:', err)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Выход из приложения
  const logout = async () => {
    try {
      isLoading.value = true
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      isAuthenticated.value = false
      isLoading.value = false
      error.value = null
    }
  }

  // При монтировании компонента
  onMounted(() => {
    fetchCurrentUser()
  })

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    fetchCurrentUser
  }
}
