<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <!-- Mobile Layout -->
        <div class="flex flex-col gap-3 sm:hidden">
          <!-- Title + Logout -->
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Кабинет администратора
              </h1>
              <p class="text-slate-500 text-xs mt-0.5">Управление заказами</p>
            </div>
            <button
              @click="handleLogout"
              class="px-3 py-2 bg-red-500/90 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition duration-200 shadow-sm"
            >
              Выйти
            </button>
          </div>
          
          <!-- User + Orders Count -->
          <div class="flex gap-2 text-xs">
            <div class="flex-1 px-2 py-1.5 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-lg text-slate-600 font-medium shadow-sm truncate">
              <span class="text-blue-600">✓</span> {{ adminUser?.email || 'Admin' }}
            </div>
            <div class="px-2 py-1.5 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-lg text-slate-600 font-medium shadow-sm whitespace-nowrap">
              Заказов: <span class="text-slate-900 font-bold">{{ allOrders?.length || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Desktop Layout -->
        <div class="hidden sm:flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Кабинет администратора
              </h1>
              <p class="text-slate-500 text-xs mt-0.5">Управление заказами</p>
            </div>
          </div>

          <div class="flex gap-3 items-center">
            <!-- User Info -->
            <div class="px-3 py-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-lg text-xs text-slate-600 font-medium shadow-sm">
              <span class="text-blue-600">✓</span> {{ adminUser?.email || 'Admin' }}
            </div>
            
            <!-- Orders Count -->
            <div class="px-3 py-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-lg text-xs text-slate-600 font-medium shadow-sm">
              Заказов: <span class="text-slate-900 font-bold">{{ allOrders?.length || 0 }}</span>
            </div>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition duration-200 shadow-sm hover:shadow-md"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <!-- Filters & Search -->
      <div class="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl mb-4 sm:mb-8 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Фильтр по статусу</label>
            <select
              v-model="filterStatus"
              class="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-slate-700 font-medium text-sm"
            >
              <option value="">Все</option>
              <option value="в работе">В работе</option>
              <option value="решен">Решен</option>
              <option value="отменен">Отменен</option>
            </select>
          </div>

          <!-- Work Type Filter -->
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Тип работы</label>
            <select
              v-model="filterWorkType"
              class="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-slate-700 font-medium text-sm"
            >
              <option value="">Все</option>
              <option value="essay">Реферат</option>
              <option value="coursework">Курсовая</option>
              <option value="diploma">Диплом</option>
              <option value="presentation">Презентация</option>
            </select>
          </div>

          <!-- Search -->
          <div class="sm:col-span-2">
            <label class="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Поиск по заказу или email</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Введите ID, email или тему..."
              class="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-400 font-medium text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <div v-if="!filteredOrders || filteredOrders.length === 0" class="text-center py-12 px-4">
          <p class="text-slate-600 text-base sm:text-lg font-medium">Нет заказов, соответствующих фильтрам</p>
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
import { ref, computed, onMounted } from 'vue'
import OrderCard from '~/components/OrderCard.vue'

// Защищаем страницу через middleware
definePageMeta({
  middleware: ['admin-auth']
})

const router = useRouter()
const { logout, adminUser } = useAdminAuth()
const { getAllOrders, updateOrderStatus, updateSectionStatus, deleteOrder } = useOrders()

const filterStatus = ref('')
const filterWorkType = ref('')
const searchQuery = ref('')

// Очищаем мок-данные при загрузке страницы
onMounted(() => {
  if (process.client) {
    const stored = localStorage.getItem('orders')
    if (stored) {
      try {
        const orders = JSON.parse(stored)
        // Проверяем, есть ли мок-данные (по известным темам)
        const mockThemes = ['Великая Октябрьская революция', 'Краткие интегралы']
        const hasMockData = orders.some((o: any) => mockThemes.some(theme => o.theme?.includes(theme)))

        if (hasMockData) {
          console.log('🧼 Найдены мок-данные, очищаю localStorage...')
          localStorage.removeItem('orders')
          // Перезагружаем страницу для обновления
          window.location.reload()
        }
      } catch (e) {
        console.error('Error checking for mock data:', e)
      }
    }
  }
})

const allOrders = computed(() => {
  const orders = getAllOrders()
  return Array.isArray(orders) ? orders : []
})

const filteredOrders = computed(() => {
  if (!Array.isArray(allOrders.value) || allOrders.value.length === 0) {
    return []
  }

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

const handleLogout = async () => {
  await logout()
  router.push('/admin-login')
}
</script>