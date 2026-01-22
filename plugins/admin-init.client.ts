/**
 * Плагин для инициализации админа на клиенте
 * Оработает на самом начальном этапе до middleware
 */

export default defineNuxtPlugin(async () => {
  console.log('🧐 [admin-init plugin] Starting...')

  if (process.server) {
    console.log('🧐 [admin-init plugin] Server side, skipping')
    return
  }

  // Не трогаем на странице логина
  const router = useRouter()
  if (router.currentRoute.value.path === '/admin/login') {
    console.log('🧐 [admin-init plugin] Login page, skipping')
    return
  }

  try {
    console.log('🧐 [admin-init plugin] Initializing admin...')
    const { initAdmin } = useAdmin()
    await initAdmin()
    console.log('✅ [admin-init plugin] Admin initialization complete')
  } catch (err) {
    console.error('❌ [admin-init plugin] Error:', err)
  }
})
