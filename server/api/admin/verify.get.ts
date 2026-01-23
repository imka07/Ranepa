import { verifyToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'admin-token')

  console.log('[🔍 Admin Verify] Token exists:', !!token)
  console.log('[🔍 Admin Verify] Token value:', token ? token.substring(0, 20) + '...' : 'none')

  if (!token) {
    console.log('[❌ Admin Verify] No token found')
    return {
      authenticated: false
    }
  }

  // Проверяем токен
  const payload = verifyToken(token)

  if (!payload || payload.role !== 'admin') {
    console.log('[❌ Admin Verify] Invalid token or wrong role')
    // Удаляем невалидный токен
    deleteCookie(event, 'admin-token')
    return {
      authenticated: false
    }
  }

  console.log('[✅ Admin Verify] Token valid for:', payload.email)

  return {
    authenticated: true,
    user: {
      email: payload.email,
      role: payload.role
    }
  }
})
