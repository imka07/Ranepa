// server/api/uploads/[...].js
export default defineEventHandler(async (event) => {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    try {
      const fileName = event.context.params._.join('/')
      const filePath = path.join('./uploads', fileName)
      
      // Проверяем существует ли файл
      try {
        await fs.access(filePath)
      } catch {
        throw createError({
          statusCode: 404,
          statusMessage: 'Файл не найден'
        })
      }
      
      // Читаем файл
      const fileBuffer = await fs.readFile(filePath)
      const fileStats = await fs.stat(filePath)
      
      // Устанавливаем заголовки для скачивания
      setResponseHeaders(event, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileStats.size
      })
      
      return fileBuffer
      
    } catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || 'Ошибка при загрузке файла'
      })
    }
  })