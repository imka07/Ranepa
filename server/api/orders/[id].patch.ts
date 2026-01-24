import { getSupabaseClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Order ID is required'
    })
  }

  const body = await readBody(event)
  
  try {
    const supabase = getSupabaseClient()
    
    // Подготавливаем данные для обновления
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Обновляем статус, если передан
    if (body.status) {
      updateData.status = body.status
    }

    // Обновляем разделы, если переданы
    if (body.sections) {
      updateData.sections = body.sections
    }

    // Обновляем конкретный раздел, если передан sectionId
    if (body.sectionId !== undefined && body.completed !== undefined) {
      // Сначала получаем текущие разделы
      const { data: currentOrder, error: fetchError } = await supabase
        .from('orders')
        .select('sections')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Order not found'
        })
      }

      // Обновляем конкретный раздел
      const updatedSections = currentOrder.sections.map((section: any) => {
        if (section.id === body.sectionId) {
          return { ...section, completed: body.completed }
        }
        return section
      })

      updateData.sections = updatedSections
    }

    // Выполняем обновление
    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update order'
      })
    }

    // Преобразуем snake_case в camelCase
    const transformedOrder = {
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
    }

    return {
      success: true,
      order: transformedOrder
    }
  } catch (error) {
    console.error('Error updating order:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update order'
    })
  }
})
