import { verifyToken, decodeToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    // Получаем токен из cookies
    const token = getCookie(event, 'admin_token')

    console.log('\ud83d\udd0d [VERIFY] Cookie received:', token ? 'YES (length: ' + token.length + ')' : 'NO')

    if (!token) {
      console.log('\ud83d\udd34 [VERIFY] No token in cookies')
      throw createError({
        statusCode: 401,
        statusMessage: 'No auth token found'
      })
    }

    // Проверяем токен
    const verified = verifyToken(token)

    if (!verified) {
      console.log('\ud83d\udd34 [VERIFY] Token verification failed')
      // Удаляем невалидный токен
      setCookie(event, 'admin_token', '', { maxAge: 0 })

      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }

    console.log('\ud83d\udd0a [VERIFY] Token verified successfully:', verified.email)

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
    console.log('\ud83d\udd34 [VERIFY] Error:', error.statusMessage || error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
