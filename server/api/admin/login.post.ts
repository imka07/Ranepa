import { generateToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // Получаем credentials из окружения или используем fallback для разработки
  const adminEmail = process.env.ADMIN_EMAIL || 'inal@reshala.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'wodM[&7Saw/#7c0'

  console.log('[🔐 Admin Login] Attempt:', email)
  console.log('[🔐 Admin Login] Expected email:', adminEmail)
  console.log('[🔐 Admin Login] Password match:', password === adminPassword)

  // Проверяем credentials
  if (email !== adminEmail || password !== adminPassword) {
    console.log('[❌ Admin Login] Invalid credentials')
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
      data: { error: 'Неверный email или пароль' }
    })
  }

  console.log('[✅ Admin Login] Success!')

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
