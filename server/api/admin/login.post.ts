import { generateToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // Получаем credentials из окружения
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const jwtSecret = process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-production'

  if (!adminEmail || !adminPassword) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error'
    })
  }

  // Проверяем credentials
  if (email !== adminEmail || password !== adminPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
      data: { error: 'Неверный email или пароль' }
    })
  }

  // Генерируем JWT токен (валиден 7 дней)
  const token = generateToken(email, 'admin', 7 * 24 * 60 * 60 * 1000)

  // Устанавливаем cookie с токеном (httpOnly для безопасности)
  setCookie(event, 'admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 дней
    path: '/'
  })

  return {
    success: true,
    user: {
      email,
      role: 'admin'
    }
  }
})
