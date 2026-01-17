import { getUserIdFromToken } from '../utils/auth'

export default defineEventHandler(async (event) => {
  // Пропускаем middleware для публичных маршрутов
  const publicPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/logout']
  
  if (publicPaths.includes(event.node.req.url || '')) {
    return
  }

  // Проверяем защищенные маршруты /api/
  if (event.node.req.url?.startsWith('/api/') && !event.node.req.url?.startsWith('/api/auth/')) {
    const userId = getUserIdFromToken(event)
    
    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Authentication required'
      })
    }

    // Сохраняем userId в контексте события для использования в обработчиках
    event.context.userId = userId
  }
})
