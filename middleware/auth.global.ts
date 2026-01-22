/**
 * Глобальные middleware для всех роутов
 * Оработает ранюше чем регулярные middleware
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Пропускаем login страницу
  if (to.path === '/admin/login') {
    console.log('\ud83e\uddd0 [auth.global] Login page, skipping')
    return
  }

  // Пропускаем не-админ routes
  if (!to.path.startsWith('/admin')) {
    return
  }

  console.log('\ud83e\uddd0 [auth.global] Checking auth for:', to.path)

  const { isAdmin, isInitialized, initAdmin } = useAdmin()

  console.log('\ud83e\uddd0 [auth.global] State - initialized:', isInitialized.value, 'isAdmin:', isAdmin.value)

  // Очень осторожно охраняем от бесконечных циклов
  if (!isInitialized.value && process.client) {
    console.log('\ud83e\uddd0 [auth.global] Not initialized, initializing...')
    try {
      await initAdmin()
      console.log('\ud83e\uddd0 [auth.global] Initialization done, isAdmin:', isAdmin.value)
    } catch (err) {
      console.error('\ud83d\udd34 [auth.global] Init error:', err)
    }
  }

  // Проверяем авторизацию
  if (!isAdmin.value) {
    console.log('\ud83d\udd34 [auth.global] Not admin, redirecting to login')
    return navigateTo('/admin/login')
  }

  console.log('\u2705 [auth.global] Auth check passed')
})
