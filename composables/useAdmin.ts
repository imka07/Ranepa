export const useAdmin = () => {
  const adminUser = ref<{ id: string; email: string; role: 'admin' | 'superadmin' } | null>(null)
  const isAdmin = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)
  const initPromise = ref<Promise<void> | null>(null)

  // Инициализация администратора при загружке
  const initAdmin = async () => {
    // Если дожидаемся инициализации, вернем ту же победу
    if (initPromise.value) {
      return initPromise.value
    }

    // Если уже инициализированы
    if (isInitialized.value) {
      return
    }

    if (!process.client) {
      isInitialized.value = true
      return
    }

    // Начинаем инициализацию
    const init = (async () => {
      isLoading.value = true
      try {
        // Проверяем, есть ли валидный токен на сервере
        // Отправляем с credentials: 'include', чтобы cookies отправлялись
        const response = await $fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include'
        } as any).catch(() => null)

        if (response?.isAdmin && response?.admin) {
          adminUser.value = response.admin
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
        initPromise.value = null
      }
    })()

    initPromise.value = init
    return init
  }

  // Вход администратора
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/admin/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include'
      } as any)

      if (response?.success) {
        // После успешного логина, получаем информацию из токена
        adminUser.value = response.admin
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
      await $fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      } as any)

      adminUser.value = null
      isAdmin.value = false
      error.value = null
      isInitialized.value = false
      initPromise.value = null
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
