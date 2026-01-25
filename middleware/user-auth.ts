export default defineNuxtRouteMiddleware(async (to, from) => {
  // На сервере пропускаем
  if (process.server) {
    return
  }

  console.log('🔐 Middleware user-auth: проверка доступа к', to.path)

  // Проверяем сессию напрямую через Supabase
  const { checkAuthSession } = await import('~/composables/useAuth')
  const hasSession = await checkAuthSession()

  console.log('🔍 Middleware: hasSession =', hasSession)

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!hasSession) {
    console.log('❌ Middleware: нет активной сессии, редирект на /login')
    return navigateTo('/login')
  }

  console.log('✅ Middleware: сессия активна, разрешаем доступ')
})
