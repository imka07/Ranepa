export const useAuth = () => {
  const user = ref<{ id: string; name: string; email: string; phone: string } | null>(null)
  const isAuthenticated = ref(false)

  // Test user credentials
  const testUser = {
    id: '1',
    name: 'Test User',
    email: 'test@mail.com',
    phone: '+7 900 000-00-00'
  }
  const testPassword = 'password123'

  // Загружаем пользователя из localStorage при инициализации
  const initUser = () => {
    if (process.client) {
      const stored = localStorage.getItem('user')
      if (stored) {
        user.value = JSON.parse(stored)
        isAuthenticated.value = true
      } else {
        // Автоматический вход тестового пользователя
        user.value = testUser
        isAuthenticated.value = true
        localStorage.setItem('user', JSON.stringify(testUser))
        localStorage.setItem('password', testPassword)
      }
    } else {
      // На сервере также устанавливаем тестового пользователя
      user.value = testUser
      isAuthenticated.value = true
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
      localStorage.setItem('password', password)
    }
  }

  // Вход
  const login = (email: string, password: string) => {
    // Проверка тестовых учетных данных
    if (email === testUser.email && password === testPassword) {
      user.value = testUser
      isAuthenticated.value = true
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(testUser))
        localStorage.setItem('password', testPassword)
      }
      return true
    }

    // Проверка сохраненных пользователей
    if (process.client) {
      const stored = localStorage.getItem('user')
      const storedPassword = localStorage.getItem('password')
      if (stored && storedPassword === password) {
        const storedUser = JSON.parse(stored)
        if (storedUser.email === email) {
          user.value = storedUser
          isAuthenticated.value = true
          return true
        }
      }
    }

    return false
  }

  // Выход (отключена функциональность)
  const logout = () => {
    // Функция отключена, пользователь всегда остается авторизованным
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
