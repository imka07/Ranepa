export interface Order {
  id: string
  workType: string
  subject: string
  theme: string
  deadline: string
  volume: string
  status: 'pending' | 'in-progress' | 'completed' | 'delivered'
  createdAt: string
  messages: Message[]
  file?: { name: string; url: string }
}

export interface Message {
  id: string
  sender: 'user' | 'manager'
  text: string
  timestamp: string
}

export const useOrders = () => {
  const orders = ref<Order[]>([])

  // Загружаем заказы из localStorage
  const initOrders = () => {
    if (process.client) {
      const stored = localStorage.getItem('orders')
      if (stored) {
        orders.value = JSON.parse(stored)
      }
    }
  }

  // Сохраняем заказ в localStorage
  const saveOrders = () => {
    if (process.client) {
      localStorage.setItem('orders', JSON.stringify(orders.value))
    }
  }

  // Создаем новый заказ
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'messages' | 'status'>) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'manager',
          text: 'Запрос получен. Менеджер скоро с вами свяжется.',
          timestamp: new Date().toISOString()
        }
      ]
    }
    orders.value.push(newOrder)
    saveOrders()
    return newOrder
  }

  // Добавляем сообщение в чат
  const addMessage = (orderId: string, sender: 'user' | 'manager', text: string) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender,
        text,
        timestamp: new Date().toISOString()
      }
      order.messages.push(newMessage)
      saveOrders()
      return newMessage
    }
  }

  // Обновляем статус заказа
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
      saveOrders()
    }
  }

  // Получаем один заказ по ID
  const getOrder = (orderId: string) => {
    return orders.value.find(o => o.id === orderId)
  }

  onMounted(() => {
    initOrders()
  })

  return {
    orders,
    createOrder,
    addMessage,
    updateOrderStatus,
    getOrder
  }
}
