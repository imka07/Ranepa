# 📚 Примеры использования Admin API

## Composables для администраторов

### useAdmin - Автентификация

```typescript
// pages/admin/login.vue
import { useAdmin } from '~/composables/useAdmin'

const { adminUser, isAdmin, adminLogin, adminLogout } = useAdmin()

// Вход
const handleLogin = () => {
  const success = adminLogin('admin@reshala.com', 'admin123')
  if (success) {
    // Перенаправление
    router.push('/admin')
  }
}

// Выход
const handleLogout = () => {
  adminLogout()
  router.push('/admin/login')
}
```

### useAdminData - Менеджмент данных

#### Обработка заказов

```typescript
import { useAdminData } from '~/composables/useAdminData'

const {
  orders,
  updateOrderStatus,
  deleteOrder,
  getStats
} = useAdminData()

// Получить все заказы
 nconst allOrders = orders.value
// [
//   {
//     id: '1',
//     userId: '1',
//     userName: 'Иван Петров',
//     subject: 'Решение задач',
//     status: 'в работе',
//     price: 500,
//     ...
//   }
// ]

// Обновить статус заказа
updateOrderStatus('1', 'готов')

// Удалить заказ
deleteOrder('1')
```

#### Управление пользователями

```typescript
const {
  users,
  blockUser,
  unblockUser,
  deleteUser
} = useAdminData()

// Получить всех пользователей
const allUsers = users.value

// Блокировать пользователя
blockUser('123')

// Разблокировать
unblockUser('123')

// Удалить пользователя
deleteUser('123')
```

#### Управление Услугами

```typescript
const {
  services,
  addService,
  updateService,
  deleteService
} = useAdminData()

// Получить все услуги
const allServices = services.value

// Добавить новую услугу
const newService = addService({
  name: 'Быстрая факторизация',
  description: 'Помощь в разложении выражений',
  price: 150,
  category: 'Математика',
  isActive: true
})

// Обновить услугу
updateService('service-id', {
  price: 200,
  isActive: false
})

// Удалить услугу
deleteService('service-id')
```

#### Обработка сообщений

```typescript
const {
  messages,
  markMessageAsRead,
  markMessageAsAnswered,
  deleteMessage
} = useAdminData()

// Получить все сообщения
const allMessages = messages.value

// Отметить как прочитанно
markMessageAsRead('msg-1')

// Отметить как ответленно
markMessageAsAnswered('msg-1')

// Удалить сообщение
deleteMessage('msg-1')
```

#### Управление контентом

```typescript
const {
  contentBlocks,
  addContentBlock,
  updateContentBlock,
  deleteContentBlock
} = useAdminData()

// Получить все блоки
const allBlocks = contentBlocks.value

// Добавить контент
const newBlock = addContentBlock({
  type: 'text',
  title: 'Приветственное слово',
  content: 'Витам на Reshala',
  page: 'index',
  order: 1,
  isActive: true
})

// Обновить контент
updateContentBlock('block-id', {
  content: 'Обновленные текст',
  isActive: false
})

// Удалить контент
deleteContentBlock('block-id')
```

#### Получение статистики

```typescript
const { getStats } = useAdminData()

const stats = getStats()
// {
//   totalOrders: 3,
//   ordersInProgress: 1,
//   totalUsers: 3,
//   blockedUsers: 0,
//   totalServices: 4,
//   totalMessages: 2,
//   unreadMessages: 1
// }

// Обновляются каждые 5 секунд
setInterval(() => {
  stats.value = getStats()
}, 5000)
```

## Vue Template Примеры

### Обработка заказов

```vue
<template>
  <div>
    <div v-for="order in orders" :key="order.id">
      <h3>{{ order.subject }}</h3>
      <p>{{ order.description }}</p>
      <span>{{ order.status }}</span>
      
      <select @change="updateOrderStatus(order.id, $event.target.value)">
        <option value="принят">Принят</option>
        <option value="в работе">В работе</option>
        <option value="готов">Готов</option>
        <option value="отменен">Отменен</option>
      </select>
      
      <button @click="deleteOrder(order.id)">Удалить</button>
    </div>
  </div>
</template>
```

### Отображение статистики

```vue
<template>
  <div class="stats-grid">
    <div class="stat-card">
      <span>Всего заказов</span>
      <h2>{{ stats.totalOrders }}</h2>
      <p>В обработке: {{ stats.ordersInProgress }}</p>
    </div>
    
    <div class="stat-card">
      <span>Пользователи</span>
      <h2>{{ stats.totalUsers }}</h2>
      <p>Блокировано: {{ stats.blockedUsers }}</p>
    </div>
    
    <div class="stat-card">
      <span>Услуги</span>
      <h2>{{ stats.totalServices }}</h2>
    </div>
    
    <div class="stat-card">
      <span>Сообщения</span>
      <h2>{{ stats.totalMessages }}</h2>
      <p>Непрочитанных: {{ stats.unreadMessages }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getStats } = useAdminData()
const stats = ref(getStats())
</script>
```

## Фильтрация и Пагинация (для дополнительного наработанного кода)

```typescript
// Фильтрация заказов по статусу
const filteredOrders = computed(() => {
  return orders.value.filter(o => o.status === 'в работе')
})

// Пагинация
const pageSize = 10
const currentPage = ref(1)
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return orders.value.slice(start, end)
})
const totalPages = computed(() => Math.ceil(orders.value.length / pageSize))
```

## Оформление Нотификаций

```typescript
// Успех
const showSuccess = () => {
  alert('Операция выполнена успешно!')
}

// Ошибка
const showError = (message: string) => {
  alert(`Ошибка: ${message}`)
}

// Подтверждение
const confirmed = confirm('Вы уверены?')
if (confirmed) {
  // Выполнить действие
}
```

## Типы данных TypeScript

```typescript
import type {
  Order,
  AdminUser,
  Service,
  Message,
  ContentBlock
} from '~/composables/useAdminData'

// Относительно новых заказов
const newOrder: Omit<Order, 'id'> = {
  userId: '4',
  userName: 'Pavel',
  subject: 'Новый заказ',
  description: 'Описание',
  status: 'принят',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  price: 1000
}
```

---

Обратитесь к ADMIN_PANEL_GUIDE.md для архитектуры и дизайнов
