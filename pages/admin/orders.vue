<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Icon name="mdi:shield-admin" class="w-7 h-7 text-slate-700" />
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Кабинет администратора
            </h1>
            <p class="text-slate-500 text-xs mt-0.5">Управление заказами</p>
          </div>
        </div>

        <div class="flex gap-3 items-center">
          <div class="px-3 py-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-lg text-xs text-slate-600 font-medium shadow-sm">
            Заказов: <span class="text-slate-900 font-bold">{{ allOrders.length }}</span>
          </div>
          <NuxtLink
            to="/"
            class="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            ← На сайт
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Filters & Search -->
      <div class="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl mb-8 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Фильтр по статусу</label>
            <select
              v-model="filterStatus"
              class="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-slate-700 font-medium"
            >
              <option value="">Все</option>
              <option value="в работе">В работе</option>
              <option value="решен">Решен</option>
              <option value="отменен">Отменен</option>
            </select>
          </div>

          <!-- Work Type Filter -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Тип работы</label>
            <select
              v-model="filterWorkType"
              class="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-slate-700 font-medium"
            >
              <option value="">Все</option>
              <option value="essay">Реферат</option>
              <option value="coursework">Курсовая</option>
              <option value="diploma">Диплом</option>
              <option value="presentation">Презентация</option>
            </select>
          </div>

          <!-- Search -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Поиск по заказу или email</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Введите ID, email или тему..."
              class="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <div v-if="filteredOrders.length === 0" class="text-center py-12 px-4">
          <p class="text-slate-600 text-lg font-medium">Нет заказов, соответствующих фильтрам</p>
        </div>
        <div v-else class="divide-y divide-slate-200/50">
          <OrderCard
            v-for="order in filteredOrders"
            :key="order.id"
            :order="order"
            :is-admin-view="true"
            :show-progress="true"
            :show-sections="true"
            :show-actions="true"
            @update-status="(status) => handleUpdateStatus(order.id, status)"
            @toggle-section="(sectionId) => handleToggleSection(order.id, sectionId)"
            @delete-order="() => handleDeleteOrder(order.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import OrderCard from '~/components/OrderCard.vue'

const { getAllOrders, updateOrderStatus, updateSectionStatus, deleteOrder } = useOrders()

const filterStatus = ref('')
const filterWorkType = ref('')
const searchQuery = ref('')

const allOrders = computed(() => getAllOrders())

const filteredOrders = computed(() => {
  return allOrders.value.filter(order => {
    // Фильтр по статусу
    if (filterStatus.value && order.status !== filterStatus.value) return false

    // Фильтр по типу работы
    if (filterWorkType.value && order.workType !== filterWorkType.value) return false

    // Поиск
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return (
        order.id.toLowerCase().includes(query) ||
        order.userEmail.toLowerCase().includes(query) ||
        order.theme.toLowerCase().includes(query) ||
        order.subject.toLowerCase().includes(query)
      )
    }

    return true
  })
})

const handleUpdateStatus = (orderId: string, status: 'в работе' | 'решен' | 'отменен') => {
  updateOrderStatus(orderId, status)
}

const handleToggleSection = (orderId: string, sectionId: string) => {
  const order = allOrders.value.find(o => o.id === orderId)
  if (order) {
    const section = order.sections.find(s => s.id === sectionId)
    if (section) {
      updateSectionStatus(orderId, sectionId, !section.completed)
    }
  }
}

const handleDeleteOrder = (orderId: string) => {
  deleteOrder(orderId)
}
</script>
