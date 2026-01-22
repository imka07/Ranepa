export const useAdmin = () => {
  const adminUser = ref<{ id: string; email: string; role: 'admin' | 'superadmin' } | null>(null)
  const isAdmin = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // Инициализация администратора при загрузке
  const initAdmin = async () => {
    if (isInitialized.value) return // Предотвращаем двойную инициализацию
    if (!process.client) return

    isLoading.value = true
    try {
      // Проверяем, есть ли валидный токен на сервере
      // Отправляем с credentials: 'include', чтобы cookies отправлялись
      const { data, error: fetchError } = await useFetch('/api/admin/verify', {
        credentials: 'include'
      })

      if (!fetchError.value && data.value?.isAdmin && data.value.admin) {
        adminUser.value = data.value.admin
        isAdmin.value = true
        error.value = null
      } else {
        adminUser.value = null
        isAdmin.value = false
      }
    } catch (err: any) {
      // Если ошибка - значит, нет валидного токена
      adminUser.value = null
      isAdmin.value = false
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  // Вход администратора
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useFetch('/api/admin/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include'
      })

      if (fetchError.value) {
        error.value = fetchError.value?.message || 'Login failed'
        return false
      }

      if (data.value?.success) {
        // После успешного логина, получаем информацию из токена
        adminUser.value = data.value.admin
        isAdmin.value = true
        isInitialized.value = true
        return true
      }

      error.value = 'Invalid response from server'
      return false
    } catch (err: any) {
      error.value = err.message || 'Login error'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Выход администратора
  const adminLogout = async () => {
    isLoading.value = true
    try {
      await useFetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })

      adminUser.value = null
      isAdmin.value = false
      error.value = null
      isInitialized.value = false
    } catch (err: any) {
      console.error('Logout error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Проверка, является ли роль суперадмином
  const isSuperAdmin = computed(() => adminUser.value?.role === 'superadmin')

  onMounted(async () => {
    await initAdmin()
  })

  return {
    adminUser,
    isAdmin,
    isLoading,
    error,
    isSuperAdmin,
    adminLogin,
    adminLogout,
    initAdmin,
    isInitialized
  }
}
