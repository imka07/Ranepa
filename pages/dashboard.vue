<template>
  <div>
    <!-- Header -->
    <div class="bg-slate-800 border-b border-white/10 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">{{ user?.name || 'Личный кабинет' }}</h1>
          <p class="text-gray-400 text-sm">{{ user?.email }}</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink
            to="/"
            class="px-4 py-2 text-gray-200 border border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5 transition font-medium text-sm"
          >
            ← Главная
          </NuxtLink>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition font-medium text-sm"
          >
            Выход
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="bg-slate-800/50 border-b border-white/10 sticky top-16 z-40">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex gap-1 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'px-3 py-3 font-medium transition border-b-2 whitespace-nowrap text-sm',
              activeTab === tab.id
                ? 'border-blue-600 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Orders History -->
      <div v-if="activeTab === 'orders'" class="space-y-4">
        <h2 class="text-xl font-bold text-white mb-6">История заказов</h2>
        <div v-if="orders.length === 0" class="text-center py-12 bg-slate-800/30 rounded-lg border border-white/5">
          <p class="text-gray-400 mb-4">У вас еще нет заказов</p>
          <NuxtLink
            to="/"
            class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition text-sm font-medium"
          >
            Создать заказ
          </NuxtLink>
        </div>
        <div v-for="order in orders" :key="order.id" class="bg-slate-800 border border-white/10 rounded-lg p-5 cursor-pointer hover:border-white/20 transition" @click="selectedOrder = order; activeTab = 'chat'">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-white">{{ order.subject }}: {{ order.theme }}</h3>
              <p class="text-gray-400 text-sm">Заказ #{{ order.id }}</p>
            </div>
            <span :class="['px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ml-4', statusColor(order.status)]">
              {{ statusLabel(order.status) }}
            </span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
            <div>
              <p class="text-xs text-gray-500 mb-1">Тип</p>
              <p class="text-white">{{ getWorkTypeLabel(order.workType) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Объём</p>
              <p class="text-white">{{ order.volume }} стр.</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Дедлайн</p>
              <p class="text-white">{{ formatDate(order.deadline) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Сообщений</p>
              <p class="text-white">{{ order.messages.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat -->
      <div v-if="activeTab === 'chat'" class="space-y-4">
        <div v-if="!selectedOrder" class="text-center py-12 bg-slate-800/30 rounded-lg border border-white/5 text-gray-400">
          Выберите заказ для отправки сообщений
        </div>
        <div v-else class="bg-slate-800 border border-white/10 rounded-lg overflow-hidden flex flex-col h-[500px]">
          <!-- Order Info -->
          <div class="p-4 border-b border-white/10 bg-slate-700/50">
            <h3 class="text-lg font-semibold text-white">{{ selectedOrder.subject }}: {{ selectedOrder.theme }}</h3>
            <p class="text-gray-400 text-sm">Заказ #{{ selectedOrder.id }}</p>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <div
              v-for="msg in selectedOrder.messages"
              :key="msg.id"
              :class="['flex', msg.sender === 'user' ? 'justify-end' : 'justify-start']"
            >
              <div
                :class="[
                  'max-w-xs px-4 py-2 rounded-lg text-sm',
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-100'
                ]"
              >
                <p>{{ msg.text }}</p>
                <p :class="['text-xs mt-1', msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400']">
                  {{ formatTime(msg.timestamp) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="p-4 border-t border-white/10 bg-slate-700/50">
            <div class="flex gap-2">
              <input
                v-model="messageText"
                type="text"
                placeholder="Напишите сообщение..."
                class="flex-1 px-3 py-2 bg-slate-800 text-white border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm"
                @keyup.enter="sendMessage"
              />
              <button
                @click="sendMessage"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition text-sm font-medium"
              >
                Отп
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div v-if="activeTab === 'reviews'" class="space-y-4">
        <h2 class="text-xl font-bold text-white mb-6">Мои отзывы</h2>
        <div class="text-center py-12 bg-slate-800/30 rounded-lg border border-white/5 text-gray-400">
          <p class="mb-4">У вас еще нет отзывов</p>
          <NuxtLink
            to="/reviews"
            class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition text-sm font-medium"
          >
            Оставить отзыв
          </NuxtLink>
        </div>
      </div>

      <!-- FAQ -->
      <div v-if="activeTab === 'faq'" class="space-y-3">
        <h2 class="text-xl font-bold text-white mb-6">Часто задаваемые вопросы</h2>
        <div class="space-y-2">
          <div
            v-for="(item, idx) in faqItems"
            :key="idx"
            class="bg-slate-800 border border-white/10 rounded-lg overflow-hidden"
          >
            <button
              @click="expandedFaq = expandedFaq === idx ? null : idx"
              class="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-700/50 transition"
            >
              <span class="text-white font-medium text-sm text-left">{{ item.q }}</span>
              <Icon
                name="mdi:chevron-down"
                :class="['w-5 h-5 text-gray-400 flex-shrink-0 transition duration-300', expandedFaq === idx && 'rotate-180']"
              />
            </button>
            <Transition
              enter-active-class="transition duration-200"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-96 opacity-100"
              leave-active-class="transition duration-200"
              leave-from-class="max-h-96 opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <div
                v-if="expandedFaq === idx"
                class="px-4 py-3 border-t border-white/10 text-gray-300 bg-slate-700/30 text-sm leading-relaxed"
              >
                {{ item.a }}
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div v-if="activeTab === 'settings'" class="space-y-4">
        <h2 class="text-xl font-bold text-white mb-6">Настройки</h2>
        <div class="bg-slate-800 border border-white/10 rounded-lg p-5 space-y-4 max-w-md">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Имя</label>
            <input
              :value="user?.name"
              disabled
              class="w-full px-4 py-2 bg-slate-700/50 text-gray-400 border border-white/10 rounded-lg cursor-not-allowed text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              :value="user?.email"
              disabled
              class="w-full px-4 py-2 bg-slate-700/50 text-gray-400 border border-white/10 rounded-lg cursor-not-allowed text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Телефон</label>
            <input
              :value="user?.phone"
              disabled
              class="w-full px-4 py-2 bg-slate-700/50 text-gray-400 border border-white/10 rounded-lg cursor-not-allowed text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user, logout } = useAuth()
const { orders, addMessage } = useOrders()

const activeTab = ref('orders')
const selectedOrder = ref(null)
const messageText = ref('')
const expandedFaq = ref<number | null>(null)

const tabs = [
  { id: 'orders', label: '📦 Заказы' },
  { id: 'chat', label: '💬 Чат' },
  { id: 'reviews', label: '⭐ Отзывы' },
  { id: 'faq', label: '❓ FAQ' },
  { id: 'settings', label: '⚙️ Настройки' }
]

const faqItems = [
  {
    q: 'Как долго выполняется заказ?',
    a: 'Время выполнения зависит от объема работы и дедлайна. Обычно мы выполняем работы от 1 до 14 дней. Все сроки согласуются с менеджером при оформлении заказа.'
  },
  {
    q: 'Какие способы оплаты вы принимаете?',
    a: 'Мы принимаем оплату через Яндекс.Касса, банковские карты и электронные кошельки. После оформления заказа вам будет отправлена ссылка на оплату.'
  },
  {
    q: 'Что делать, если я не доволен результатом?',
    a: 'Мы предоставляем бесплатные доработки в течение 7 дней после получения работы. Если результат вас не устроит, мы вернем 50% от суммы заказа.'
  },
  {
    q: 'Могу ли я общаться напрямую с автором?',
    a: 'Все коммуникации проходят через менеджера для защиты данных обеих сторон. Однако вы можете оставлять комментарии в чате.'
  },
  {
    q: 'Можно ли заказать срочную работу?',
    a: 'Да, мы выполняем срочные заказы. За ускоренное выполнение взимается доп. сбор 20-50% от стоимости работы.'
  }
]

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU')
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Ожидание',
    'in-progress': 'В работе',
    completed: 'Завершено',
    delivered: 'Доставлено'
  }
  return labels[status] || status
}

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-gray-900/40 text-gray-300 border border-gray-700',
    'in-progress': 'bg-white/10 text-white border border-white/20',
    completed: 'bg-green-900/30 text-green-300 border border-green-900/50',
    delivered: 'bg-green-900/40 text-green-200 border border-green-800'
  }
  return colors[status] || 'bg-gray-900/30 text-gray-400'
}

const getWorkTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    essay: 'Реферат',
    coursework: 'Курсовая',
    diploma: 'Диплом',
    abstract: 'Абстракт',
    presentation: 'Презентация',
    solution: 'Решение задач',
    other: 'Другое'
  }
  return labels[type] || type
}

const sendMessage = () => {
  if (!messageText.value.trim() || !selectedOrder.value) return

  addMessage(selectedOrder.value.id, 'user', messageText.value)
  messageText.value = ''

  setTimeout(() => {
    addMessage(selectedOrder.value.id, 'manager', '✅ Сообщение получено!')
  }, 2000)
}

const handleLogout = () => {
  logout()
  router.push('/auth')
}

onMounted(() => {
  if (!user.value) {
    router.push('/auth')
  }
})
</script>
