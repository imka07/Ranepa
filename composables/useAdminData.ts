// Типы данных
export interface Order {
  id: string
  userId: string
  userName: string
  subject: string
  description: string
  status: 'в работе' | 'готов' | 'отменен'
  createdAt: string
  updatedAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'admin'
  status: 'активен' | 'заблокирован'
  createdAt: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  isActive: boolean
}

export interface Message {
  id: string
  userId: string
  userName: string
  email: string
  subject: string
  text: string
  status: 'новое' | 'прочитано' | 'ответлено'
  createdAt: string
}

export interface ContentBlock {
  id: string
  type: 'text' | 'image' | 'banner' | 'section'
  title: string
  content: string
  page: string
  order: number
  isActive: boolean
}

export const useAdminData = () => {
  // Пустые данные (без моков)
  const orders = ref<Order[]>([])
  const users = ref<AdminUser[]>([])
  const services = ref<Service[]>([])
  const messages = ref<Message[]>([])
  const contentBlocks = ref<ContentBlock[]>([])

  // Управление заказами
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = newStatus
      order.updatedAt = new Date().toISOString()
    }
  }

  const deleteOrder = (orderId: string) => {
    const index = orders.value.findIndex(o => o.id === orderId)
    if (index !== -1) {
      orders.value.splice(index, 1)
    }
  }

  // Управлепшие пользователями
  const blockUser = (userId: string) => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.status = 'заблокирован'
    }
  }

  const unblockUser = (userId: string) => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.status = 'активен'
    }
  }

  const deleteUser = (userId: string) => {
    const index = users.value.findIndex(u => u.id === userId)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }

  // Управление услугами
  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...service,
      id: Math.random().toString(36).substr(2, 9)
    }
    services.value.push(newService)
    return newService
  }

  const updateService = (serviceId: string, updates: Partial<Service>) => {
    const service = services.value.find(s => s.id === serviceId)
    if (service) {
      Object.assign(service, updates)
    }
  }

  const deleteService = (serviceId: string) => {
    const index = services.value.findIndex(s => s.id === serviceId)
    if (index !== -1) {
      services.value.splice(index, 1)
    }
  }

  // Управление сообщениями
  const markMessageAsRead = (messageId: string) => {
    const message = messages.value.find(m => m.id === messageId)
    if (message) {
      message.status = 'прочитано'
    }
  }

  const markMessageAsAnswered = (messageId: string) => {
    const message = messages.value.find(m => m.id === messageId)
    if (message) {
      message.status = 'ответлено'
    }
  }

  const deleteMessage = (messageId: string) => {
    const index = messages.value.findIndex(m => m.id === messageId)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
  }

  // Управление контентом
  const addContentBlock = (block: Omit<ContentBlock, 'id'>) => {
    const newBlock: ContentBlock = {
      ...block,
      id: Math.random().toString(36).substr(2, 9)
    }
    contentBlocks.value.push(newBlock)
    return newBlock
  }

  const updateContentBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    const block = contentBlocks.value.find(b => b.id === blockId)
    if (block) {
      Object.assign(block, updates)
    }
  }

  const deleteContentBlock = (blockId: string) => {
    const index = contentBlocks.value.findIndex(b => b.id === blockId)
    if (index !== -1) {
      contentBlocks.value.splice(index, 1)
    }
  }

  // Статистика
  const getStats = () => {
    return {
      totalOrders: orders.value.length,
      ordersInProgress: orders.value.filter(o => o.status === 'в работе').length,
      totalUsers: users.value.length,
      blockedUsers: users.value.filter(u => u.status === 'заблокирован').length,
      totalServices: services.value.length,
      totalMessages: messages.value.length,
      unreadMessages: messages.value.filter(m => m.status === 'новое').length
    }
  }

  return {
    // Данные
    orders,
    users,
    services,
    messages,
    contentBlocks,
    // Методы заказов
    updateOrderStatus,
    deleteOrder,
    // Методы пользователей
    blockUser,
    unblockUser,
    deleteUser,
    // Методы услуг
    addService,
    updateService,
    deleteService,
    // Методы сообщений
    markMessageAsRead,
    markMessageAsAnswered,
    deleteMessage,
    // Методы контента
    addContentBlock,
    updateContentBlock,
    deleteContentBlock,
    // Статистика
    getStats
  }
}
