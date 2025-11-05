// server/api/send-telegram.js
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Валидация обязательных полей
    if (!body.name || !(body.phone || body.telegram)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Не заполнены обязательные поля'
      })
    }
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    
    if (!botToken || !chatId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Не настроены переменные окружения для Telegram бота'
      })
    }
    
    // Форматируем сообщение
    const message = `
🎯 *Новая заявка*

👤 *Имя:* ${body.name}
📞 *Телефон:* ${body.phone || 'Не указан'}
📱 *Способ связи:* ${body.contactType}
💬 *Telegram:* ${body.telegram || 'Не указан'}

📝 *Комментарий:*
${body.comment || 'Не указан'}

📎 *Файл:* ${body.file ? body.file.name : 'Не прикреплен'}

🕒 *Время отправки:* ${new Date().toLocaleString('ru-RU')}
    `

    // Создаем временную папку для файлов
    const tempDir = path.join(__dirname, '..', '..', 'temp')
    try {
      await fs.access(tempDir)
    } catch {
      await fs.mkdir(tempDir, { recursive: true })
    }

    let tempFilePath = null

    try {
      // Если есть файл, сохраняем его временно
      if (body.fileData && body.file) {
        tempFilePath = path.join(tempDir, `file_${Date.now()}_${body.file.name}`)
        const fileBuffer = Buffer.from(body.fileData, 'base64')
        await fs.writeFile(tempFilePath, fileBuffer)
      }

      // Отправляем текстовое сообщение в Telegram
      await $fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        }
      })

      // Если есть файл, отправляем его в Telegram
      if (tempFilePath && body.file) {
        // Создаем FormData для отправки файла
        const formData = new FormData()
        formData.append('chat_id', chatId)
        formData.append('caption', `Файл: ${body.file.name}`)
        
        // Читаем файл и добавляем в FormData
        const fileBuffer = await fs.readFile(tempFilePath)
        const blob = new Blob([fileBuffer], { type: body.file.type })
        formData.append('document', blob, body.file.name)

        // Отправляем файл через fetch
        await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
          method: 'POST',
          body: formData
        })
      }

      return { 
        success: true, 
        message: 'Заявка успешно отправлена!'
      }
      
    } finally {
      // Удаляем временный файл если он был создан
      if (tempFilePath) {
        try {
          await fs.unlink(tempFilePath)
        } catch (error) {
          console.error('Ошибка при удалении временного файла:', error)
        }
      }
    }
    
  } catch (error) {
    console.error('Telegram API Error:', error)
    
    let errorMessage = 'Ошибка отправки заявки'
    
    if (error.statusCode === 400) {
      errorMessage = error.statusMessage
    } else if (error.message?.includes('chat not found')) {
      errorMessage = 'Ошибка конфигурации бота'
    } else if (error.message?.includes('bot token')) {
      errorMessage = 'Неверный токен бота'
    }
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: errorMessage
    })
  }
})