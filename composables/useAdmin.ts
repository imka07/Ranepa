export const useAdmin = () => {
  const adminUser = ref<{ id: string; email: string; role: 'admin' | 'superadmin' } | null>(null)
  const isAdmin = ref(false)

  // Mock администраторы
  const adminCredentials = [
    { email: 'admin@reshala.com', password: 'admin123', role: 'admin' as const },
    { email: 'superadmin@reshala.com', password: 'superadmin123', role: 'superadmin' as const }
  ]

  // Инициализация администратора из localStorage
  const initAdmin = () => {
    if (process.client) {
      const stored = localStorage.getItem('admin')
      if (stored) {
        adminUser.value = JSON.parse(stored)
        isAdmin.value = true
      }
    }
  }

  // Вход администратора
  const adminLogin = (email: string, password: string): boolean => {
    const admin = adminCredentials.find(
      a => a.email === email && a.password === password
    )
    if (admin) {
      adminUser.value = {
        id: Math.random().toString(36).substr(2, 9),
        email: admin.email,
        role: admin.role
      }
      isAdmin.value = true
      if (process.client) {
        localStorage.setItem('admin', JSON.stringify(adminUser.value))
      }
      return true
    }
    return false
  }

  // Выход администратора
  const adminLogout = () => {
    adminUser.value = null
    isAdmin.value = false
    if (process.client) {
      localStorage.removeItem('admin')
    }
  }

  onMounted(() => {
    initAdmin()
  })

  return {
    adminUser,
    isAdmin,
    adminLogin,
    adminLogout
  }
}
