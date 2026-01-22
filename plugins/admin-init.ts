/**
 * Плагин для инициализации админ авторизации до middleware
 * Выполняется раню в процессе инициализации приложения
 */

export default defineNuxtPlugin(async (nuxtApp) => {
  console.log('🔌 [admin-init] Plugin loading')

  // Пытаемся инициализировать админ сразу
  if (process.client) {
    // На клиенте это не работает в plugins, надо app:mounted
    nuxtApp.hooks.hook('app:mounted', async () => {
      console.log('🔌 [admin-init] app:mounted hook')
      const { initAdmin } = useAdmin()
      await initAdmin()
    })
  }
})
