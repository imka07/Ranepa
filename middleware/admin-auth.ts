/**
 * Middleware для защиты админских маршрутов
 * Проверяет токен в cookies при каждой загрузке страницы
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Пропускаем страницу логина
  if (to.path === '/admin/login') {
    return
  }

  const { isAdmin, initAdmin, isInitialized } = useAdmin()

  // Предотвращаем двойную инициализацию
  if (!isInitialized.value) {
    // Ожидаем инициализации
    await initAdmin()
  }

  // После инициализации проверяем авторизацию
  if (!isAdmin.value) {
    return navigateTo('/admin/login')
  }
})
