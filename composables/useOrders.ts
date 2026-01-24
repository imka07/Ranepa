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

export const useOrders = () => {
  const { user } = useAuth()
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Флаг, чтобы предотвратить множественные загрузки
  let isFetched = false

  // Загружаем все заказы из API
  const fetchOrders = async (force = false) => {
    // Предотвращаем повторную загрузку, если уже загружено
    if (isFetched && !force) {
      console.log('🚫 Заказы уже загружены, пропускаю повторный запрос')
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🚀 Загрузка заказов из API...')
      const response = await $fetch<{ success: boolean; orders: Order[] }>('/api/orders')
      
      if (response.success) {
        orders.value = response.orders
        isFetched = true
        console.log(`✅ Заказы загружены из API: ${orders.value.length} шт.`)
      }
    } catch (err) {
      console.error('❌ Ошибка загрузки заказов:', err)
      error.value = 'Не удалось загрузить заказы'
      orders.value = []
    } finally {
      loading.value = false
    }
  }

  // Создаем новый заказ
  const createOrder = async (orderData: any) => {
    loading.value = true
    error.value = null
    
    try {
      const userId = user.value?.id || 'guest'
      const userName = user.value?.name || orderData.name
      const userEmail = user.value?.email || 'guest@mail.com'
      
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
        
        // НЕ добавляем заказ локально - пусть API будет единственным источником истины
        // orders.value.unshift(response.order) <- Убрали, чтобы избежать дубликатов
        
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

  // Получаем заказы пользователя
  const getUserOrders = (userId: string) => {
    console.log('🔍 Ищу заказы для userId:', userId)
    const userOrders = orders.value.filter(o => {
      console.log(`  Проверяю заказ ${o.id}: userId=${o.userId} (ищу ${userId})`)
      return o.userId === userId
    })
    console.log('📋 Найдено заказов:', userOrders.length)
    return userOrders
  }

  // Получаем все заказы (для админа)
  const getAllOrders = () => {
    return orders.value
  }

  // Обновляем статус заказа
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ success: boolean; order: Order }>(`/api/orders/${orderId}`, {
        method: 'PATCH',
        body: { status }
      })
      
      if (response.success && response.order) {
        // Обновляем заказ в локальном состоянии
        const index = orders.value.findIndex(o => o.id === orderId)
        if (index !== -1) {
          orders.value[index] = response.order
        }
        console.log('✅ Статус заказа обновлен:', orderId, status)
      }
    } catch (err) {
      console.error('❌ Ошибка обновления статуса:', err)
      error.value = 'Не удалось обновить статус заказа'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Обновляем статус раздела
  const updateSectionStatus = async (orderId: string, sectionId: string, completed: boolean) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ success: boolean; order: Order }>(`/api/orders/${orderId}`, {
        method: 'PATCH',
        body: { sectionId, completed }
      })
      
      if (response.success && response.order) {
        // Обновляем заказ в локальном состоянии
        const index = orders.value.findIndex(o => o.id === orderId)
        if (index !== -1) {
          orders.value[index] = response.order
        }
        console.log('✅ Статус раздела обновлен:', orderId, sectionId, completed)
      }
    } catch (err) {
      console.error('❌ Ошибка обновления статуса раздела:', err)
      error.value = 'Не удалось обновить статус раздела'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Удаляем заказ (только для админа)
  const deleteOrder = async (orderId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ success: boolean }>(`/api/orders/${orderId}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        // Удаляем заказ из локального состояния
        const index = orders.value.findIndex(o => o.id === orderId)
        if (index !== -1) {
          orders.value.splice(index, 1)
        }
        console.log('🗑️ Заказ удален:', orderId)
        return true
      }
      return false
    } catch (err) {
      console.error('❌ Ошибка удаления заказа:', err)
      error.value = 'Не удалось удалить заказ'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Получаем один заказ по ID
  const getOrder = (orderId: string) => {
    return orders.value.find(o => o.id === orderId)
  }

  // Вычисляем прогресс выполнения заказа
  const getOrderProgress = (orderId: string): number => {
    const order = orders.value.find(o => o.id === orderId)
    if (!order) return 0
    
    const completedSections = order.sections.filter(s => s.completed).length
    return Math.round((completedSections / order.sections.length) * 100)
  }

  // Инициализация: загружаем заказы при монтировании
  onMounted(() => {
    console.log('🎭 onMounted: Запуск загрузки заказов')
    fetchOrders()
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
