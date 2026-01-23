export default defineNuxtRouteMiddleware(async (to, from) => {
  // Только для клиента и серверного рендеринга
  const { isAuthenticated, isLoading, checkAuth } = useAdminAuth()

  // Если еще не проверяли авторизацию - проверяем
  if (process.client && isLoading.value) {
    await checkAuth()
  }

  // На сервере всегда проверяем
  if (process.server) {
    await checkAuth()
  }

  // Если не авторизован - редиректим на страницу логина
  if (!isAuthenticated.value) {
    return navigateTo('/admin-login')
  }
})
