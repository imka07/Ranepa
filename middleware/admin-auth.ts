/**
 * Middleware для защиты админских маршрутов
 * Проверяет токен в cookies при сервер-сайде рендеринге
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Пропускаем страницу логина
  if (to.path === '/admin/login') {
    return
  }

  // Проверяем админ статус
  const { isAdmin, initAdmin } = useAdmin()

  // Обновляем статус из сервера (в случае SSR)
  if (process.server) {
    await initAdmin()
  }

  // На клиенте проверяем можно ли есть изуст токен
  if (!isAdmin.value) {
    // Попытка понравить статус
    await initAdmin()
  }

  // Окончательная проверка
  if (!isAdmin.value) {
    return navigateTo('/admin/login')
  }
})
