export default defineNuxtRouteMiddleware(async (to, from) => {
  // На сервере пропускаем
  if (process.server) {
    return
  }

  const { isAuthenticated, user } = useAuth()

  console.log('🔐 Middleware user-auth: isAuthenticated =', isAuthenticated.value, 'user =', user.value)

  // Даем время на инициализацию auth (небольшая задержка)
  await new Promise(resolve => setTimeout(resolve, 100))

  console.log('🔐 Middleware user-auth после задержки: isAuthenticated =', isAuthenticated.value)

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated.value) {
    console.log('❌ Middleware: пользователь не авторизован, редирект на /login')
    return navigateTo('/login')
  }

  console.log('✅ Middleware: пользователь авторизован, разрешаем доступ')
})
