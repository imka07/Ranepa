import { generateToken } from '~/server/utils/jwt'

// Админские учетные данные (в продакшене хранить в БД и хешировать пароль)
const adminCredentials = [
  {
    email: 'inal@reshala.com',
    password: 'x/s–$0R#Jg293_',
    role: 'admin' as const
  }
]

export default defineEventHandler(async (event) => {
  try {
    console.log('🔍 [LOGIN] Login attempt')

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

    console.log('🔍 [LOGIN] Email:', email)

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
      console.log('🔴 [LOGIN] Invalid credentials')
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    console.log('🔊 [LOGIN] Credentials valid, generating token')

    // Генерируем токен
    const token = generateToken(admin.email, admin.role, 24 * 60 * 60 * 1000) // 24 часа

    console.log('🔊 [LOGIN] Token generated, length:', token.length)
    console.log('🔊 [LOGIN] Setting cookie with secure:', process.env.NODE_ENV === 'production')

    // Устанавливаем httpOnly cookie с токеном
    setCookie(event, 'admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 часа в секундах
    })

    console.log('✅ [LOGIN] Cookie set successfully')

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
    console.error('🔴 [LOGIN] Error:', error.statusMessage || error.message)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
