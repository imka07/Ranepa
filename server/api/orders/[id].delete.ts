import { getSupabaseClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Order ID is required'
    })
  }

  try {
    const supabase = getSupabaseClient()
    
    // Удаляем заказ
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete order'
      })
    }

    return {
      success: true,
      message: 'Order deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting order:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete order'
    })
  }
})
