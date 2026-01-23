import type { Ref } from 'vue'

export interface AdminUser {
  email: string
  role: 'admin'
}

export const useAdminAuth = () => {
  const isAuthenticated: Ref<boolean> = useState('admin-authenticated', () => false)
  const adminUser: Ref<AdminUser | null> = useState('admin-user', () => null)
  const isLoading: Ref<boolean> = useState('admin-loading', () => true)

  /**
   * Проверяет авторизацию при загрузке приложения
   */
  const checkAuth = async () => {
    isLoading.value = true
    try {
      const response = await $fetch<{ authenticated: boolean; user?: AdminUser }>('/api/admin/verify', {
        credentials: 'include'
      })

      if (response.authenticated && response.user) {
        isAuthenticated.value = true
        adminUser.value = response.user
      } else {
        isAuthenticated.value = false
        adminUser.value = null
      }
    } catch (error) {
      isAuthenticated.value = false
      adminUser.value = null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Вход администратора
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await $fetch<{ success: boolean; user?: AdminUser; error?: string }>('/api/admin/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include'
      })

      if (response.success && response.user) {
        isAuthenticated.value = true
        adminUser.value = response.user
        return { success: true }
      } else {
        return { success: false, error: response.error || 'Ошибка авторизации' }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Правильная обработка ошибок от API
      if (error?.data?.error) {
        return { success: false, error: error.data.error }
      } else if (error?.statusMessage) {
        return { success: false, error: error.statusMessage === 'Invalid credentials' ? 'Неверный email или пароль' : error.statusMessage }
      } else if (error?.message) {
        return { success: false, error: error.message }
      } else {
        return { success: false, error: 'Ошибка подключения к серверу' }
      }
    }
  }

  /**
   * Выход администратора
   */
  const logout = async () => {
    try {
      await $fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      isAuthenticated.value = false
      adminUser.value = null
    }
  }

  return {
    isAuthenticated,
    adminUser,
    isLoading,
    checkAuth,
    login,
    logout
  }
}
