import { PrismaClient } from '@prisma/client'
import { getUserIdFromToken } from '~/server/utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const userId = getUserIdFromToken(event)

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return { user }
  } catch (error) {
    console.error('Me endpoint error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
})
