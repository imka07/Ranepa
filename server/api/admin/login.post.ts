import { generateToken } from '~/server/utils/jwt'

// Админские учетные данные (в продакшене хранить в БД и хешировать пароль)
const adminCredentials = [
  {
    email: 'admin@reshala.com',
    password: 'admin123',
    role: 'admin' as const
  },
  {
    email: 'superadmin@reshala.com',
    password: 'superadmin123',
    role: 'superadmin' as const
  }
]

export default defineEventHandler(async (event) => {
  try {
    // Проверяем что запрос POST
    if (event.node.req.method !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
      })
    }

    // Получаем данные из body
    const body = await readBody(event)
    const { email, password } = body

    // Валидация
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    // Проверяем учетные данные
    const admin = adminCredentials.find(
      (a) => a.email === email && a.password === password
    )

    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    // Генерируем токен
    const token = generateToken(admin.email, admin.role, 24 * 60 * 60 * 1000) // 24 часа

    // Устанавливаем httpOnly cookie с токеном
    setCookie(event, 'admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 часа в секундах
    })

    // Возвращаем успешный ответ (без самого токена, т.к. он в cookie)
    return {
      success: true,
      message: 'Login successful',
      admin: {
        email: admin.email,
        role: admin.role
      }
    }
  } catch (error: any) {
    console.error('Admin login error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
