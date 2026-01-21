export interface OrderSection {
  id: 'plan' | 'chapter1' | 'chapter2' | 'presentation'
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
  name: string // Имя из формы (может отличаться от userName)
  contactType: 'phone' | 'telegram'
  phone: string
  telegram: string
  file?: { name: string; url: string }
  status: 'в работе' | 'решен' | 'отменен'
  sections: OrderSection[] // Разделы работы
  createdAt: string
  updatedAt: string
  messages: Message[]
}

export interface Message {
  id: string
  sender: 'user' | 'manager'
  text: string
  timestamp: string
}

// Фиксированные разделы для всех заказов
const DEFAULT_SECTIONS: OrderSection[] = [
  { id: 'plan', name: 'План', completed: false },
  { id: 'chapter1', name: '1 глава', completed: false },
  { id: 'chapter2', name: '2 глава', completed: false },
  { id: 'presentation', name: 'Преза', completed: false }
]

export const useOrders = () => {
  const orders = ref<Order[]>([])

  // Загружаем заказы из localStorage
  const initOrders = () => {
    if (process.client) {
      const stored = localStorage.getItem('orders')
      if (stored) {
        try {
          orders.value = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse orders from localStorage', e)
          orders.value = []
        }
      }
    }
  }

  // Сохраняем заказы в localStorage
  const saveOrders = () => {
    if (process.client) {
      localStorage.setItem('orders', JSON.stringify(orders.value))
    }
  }

  // Создаем новый заказ
  const createOrder = (orderData: any) => {
    const { user } = useAuth()
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.value?.id || 'unknown',
      userName: user.value?.name || 'Unknown',
      userEmail: user.value?.email || 'unknown@mail.com',
      workType: orderData.workType,
      subject: orderData.subject,
      theme: orderData.theme,
      deadline: orderData.deadline,
      volume: orderData.volume,
      comment: orderData.comment,
      name: orderData.name,
      contactType: orderData.contactType,
      phone: orderData.phone,
      telegram: orderData.telegram,
      file: orderData.file,
      status: 'в работе',
      sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)), // Глубокая копия
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

  // Получаем заказы конкретного пользователя
  const getUserOrders = (userId: string) => {
    return orders.value.filter(o => o.userId === userId)
  }

  // Получаем все заказы (для админа)
  const getAllOrders = () => {
    return orders.value
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
      order.updatedAt = new Date().toISOString()
      saveOrders()
      return newMessage
    }
  }

  // Обновляем статус заказа
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
      order.updatedAt = new Date().toISOString()
      saveOrders()
    }
  }

  // Обновляем статус раздела
  const updateSectionStatus = (orderId: string, sectionId: string, completed: boolean) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      const section = order.sections.find(s => s.id === sectionId)
      if (section) {
        section.completed = completed
        order.updatedAt = new Date().toISOString()
        saveOrders()
      }
    }
  }

  // Получаем один заказ по ID
  const getOrder = (orderId: string) => {
    return orders.value.find(o => o.id === orderId)
  }

  // Вычисляем процент готовности заказа
  const getOrderProgress = (orderId: string): number => {
    const order = orders.value.find(o => o.id === orderId)
    if (!order) return 0
    
    const completedSections = order.sections.filter(s => s.completed).length
    return Math.round((completedSections / order.sections.length) * 100)
  }

  onMounted(() => {
    initOrders()
  })

  return {
    orders,
    createOrder,
    getUserOrders,
    getAllOrders,
    addMessage,
    updateOrderStatus,
    updateSectionStatus,
    getOrder,
    getOrderProgress
  }
}
