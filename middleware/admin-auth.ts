/**
 * Middleware для защиты админских маршрутов
 * Использует общее состояние useState
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('🧐 [middleware] Route to:', to.path)

  // Пропускаем страницу логина
  if (to.path === '/admin/login') {
    console.log('🧐 [middleware] Login page, skipping')
    return
  }

  const { isAdmin, initAdmin, isInitialized } = useAdmin()

  console.log('🧐 [middleware] Current state - isInitialized:', isInitialized.value, 'isAdmin:', isAdmin.value)

  // Ожидаем инициализации, если ещё не сделана
  if (!isInitialized.value) {
    console.log('🧐 [middleware] Not initialized, calling initAdmin...')
    await initAdmin()
    console.log('🧐 [middleware] After initAdmin - isAdmin:', isAdmin.value, 'isInitialized:', isInitialized.value)
  }

  // Проверяем авторизацию
  if (!isAdmin.value) {
    console.log('🔴 [middleware] Not admin, redirecting to login')
    return navigateTo('/admin/login')
  }

  console.log('✅ [middleware] Admin allowed')
})
