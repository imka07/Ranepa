export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
