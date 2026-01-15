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

  // Получаем одно заказ по ID
  const getOrder = (orderId: string) => {
    return orders.value.find(o => o.id === orderId)
  }

  // Пример: добавим тестовые данные при первом заруске
  const addDemoData = () => {
    if (orders.value.length === 0 && process.client) {
      orders.value = [
        {
          id: 'order-001',
          workType: 'essay',
          subject: 'История',
          theme: 'Пренравлютельная Октябрьская революция',
          deadline: '2026-02-15',
          volume: '10',
          status: 'in-progress',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          messages: [
            {
              id: 'msg-1',
              sender: 'manager',
              text: 'Запрос получен. Менеджер скоро с вами свяжется.',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'msg-2',
              sender: 'manager',
              text: 'Приняя ваш заказ. Начинаю работу. Эксперт работает на ускоренном режиме.',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'msg-3',
              sender: 'user',
              text: 'Как прогресс? Моно?',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'msg-4',
              sender: 'manager',
              text: 'Ныне активно пишем! Осталось 3-4 страницы. Сборка на находимся в стадии временных трат.',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        },
        {
          id: 'order-002',
          workType: 'coursework',
          subject: 'Высшая математика',
          theme: 'Кратные интегралы',
          deadline: '2026-03-01',
          volume: '25',
          status: 'completed',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          messages: [
            {
              id: 'msg-5',
              sender: 'manager',
              text: 'Получена версия 1.0',
              timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'msg-6',
              sender: 'user',
              text: 'Можно травы у третьего тома?',
              timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'msg-7',
              sender: 'manager',
              text: 'Конечно! Отправляю травы дня черес 1-2 дня.',
              timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          file: {
            name: 'Coursework_Final.pdf',
            url: '/files/coursework.pdf'
          }
        }
      ]
      saveOrders()
    }
  }

  onMounted(() => {
    initOrders()
    addDemoData()
  })

  return {
    orders,
    createOrder,
    addMessage,
    updateOrderStatus,
    getOrder
  }
}
