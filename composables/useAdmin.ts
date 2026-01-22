/**
 * Админ composable с общим состоянием
 * Оно работает автоматически до client hydration
 */

export const useAdmin = () => {
  // Общее состояние в сессии
  const adminUser = useState('admin.user', () => null as { id: string; email: string; role: 'admin' | 'superadmin' } | null)
  const isAdmin = useState('admin.isAdmin', () => false)
  const isLoading = useState('admin.isLoading', () => false)
  const error = useState('admin.error', () => null as string | null)
  const isInitialized = useState('admin.isInitialized', () => false)
  const initPromise = ref<Promise<void> | null>(null)

  // Инициализация администратора
  const initAdmin = async () => {
    console.log('🧐 [useAdmin] initAdmin called, isInitialized:', isInitialized.value)

    // Если дожидаемся инициализации
    if (initPromise.value) {
      console.log('🧐 [useAdmin] Already waiting for init, returning existing promise')
      return initPromise.value
    }

    // Если уже инициализированы
    if (isInitialized.value) {
      console.log('🧐 [useAdmin] Already initialized')
      return
    }

    if (!process.client) {
      console.log('🧐 [useAdmin] Not on client, skipping')
      isInitialized.value = true
      return
    }

    console.log('🧐 [useAdmin] Starting initialization...')

    // Начинаем инициализацию
    const init = (async () => {
      isLoading.value = true
      try {
        console.log('🧐 [useAdmin] Sending verify request to server...')

        const response = await $fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include'
        } as any)

        console.log('🧐 [useAdmin] Verify response:', response)

        if (response?.isAdmin && response?.admin) {
          console.log('✅ [useAdmin] Admin verified:', response.admin.email)
          adminUser.value = response.admin
          isAdmin.value = true
          error.value = null
        } else {
          console.log('❌ [useAdmin] Response is not admin')
          adminUser.value = null
          isAdmin.value = false
        }
      } catch (err: any) {
        console.error('❌ [useAdmin] Init error:', err.message || err)
        adminUser.value = null
        isAdmin.value = false
      } finally {
        isLoading.value = false
        isInitialized.value = true
        initPromise.value = null
        console.log('🧐 [useAdmin] Initialization complete, isAdmin:', isAdmin.value)
      }
    })()

    initPromise.value = init
    return init
  }

  // Вход администратора
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    console.log('🧐 [useAdmin] Login attempt for:', email)
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/admin/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include'
      } as any)

      console.log('🧐 [useAdmin] Login response:', response)

      if (response?.success) {
        console.log('✅ [useAdmin] Login successful')
        adminUser.value = response.admin
        isAdmin.value = true
        isInitialized.value = true
        return true
      }

      console.log('❌ [useAdmin] Invalid response')
      error.value = 'Invalid response from server'
      return false
    } catch (err: any) {
      console.error('❌ [useAdmin] Login error:', err.message || err)
      error.value = err.message || 'Login error'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Выход администратора
  const adminLogout = async () => {
    console.log('🧐 [useAdmin] Logout called')
    isLoading.value = true
    try {
      await $fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      } as any)

      console.log('✅ [useAdmin] Logout successful')
      adminUser.value = null
      isAdmin.value = false
      error.value = null
      isInitialized.value = false
      initPromise.value = null
    } catch (err: any) {
      console.error('❌ [useAdmin] Logout error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Проверка, является ли роль суперадмином
  const isSuperAdmin = computed(() => adminUser.value?.role === 'superadmin')

  // Пытаемся инициализировать при onMounted
  onMounted(async () => {
    console.log('🧐 [useAdmin] onMounted called')
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
