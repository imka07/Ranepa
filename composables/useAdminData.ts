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
  // Mock данные заказов
  const orders = ref<Order[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Иван Петров',
      subject: 'Решение по математике',
      description: 'Контрольная работа по алгебре',
      status: 'в работе',
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-16T08:30:00Z'
    },

    {
      id: '2',
      userId: '2',
      userName: 'Мария Сидорова',
      subject: 'Реферат по истории',
      description: 'История России XX век',
      status: 'в работе',
      createdAt: '2026-01-14T15:00:00Z',
      updatedAt: '2026-01-15T18:00:00Z'
    },
    {
      id: '3',
      userId: '3',
      userName: 'Алексей Иванов',
      subject: 'Программирование на Python',
      description: 'Написание приложения',
      status: 'в работе',
      createdAt: '2026-01-16T12:00:00Z',
      updatedAt: '2026-01-16T12:15:00Z'
    },
    {
      id: '4',
      userId: '4',
      userName: 'Алексей',
      subject: 'Программирование на soso',
      description: 'Написание приложения',
      status: 'в работе',
      createdAt: '2026-01-16T12:00:00Z',
      updatedAt: '2026-01-16T12:15:00Z'
    }
    
  ])

  // Mock данные пользователей
  const users = ref<AdminUser[]>([
    {
      id: '1',
      name: 'Иван Петров',
      email: 'ivan@mail.com',
      phone: '+7 900 111-11-11',
      role: 'user',
      status: 'активен',
      createdAt: '2026-01-10T10:00:00Z'
    },
    {
      id: '2',
      name: 'Мария Сидорова',
      email: 'maria@mail.com',
      phone: '+7 900 222-22-22',
      role: 'user',
      status: 'активен',
      createdAt: '2026-01-12T14:00:00Z'
    },
    {
      id: '3',
      name: 'Алексей Иванов',
      email: 'alex@mail.com',
      phone: '+7 900 333-33-33',
      role: 'user',
      status: 'активен',
      createdAt: '2026-01-15T09:00:00Z'
    }
  ])

  // Mock данные услуг
  const services = ref<Service[]>([
    {
      id: '1',
      name: 'Решение задач',
      description: 'Помощь в решении математических задач',
      price: 100,
      category: 'Математика',
      isActive: true
    },
    {
      id: '2',
      name: 'Написание рефератов',
      description: 'Качественные рефераты на любые темы',
      price: 300,
      category: 'Гуманитарные науки',
      isActive: true
    },
    {
      id: '3',
      name: 'Помощь с программированием',
      description: 'Написание и отладка программного кода',
      price: 500,
      category: 'IT',
      isActive: true
    },
    {
      id: '4',
      name: 'Подготовка к ЕГЭ',
      description: 'Интенсивная подготовка к единому государственному экзамену',
      price: 200,
      category: 'Образование',
      isActive: false
    }
  ])

  // Mock данные сообщений
  const messages = ref<Message[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Иван Петров',
      email: 'ivan@mail.com',
      subject: 'Вопрос о стоимости',
      text: 'Какова стоимость написания реферата на 20 страниц?',
      status: 'новое',
      createdAt: '2026-01-16T11:30:00Z'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Мария Сидорова',
      email: 'maria@mail.com',
      subject: 'Спасибо за помощь!',
      text: 'Спасибо за качественное выполнение работы!',
      status: 'прочитано',
      createdAt: '2026-01-15T16:00:00Z'
    }
  ])

  // Mock данные контента
  const contentBlocks = ref<ContentBlock[]>([
    {
      id: '1',
      type: 'text',
      title: 'Заголовок главной страницы',
      content: 'Добро пожаловать на Reshala - портал помощи студентам',
      page: 'index',
      order: 1,
      isActive: true
    },
    {
      id: '2',
      type: 'section',
      title: 'Наши услуги',
      content: 'Мы предоставляем полный спектр услуг для студентов',
      page: 'index',
      order: 2,
      isActive: true
    }
  ])

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

  // Управление пользователями
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
