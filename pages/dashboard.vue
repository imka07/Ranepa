<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ user?.name || 'Личный кабинет' }}</h1>
          <p class="text-slate-500 text-sm mt-0.5">{{ user?.email }}</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink
            to="/"
            class="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            ← Главная
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Navigation Tabs -->
      <div class="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl mb-8 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="flex flex-wrap border-b border-slate-200/50">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-3.5 font-medium text-sm transition-all duration-200 border-b-2 -mb-px relative',
              activeTab === tab.id
                ? 'text-white border-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 shadow-md'
                : 'text-slate-600 hover:text-slate-800 border-transparent hover:bg-slate-100/50'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <!-- Orders History -->
        <div v-show="activeTab === 'orders'">
          <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span class="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded"></span>
            История заказов
          </h2>
          <div v-if="orders.length === 0" class="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50 shadow-sm">
            <p class="text-slate-600 mb-4">У вас еще нет заказов</p>
            <NuxtLink
              to="/"
              class="inline-block px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Создать заказ
            </NuxtLink>
          </div>
          <div v-for="order in orders" :key="order.id" class="bg-white border border-slate-200/50 rounded-lg p-5 hover:border-blue-300/50 hover:shadow-lg transition-all duration-300 mb-4 transform hover:translate-y-[-2px] hover:bg-blue-50/30">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-800">{{ order.subject }}: {{ order.theme }}</h3>
                <p class="text-slate-500 text-sm mt-1">Заказ #{{ order.id }}</p>
              </div>
              <span :class="['px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ml-4 shadow-sm', statusColor(order.status)]">
                {{ statusLabel(order.status) }}
              </span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100/50">
                <p class="text-xs text-slate-500 mb-1 font-medium">Тип</p>
                <p class="text-slate-800 font-semibold">{{ getWorkTypeLabel(order.workType) }}</p>
              </div>
              <div class="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-lg border border-slate-100">
                <p class="text-xs text-slate-500 mb-1 font-medium">Объём</p>
                <p class="text-slate-800 font-semibold">{{ order.volume }} стр.</p>
              </div>
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100/50">
                <p class="text-xs text-slate-500 mb-1 font-medium">Дедлайн</p>
                <p class="text-slate-800 font-semibold">{{ formatDate(order.deadline) }}</p>
              </div>
              <div class="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-100/50">
                <p class="text-xs text-slate-500 mb-1 font-medium">Сообщений</p>
                <p class="text-slate-800 font-semibold">{{ order.messages?.length || 0 }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews -->
        <div v-show="activeTab === 'reviews'">
          <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span class="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded"></span>
            Мои отзывы
          </h2>
          <div class="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50 text-slate-600 shadow-sm">
            <p class="mb-4">У вас еще нет отзывов</p>
            <NuxtLink
              to="/reviews"
              class="inline-block px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Оставить отзыв
            </NuxtLink>
          </div>
        </div>

        <!-- FAQ -->
        <div v-show="activeTab === 'faq'">
          <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span class="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded"></span>
            Часто задаваемые вопросы
          </h2>
          <div class="space-y-3">
            <div
              v-for="(item, idx) in faqItems"
              :key="idx"
              class="bg-white border border-slate-200/50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 shadow-sm"
            >
              <button
                @click="expandedFaq = expandedFaq === idx ? null : idx"
                class="w-full px-4 py-4 flex items-center justify-between hover:bg-blue-50/50 transition-colors duration-200"
              >
                <span class="text-slate-800 font-medium text-sm text-left">{{ item.q }}</span>
                <Icon
                  name="mdi:chevron-down"
                  :class="['w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300', expandedFaq === idx && 'rotate-180 text-blue-500']"
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
                  class="px-4 py-3 border-t border-slate-200/50 text-slate-700 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 text-sm leading-relaxed"
                >
                  {{ item.a }}
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Settings -->
        <div v-show="activeTab === 'settings'">
          <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span class="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded"></span>
            Настройки
          </h2>
          <div class="bg-white border border-slate-200/50 rounded-lg p-6 space-y-4 max-w-md shadow-sm">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Имя</label>
              <input
                :value="user?.name"
                disabled
                class="w-full px-4 py-2.5 bg-gradient-to-br from-slate-50 to-blue-50 text-slate-600 border border-slate-200 rounded-lg cursor-not-allowed text-sm font-medium"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                :value="user?.email"
                disabled
                class="w-full px-4 py-2.5 bg-gradient-to-br from-slate-50 to-blue-50 text-slate-600 border border-slate-200 rounded-lg cursor-not-allowed text-sm font-medium"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Телефон</label>
              <input
                :value="user?.phone"
                disabled
                class="w-full px-4 py-2.5 bg-gradient-to-br from-slate-50 to-blue-50 text-slate-600 border border-slate-200 rounded-lg cursor-not-allowed text-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Order } from '~/composables/useOrders'

const { user } = useAuth()
const { orders } = useOrders()

const activeTab = ref('orders')
const expandedFaq = ref<number | null>(null)

const tabs = [
  { id: 'orders', label: 'Заказы' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'faq', label: 'FAQ' },
  { id: 'settings', label: 'Настройки' }
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
    pending: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-300/50 shadow-sm',
    'in-progress': 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-300/50 shadow-sm',
    completed: 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-300/50 shadow-sm',
    delivered: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-300/50 shadow-sm'
  }
  return colors[status] || 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-300/50 shadow-sm'
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
</script>