import { verifyToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'admin-token')

  if (!token) {
    return {
      authenticated: false
    }
  }

  // Проверяем токен
  const payload = verifyToken(token)

  if (!payload || payload.role !== 'admin') {
    // Удаляем невалидный токен
    deleteCookie(event, 'admin-token')
    return {
      authenticated: false
    }
  }

  return {
    authenticated: true,
    user: {
      email: payload.email,
      role: payload.role
    }
  }
})
