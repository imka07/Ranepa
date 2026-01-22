/**
 * Middleware для защиты админских маршрутов
 * Проверяет токен в cookies при сервер-сайде рендеринге
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Пропускаем страницу логина
  if (to.path === '/admin/login') {
    return
  }

  const { isAdmin, initAdmin, isInitialized } = useAdmin()

  // Предотвращаем двойную инициализацию
  if (isInitialized.value) {
    // Если уже инициализированы, но не авторизован
    if (!isAdmin.value) {
      return navigateTo('/admin/login')
    }
    return
  }

  // Првая инициализация - нужно дождаться
  await initAdmin()

  // Окончательная проверка
  if (!isAdmin.value) {
    return navigateTo('/admin/login')
  }
})
