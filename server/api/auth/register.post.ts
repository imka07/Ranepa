import { PrismaClient } from '@prisma/client'
import { hashPassword, generateToken, setAuthCookie } from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Валидация
    if (!body.email || !body.password || !body.name) {
      throw createError({
        statusCode: 400,
        message: 'Email, password and name are required'
      })
    }

    if (body.password.length < 6) {
      throw createError({
        statusCode: 400,
        message: 'Password must be at least 6 characters'
      })
    }

    // Проверяем экзистирует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'User with this email already exists'
      })
    }

    // Хешируем пароль
    const hashedPassword = await hashPassword(body.password)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
        phone: body.phone || null
      }
    })

    // Генерируем токен
    const token = generateToken(user.id)

    // Устанавливаем cookie
    setAuthCookie(event, token)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone
      },
      token
    }
  } catch (error) {
    console.error('Register error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
})
