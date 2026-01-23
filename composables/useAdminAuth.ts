import type { Ref } from 'vue'

export interface AdminUser {
  email: string
  role: 'admin'
}

export const useAdminAuth = () => {
  const isAuthenticated: Ref<boolean> = useState('admin-authenticated', () => false)
  const adminUser: Ref<AdminUser | null> = useState('admin-user', () => null)
  const isLoading: Ref<boolean> = useState('admin-loading', () => false)

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
        return { success: false, error: 'Вы ввели неверный пароль, попробуйте еще раз' }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: 'Вы ввели неверный пароль, попробуйте еще раз' }
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
