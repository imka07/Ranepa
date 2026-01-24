import { getSupabaseClient } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const supabase = getSupabaseClient()
    
    // Получаем все заказы, отсортированные по дате создания (новые первыми)
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch orders from database'
      })
    }

    // Преобразуем snake_case поля в camelCase для фронтенда
    const transformedOrders = orders.map(order => ({
      id: order.id,
      userId: order.user_id,
      userName: order.user_name,
      userEmail: order.user_email,
      workType: order.work_type,
      subject: order.subject,
      theme: order.theme,
      deadline: order.deadline,
      volume: order.volume,
      comment: order.comment,
      name: order.name,
      contactType: order.contact_type,
      phone: order.phone,
      telegram: order.telegram,
      file: order.file,
      status: order.status,
      sections: order.sections,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }))

    return {
      success: true,
      orders: transformedOrders
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch orders'
    })
  }
})
