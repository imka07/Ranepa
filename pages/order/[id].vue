<template>
  <div v-if="order" class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
    <!-- Header -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm mb-8">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/dashboard" class="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition font-medium">
          <Icon name="mdi:arrow-left" class="w-5 h-5" />
          На читате заказов
        </NuxtLink>
        <h1 class="text-2xl font-bold text-slate-800">Заказ #{{ order.id }}</h1>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Info -->
          <div class="bg-white border border-slate-200/50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded"></span>
              Основная информация
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-slate-500 font-medium mb-1">Предмет</p>
                <p class="text-slate-800 font-semibold">{{ order.subject }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 font-medium mb-1">Тема</p>
                <p class="text-slate-800 font-semibold">{{ order.theme }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 font-medium mb-1">Тип работы</p>
                <p class="text-slate-800 font-semibold">{{ getWorkTypeLabel(order.workType) }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 font-medium mb-1">Объём</p>
                <p class="text-slate-800 font-semibold">{{ order.volume }} страниц</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 font-medium mb-1">Дедлайн</p>
                <p class="text-slate-800 font-semibold">{{ formatDate(order.deadline) }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 font-medium mb-1">Статус</p>
                <span :class="['inline-block px-2 py-1 rounded-full text-xs font-semibold', statusColor(order.status)]">
                  {{ statusLabel(order.status) }}
                </span>
              </div>
            </div>
            <div v-if="order.comment" class="mt-4 pt-4 border-t border-slate-200">
              <p class="text-xs text-slate-500 font-medium mb-2">Комментарий</p>
              <p class="text-slate-700 text-sm leading-relaxed">{{ order.comment }}</p>
            </div>
          </div>

          <!-- Progress & Sections -->
          <div class="bg-white border border-slate-200/50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded"></span>
              Прогресс выполнения
            </h2>
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-semibold text-slate-700">{{ progress }}%</p>
              </div>
              <div class="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                  :style="{ width: progress + '%' }"
                ></div>
              </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                v-for="section in order.sections"
                :key="section.id"
                class="p-3 rounded-lg border transition-all duration-200 text-center"
                :class="section.completed
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-slate-50 border-slate-300 text-slate-700'
                "
              >
                <div class="font-semibold text-sm">{{ section.name }}</div>
                <div class="text-xs mt-1" :class="section.completed ? 'text-green-600' : 'text-slate-500'">
                  {{ section.completed ? '✓ Готово' : 'В процессе' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Section -->
          <OrderChat
            :order-id="order.id"
            :messages="order.messages || []"
            @send-message="handleSendMessage"
          />
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- User Info -->
          <div class="bg-white border border-slate-200/50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded"></span>
              Данные заказчика
            </h3>
            <div class="space-y-3">
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200/50">
                <p class="text-xs text-slate-500 font-medium mb-1">Имя</p>
                <p class="text-slate-800 font-semibold">{{ order.userName }}</p>
              </div>
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200/50">
                <p class="text-xs text-slate-500 font-medium mb-1">Email</p>
                <p class="text-blue-600 font-semibold text-sm">{{ order.userEmail }}</p>
              </div>
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200/50">
                <p class="text-xs text-slate-500 font-medium mb-1">Контакт</p>
                <p class="text-slate-800 font-semibold">{{ order.contactType === 'phone' ? order.phone : order.telegram }}</p>
              </div>
            </div>
          </div>

          <!-- File Info -->
          <div v-if="order.file" class="bg-white border border-slate-200/50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded"></span>
              Файл
            </h3>
            <a
              :href="order.file.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50 hover:border-blue-300 transition group"
            >
              <Icon name="mdi:file-document" class="w-6 h-6 text-blue-500 group-hover:text-blue-600 transition" />
              <div>
                <p class="font-semibold text-slate-800 group-hover:text-blue-600 transition text-sm">{{ order.file.name }}</p>
                <p class="text-xs text-slate-500">Скачать файл</p>
              </div>
            </a>
          </div>

          <!-- Timeline -->
          <div class="bg-white border border-slate-200/50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded"></span>
              Временная Шкала
            </h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between text-slate-600">
                <span>Составлен:</span>
                <span class="font-semibold text-slate-800">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Обновлён:</span>
                <span class="font-semibold text-slate-800">{{ formatDate(order.updatedAt) }}</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Осталось дней:</span>
                <span class="font-semibold" :class="daysLeft <= 0 ? 'text-red-600' : daysLeft <= 3 ? 'text-orange-600' : 'text-green-600'">
                  {{ Math.max(0, daysLeft) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <p class="text-slate-600 text-lg">Заказ не найден</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import OrderChat from '~/components/OrderChat.vue'

const route = useRoute()
const { getOrder, addMessage } = useOrders()

const orderId = route.params.id as string
const order = computed(() => getOrder(orderId))
const progress = computed(() => {
  if (!order.value) return 0
  const completed = order.value.sections.filter(s => s.completed).length
  return Math.round((completed / order.value.sections.length) * 100)
})

const daysLeft = computed(() => {
  if (!order.value) return 0
  const deadline = new Date(order.value.deadline)
  const today = new Date()
  const diff = deadline.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'в работе': 'В работе',
    'решен': 'Решен',
    'отменен': 'Отменен'
  }
  return labels[status] || status
}

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    'в работе': 'bg-blue-50 text-blue-700 border border-blue-300',
    'решен': 'bg-green-50 text-green-700 border border-green-300',
    'отменен': 'bg-red-50 text-red-700 border border-red-300'
  }
  return colors[status] || 'bg-slate-50 text-slate-700 border border-slate-300'
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

const handleSendMessage = (text: string) => {
  if (order.value) {
    addMessage(order.value.id, 'user', text)
  }
}
</script>
