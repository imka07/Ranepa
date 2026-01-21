<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
    <!-- Admin Header -->
    <nav class="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Icon name="mdi:shield-admin" class="w-8 h-8 text-white" />
          <div>
            <h1 class="text-xl font-bold text-white">Admin Dashboard</h1>
            <p class="text-slate-400 text-xs mt-0.5">Order Management System</p>
          </div>
        </div>
        <div class="flex gap-3 items-center">
          <div class="px-3 py-2 bg-slate-800 rounded-lg text-xs text-slate-400 font-mono">
            Ордеров: <span class="text-white font-bold">{{ allOrders.length }}</span>
          </div>
          <NuxtLink
            to="/"
            class="px-4 py-2 text-white border border-slate-600 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 font-medium text-sm shadow-md"
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
            <label class="block text-sm font-semibold text-slate-700 mb-2">Фильтор по статусу</label>
            <select
              v-model="filterStatus"
              class="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white text-slate-700 font-medium"
            >
              <option value="">All</option>
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
              class="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white text-slate-700 font-medium"
            >
              <option value="">All</option>
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
              placeholder="Наберите ID, email или тему..."
              class="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder:text-slate-400 font-medium"
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
            @update-status="handleUpdateStatus"
            @toggle-section="handleToggleSection"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import OrderCard from '~/components/OrderCard.vue'

const { getAllOrders, updateOrderStatus, updateSectionStatus } = useOrders()

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
</script>
