export default defineNuxtRouteMiddleware(async (to, from) => {
  // Проверяем авторизацию напрямую через API
  try {
    const response = await $fetch<{ authenticated: boolean }>('/api/admin/verify', {
      credentials: 'include'
    })

    if (!response.authenticated) {
      return navigateTo('/admin-login')
    }
  } catch (error) {
    console.error('Auth check failed:', error)
    return navigateTo('/admin-login')
  }
})
