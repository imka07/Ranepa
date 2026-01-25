import { getSupabaseClient } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Получаем данные из формы
  const body = await readBody(event)
  
  // Валидация обязательных полей
  const requiredFields = ['workType', 'subject', 'theme', 'deadline', 'volume', 'name', 'contactType']
  for (const field of requiredFields) {
    if (!body[field]) {
      throw createError({
        statusCode: 400,
        statusMessage: `Missing required field: ${field}`
      })
    }
  }
  
  // Проверяем контактные данные
  if (body.contactType === 'phone' && !body.phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Phone number is required when contact type is phone'
    })
  }
  
  if (body.contactType === 'telegram' && !body.telegram) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Telegram is required when contact type is telegram'
    })
  }

  try {
    // Сохраняем заказ в Supabase
    const supabase = getSupabaseClient()
    
    // Проверяем, передан ли валидный userId
    // Если пользователь не авторизован, userId будет null
    const userId = body.userId && body.userId !== 'guest' ? body.userId : null
    
    const orderData = {
      user_id: userId, // NULL для гостей, UUID для авторизованных
      user_name: body.userName || body.name,
      user_email: body.userEmail || body.contactType === 'phone' ? body.phone : body.telegram,
      work_type: body.workType,
      subject: body.subject,
      theme: body.theme,
      deadline: body.deadline,
      volume: body.volume,
      comment: body.comment || '',
      name: body.name,
      contact_type: body.contactType,
      phone: body.phone || '',
      telegram: body.telegram || '',
      file: body.file || null,
      status: 'в работе',
      sections: [
        { id: 'plan', name: 'План', completed: false },
        { id: 'chapter1', name: '1 глава', completed: false },
        { id: 'chapter2', name: '2 глава', completed: false },
        { id: 'chapter3', name: '3 глава', completed: false },
        { id: 'presentation', name: 'Преза', completed: false }
      ]
    }

    console.log('📝 Создание заказа:', { userId, userName: orderData.user_name, userEmail: orderData.user_email })

    // Type assertion to fix TypeScript error - Supabase doesn't have schema types configured
    const { data: order, error } = await (supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single() as any)

    if (error) {
      console.error('❌ Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to save order to database: ${error.message}`
      })
    }

    console.log('✅ Заказ создан:', order.id)

    // Подготавливаем сообщение для Telegram
    const telegramMessage = formatTelegramMessage(body)
    
    // Отправляем в Telegram (если креды не настроены — просто пропускаем отправку)
    await sendToTelegram(telegramMessage, body.file || null)
    
    // Возвращаем успешный ответ с созданным заказом
    return {
      success: true,
      message: 'Order submitted successfully',
      order
    }
  } catch (error: any) {
    console.error('❌ Error processing order:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to process order: ${error.message || 'Unknown error'}`
    })
  }
})

/**
 * Форматирует данные заявки в сообщение для Telegram
 */
function formatTelegramMessage(data: any): string {
  const workTypeLabels: Record<string, string> = {
    essay: 'Реферат',
    coursework: 'Курсовая работа',
    diploma: 'Дипломная работа',
    abstract: 'Абстракт',
    presentation: 'Презентация',
    solution: 'Решение задач',
    report: 'Реферат',
    scientific_article: 'Научная статья',
    exam_help: 'Помощь на экзамене',
    other: 'Другое'
  }

  const contactInfo = data.contactType === 'phone'
    ? `📞 ${data.phone}`
    : `📱 @${data.telegram}`

  return `🎯 <b>Новая заявка</b>

<b>Информация о работе:</b>
📚 Тип работы: ${workTypeLabels[data.workType] || data.workType}
📖 Предмет: ${data.subject}
✏️ Тема: ${data.theme}
⏰ Срок: ${formatDate(data.deadline)}
📄 Объём: ${data.volume} стр.

<b>Контактные данные:</b>
👤 Имя: ${data.name}
${contactInfo}

${data.comment ? `<b>Комментарий:</b>\n${data.comment}` : ''}`.trim()
}

/**
 * Форматирует дату в читаемый вид
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

/**
 * Отправляет сообщение и файл в Telegram
 */
async function sendToTelegram(message: string, file: any): Promise<void> {
  // Получаем токен бота и ID чата из переменных окружения
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  // Если креды не настроены — не валим обработку заявки (гостевой флоу должен работать)
  if (!botToken || !chatId) {
    console.warn('⚠️ Telegram credentials not configured (TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID). Skipping Telegram notification.')
    return
  }

  // Отправляем текстовое сообщение
  const textResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    })
  })

  if (!textResponse.ok) {
    throw new Error(`Failed to send message to Telegram: ${textResponse.statusText}`)
  }

  // Если есть файл, отправляем его
  if (file) {
    try {
      // Преобразуем base64 в Buffer
      const fileBuffer = Buffer.from(file.base64, 'base64')
      
      // Создаём FormData для отправки файла
      const formData = new FormData()
      formData.append('chat_id', chatId)
      formData.append('document', new Blob([fileBuffer], { type: file.type }), file.name)
      formData.append('caption', `📎 Файл к заявке: ${file.name}`)
      formData.append('parse_mode', 'HTML')

      const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: 'POST',
        body: formData
      })

      if (!fileResponse.ok) {
        console.error(`Warning: Failed to send file to Telegram: ${fileResponse.statusText}`)
        // Не выбрасываем ошибку, так как сообщение уже отправлено
      }
    } catch (error) {
      console.error('Warning: Error sending file to Telegram:', error)
      // Не выбрасываем ошибку, так как сообщение уже отправлено
    }
  }
}
