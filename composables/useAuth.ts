export const useAuth = () => {
  const user = ref<{ id: string; name: string; email: string; phone: string } | null>(null)
  const isAuthenticated = ref(false)

  // Загружаем пользователя из localStorage при инициализации
  const initUser = () => {
    if (process.client) {
      const stored = localStorage.getItem('user')
      if (stored) {
        user.value = JSON.parse(stored)
        isAuthenticated.value = true
      }
    }
  }

  // Регистрация
  const register = (name: string, email: string, phone: string, password: string) => {
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone
    }
    user.value = newUser
    isAuthenticated.value = true
    if (process.client) {
      localStorage.setItem('user', JSON.stringify(newUser))
      localStorage.setItem('password', password) // Не делай так в продакшене!
    }
  }

  // Вход
  const login = (email: string, password: string) => {
    if (process.client) {
      const stored = localStorage.getItem('user')
      const storedPassword = localStorage.getItem('password')
      if (stored && storedPassword === password) {
        user.value = JSON.parse(stored)
        isAuthenticated.value = true
        return true
      }
    }
    return false
  }

  // Выход
  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    if (process.client) {
      localStorage.removeItem('user')
      localStorage.removeItem('password')
    }
  }

  onMounted(() => {
    initUser()
  })

  return {
    user,
    isAuthenticated,
    register,
    login,
    logout
  }
}
