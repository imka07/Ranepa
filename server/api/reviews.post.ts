export default defineEventHandler(async (event) => {
  try {
    // Получаем данные из формы
    const body = await readBody(event)
    
    // Валидация обязательных полей
    const requiredFields = ['name', 'role', 'rating', 'content']
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Missing required field: ${field}`
        })
      }
    }
    
    // Валидация рейтинга (должен быть от 1 до 5)
    if (body.rating < 1 || body.rating > 5) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Rating must be between 1 and 5'
      })
    }
    
    // Получаем Supabase клиент
    const supabase = getSupabaseClient()
    
    // Сохраняем отзыв в базу данных
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          name: body.name,
          role: body.role,
          rating: body.rating,
          content: body.content
        }
      ])
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save review to database'
      })
    }
    
    return {
      success: true,
      message: 'Review submitted successfully',
      data: data?.[0]
    }
  } catch (error: any) {
    console.error('Error processing review:', error)
    
    // Если это уже наша ошибка с createError, прокидываем её
    if (error.statusCode) {
      throw error
    }
    
    // Иначе возвращаем общую ошибку
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process review'
    })
  }
})
