import { PrismaClient } from '@prisma/client'
import { comparePassword, generateToken, setAuthCookie } from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Валидация
    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        message: 'Email and password are required'
      })
    }

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    // Проверяем пароль
    const isPasswordValid = await comparePassword(body.password, user.password)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    // Проверяем активен ли пользователь
    if (!user.isActive) {
      throw createError({
        statusCode: 403,
        message: 'User account is inactive'
      })
    }

    // Генерируем токен
    const token = generateToken(user.id)

    // Устанавливаем cookie
    setAuthCookie(event, token)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      },
      token
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
})
