/**
 * Плагин для инициализации админ авторизации на старте приложения
 * Это должно происходить ДО того, как сработает route middleware
 */

export default defineNuxtPlugin(async (nuxtApp) => {
  console.log('🔌 [admin-init plugin] Starting...')

  // Ждём пока app будет готов
  await nuxtApp.hooks.hook('app:created', async () => {
    console.log('🔌 [admin-init plugin] App created, initializing admin...')

    // Получаем composable
    const { initAdmin, isAdmin } = useAdmin()

    // Инициализируем админ статус
    if (process.client && !isAdmin.value) {
      console.log('🔌 [admin-init plugin] Calling initAdmin...')
      await initAdmin()
      console.log('🔌 [admin-init plugin] InitAdmin done, isAdmin:', isAdmin.value)
    }
  })
})
