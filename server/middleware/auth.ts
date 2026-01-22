import { verifyToken } from '~/server/utils/jwt'

/**
 * Server middleware для проверки админского токена на сервере
 * Выполняется при каждом запросе на сервере
 */
export default defineEventHandler((event) => {
  // Пропускаем admin/login и его подстраницы
  if (event.node.req.url?.startsWith('/admin/login')) {
    return
  }

  // Пропускаем API запросы кроме админских
  if (event.node.req.url?.startsWith('/api/') && !event.node.req.url?.startsWith('/api/admin/')) {
    return
  }

  // Пропускаем другие пути (не админские)
  if (!event.node.req.url?.startsWith('/admin') && !event.node.req.url?.startsWith('/api/admin/')) {
    return
  }

  // Для админских путей проверяем токен
  if (event.node.req.url?.startsWith('/admin/') || event.node.req.url?.startsWith('/api/admin/')) {
    // Пропускаем login endpoint
    if (event.node.req.url?.includes('/admin/login')) {
      return
    }

    // Для GET запросов на админские страницы проверяем токен
    if (event.node.req.method === 'GET' && event.node.req.url?.startsWith('/admin/')) {
      const token = getCookie(event, 'admin_token')

      // Если токена нет или он невалиден, сохраняем в контексте
      if (!token || !verifyToken(token)) {
        // Сохраняем статус в контексте для использования на клиенте
        event.node.res.setHeader('X-Auth-Status', 'unauthorized')
      }
    }
  }
})
