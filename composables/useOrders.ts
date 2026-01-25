export interface OrderSection {
  id: 'plan' | 'chapter1' | 'chapter2' | 'chapter3' | 'presentation'
  name: string
  completed: boolean
}

export interface Order {
  id: string
  userId: string // ID пользователя, создавшего заказ
  userName: string // Имя пользователя
  userEmail: string // Email пользователя
  workType: string
  subject: string
  theme: string
  deadline: string
  volume: string
  comment: string
  name: string // Имя из формы
  contactType: 'phone' | 'telegram'
  phone: string
  telegram: string
  file?: { name: string; url: string }
  status: 'в работе' | 'решен' | 'отменен'
  sections: OrderSection[] // Разделы работы
  createdAt: string
  updatedAt: string
}

// Кэш для хранения времени последней загрузки
let lastFetchTime = 0
const CACHE_DURATION = 30000 // 30 секунд кэш

export const useOrders = () => {
  const { user } = useAuth()
  
  // Глобальное состояние для кэширования - внутри функции!
  const orders = useState<Order[]>('global-orders', () => [])
  const loading = useState<boolean>('global-orders-loading', () => false)
  const error = useState<string | null>('global-orders-error', () => null)

  // Загружаем все заказы из API с кэшированием
  const fetchOrders = async (force = false) => {
    const now = Date.now()
    
    // Если данные свежие и не форсируем обновление - используем кэш
    if (!force && orders.value.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('✨ Используем кэшированные заказы')
      return
    }
    
    // Если уже грузим - не делаем повторный запрос
    if (loading.value) {
      console.log('⏳ Уже идет загрузка, ждем...')
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🚀 Загрузка заказов из API...')
      const response = await $fetch<{ success: boolean; orders: Order[] }>('/api/orders')
      
      if (response.success) {
        orders.value = response.orders
        lastFetchTime = now
        console.log(`✅ Заказы загружены: ${orders.value.length} шт.`)
      }
    } catch (err) {
      console.error('❌ Ошибка загрузки заказов:', err)
      error.value = 'Не удалось загрузить заказы'
    } finally {
      loading.value = false
    }
  }

  // Создаем новый заказ
  const createOrder = async (orderData: any) => {
    loading.value = true
    error.value = null
    
    try {
      const userId = user.value?.id || null
      const userName = user.value?.name || orderData.name
      const userEmail = user.value?.email || orderData.contactType === 'phone' ? orderData.phone : orderData.telegram
      
      console.log('👤 Создание заказа для пользователя:', { userId, userName, userEmail })
      
      const response = await $fetch<{ success: boolean; order: Order }>('/api/orders', {
        method: 'POST',
        body: {
          ...orderData,
          userId,
          userName,
          userEmail
        }
      })
      
      if (response.success && response.order) {
        console.log('✅ Новый заказ создан:', response.order)
        
        // Оптимистичное обновление - добавляем заказ сразу в кэш
        orders.value.unshift(response.order)
        lastFetchTime = Date.now()
        
        return response.order
      }
    } catch (err) {
      console.error('❌ Ошибка создания заказа:', err)
      error.value = 'Не удалось создать заказ'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Получаем заказы пользователя (фильтруем из кэша)
  const getUserOrders = (userId: string) => {
    return orders.value.filter(o => o.userId === userId)
  }

  // Получаем все заказы (для админа)
  const getAllOrders = () => {
    return orders.value
  }

  // Обновляем статус заказа
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    // Оптимистичное обновление
    const index = orders.value.findIndex(o => o.id === orderId)
    const oldStatus = index !== -1 ? orders.value[index].status : null
    
    if (index !== -1) {
      orders.value[index].status = status
    }
    
    try {
      const response = await $fetch<{ success: boolean; order: Order }>(`/api/orders/${orderId}`, {
        method: 'PATCH',
        body: { status }
      })
      
      if (response.success && response.order) {
        // Обновляем с данными с сервера
        if (index !== -1) {
          orders.value[index] = response.order
        }
        console.log('✅ Статус заказа обновлен:', orderId, status)
      }
    } catch (err) {
      console.error('❌ Ошибка обновления статуса:', err)
      // Откатываем изменения
      if (index !== -1 && oldStatus) {
        orders.value[index].status = oldStatus
      }
      error.value = 'Не удалось обновить статус заказа'
      throw err
    }
  }

  // Обновляем статус раздела
  const updateSectionStatus = async (orderId: string, sectionId: string, completed: boolean) => {
    // Оптимистичное обновление
    const orderIndex = orders.value.findIndex(o => o.id === orderId)
    let oldSectionStatus: boolean | null = null
    
    if (orderIndex !== -1) {
      const sectionIndex = orders.value[orderIndex].sections.findIndex(s => s.id === sectionId)
      if (sectionIndex !== -1) {
        oldSectionStatus = orders.value[orderIndex].sections[sectionIndex].completed
        orders.value[orderIndex].sections[sectionIndex].completed = completed
      }
    }
    
    try {
      const response = await $fetch<{ success: boolean; order: Order }>(`/api/orders/${orderId}`, {
        method: 'PATCH',
        body: { sectionId, completed }
      })
      
      if (response.success && response.order) {
        // Обновляем с данными с сервера
        if (orderIndex !== -1) {
          orders.value[orderIndex] = response.order
        }
        console.log('✅ Статус раздела обновлен:', orderId, sectionId, completed)
      }
    } catch (err) {
      console.error('❌ Ошибка обновления статуса раздела:', err)
      // Откатываем изменения
      if (orderIndex !== -1 && oldSectionStatus !== null) {
        const sectionIndex = orders.value[orderIndex].sections.findIndex(s => s.id === sectionId)
        if (sectionIndex !== -1) {
          orders.value[orderIndex].sections[sectionIndex].completed = oldSectionStatus
        }
      }
      error.value = 'Не удалось обновить статус раздела'
      throw err
    }
  }

  // Удаляем заказ (только для админа)
  const deleteOrder = async (orderId: string) => {
    // Оптимистичное удаление
    const index = orders.value.findIndex(o => o.id === orderId)
    const deletedOrder = index !== -1 ? orders.value[index] : null
    
    if (index !== -1) {
      orders.value.splice(index, 1)
    }
    
    try {
      const response = await $fetch<{ success: boolean }>(`/api/orders/${orderId}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        console.log('🗑️ Заказ удален:', orderId)
        return true
      }
      return false
    } catch (err) {
      console.error('❌ Ошибка удаления заказа:', err)
      // Восстанавливаем удаленный заказ
      if (deletedOrder && index !== -1) {
        orders.value.splice(index, 0, deletedOrder)
      }
      error.value = 'Не удалось удалить заказ'
      throw err
    }
  }

  // Получаем один заказ по ID (из кэша)
  const getOrder = (orderId: string) => {
    return orders.value.find(o => o.id === orderId)
  }

  // Вычисляем прогресс выполнения заказа
  const getOrderProgress = (orderId: string): number => {
    const order = orders.value.find(o => o.id === orderId)
    if (!order || !order.sections) return 0
    
    const completedSections = order.sections.filter(s => s.completed).length
    return Math.round((completedSections / order.sections.length) * 100)
  }

  // Инициализация: загружаем заказы при монтировании только если кэш пустой
  onMounted(() => {
    if (orders.value.length === 0) {
      console.log('🎭 onMounted: Первая загрузка заказов')
      fetchOrders()
    } else {
      console.log('✨ onMounted: Используем кэшированные данные')
    }
  })

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    updateSectionStatus,
    deleteOrder,
    getOrder,
    getOrderProgress
  }
}
