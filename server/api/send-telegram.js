// server/api/send-telegram.js
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
    
    // Получаем переменные из runtimeConfig
    const config = useRuntimeConfig()
    const botToken = config.telegramBotToken
    const chatId = config.telegramChatId
    
    console.log('Config check:', { 
      hasToken: !!botToken, 
      hasChatId: !!chatId,
      tokenLength: botToken?.length,
      chatId: chatId
    })
    
    if (!botToken || !chatId) {
      console.error('Missing Telegram config:', { botToken, chatId })
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

    // Отправляем текстовое сообщение в Telegram
    const telegramResponse = await $fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
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

    console.log('Telegram message sent:', telegramResponse)

    // Если есть файл, отправляем его отдельным сообщением
    if (body.file && body.fileData) {
      try {
        // Для Netlify Functions нам нужно использовать Buffer
        const fileBuffer = Buffer.from(body.fileData, 'base64')
        
        // Создаем FormData для отправки файла
        const formData = new FormData()
        formData.append('chat_id', chatId)
        formData.append('caption', `📎 Файл: ${body.file.name}`)
        formData.append('document', new Blob([fileBuffer]), body.file.name)

        // Отправляем файл
        await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
          method: 'POST',
          body: formData
        })
        
        console.log('File sent to Telegram')
      } catch (fileError) {
        console.error('Error sending file to Telegram:', fileError)
        // Не прерываем выполнение, если файл не отправился
      }
    }

    return { 
      success: true, 
      message: 'Заявка успешно отправлена!'
    }
    
  } catch (error) {
    console.error('Telegram API Error:', error)
    
    let errorMessage = 'Ошибка отправки заявки'
    
    if (error.statusCode === 400) {
      errorMessage = error.statusMessage
    } else if (error.data?.description?.includes('chat not found')) {
      errorMessage = 'Ошибка конфигурации бота: chat not found'
    } else if (error.data?.description?.includes('bot token')) {
      errorMessage = 'Неверный токен бота'
    } else if (error.message?.includes('fetch failed')) {
      errorMessage = 'Ошибка сети при отправке в Telegram'
    }
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: errorMessage
    })
  }
})