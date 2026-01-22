import { verifyToken, decodeToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    // Получаем токен из cookies
    const token = getCookie(event, 'admin_token')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No auth token found'
      })
    }

    // Проверяем токен
    const verified = verifyToken(token)

    if (!verified) {
      // Удаляем невалидный токен
      setCookie(event, 'admin_token', '', { maxAge: 0 })

      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }

    // Возвращаем информацию админа
    return {
      isAdmin: true,
      admin: {
        id: verified.id,
        email: verified.email,
        role: verified.role
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
