/**
 * Middleware для защиты админских маршрутов
 * Проверяет токен в cookies при каждой загрузке страницы
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('🧐 [middleware] Route to:', to.path)

  // Пропускаем страницу логина
  if (to.path === '/admin/login') {
    console.log('🧐 [middleware] Login page, skipping')
    return
  }

  const { isAdmin, initAdmin, isInitialized } = useAdmin()

  console.log('🧐 [middleware] isInitialized:', isInitialized.value, 'isAdmin:', isAdmin.value)

  // Предотвращаем двойную инициализацию
  if (!isInitialized.value) {
    console.log('🧐 [middleware] Not initialized, calling initAdmin...')
    // Ожидаем инициализации
    await initAdmin()
    console.log('🧐 [middleware] After initAdmin, isAdmin:', isAdmin.value)
  } else {
    console.log('🧐 [middleware] Already initialized')
  }

  // После инициализации проверяем авторизацию
  if (!isAdmin.value) {
    console.log('🔴 [middleware] Not admin, redirecting to login')
    return navigateTo('/admin/login')
  }

  console.log('✅ [middleware] Admin allowed')
})
