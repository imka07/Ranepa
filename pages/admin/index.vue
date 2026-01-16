<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Навигация -->
    <nav class="bg-slate-800/80 border-b border-white/10 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white flex items-center gap-2">
          <span class="text-blue-500">🔓</span> Admin Panel
        </h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-400 text-sm">{{ adminUser?.email }}</span>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition text-sm"
          >
            Выход
          </button>
        </div>
      </div>
    </nav>

    <!-- Контент -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Статистика -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-slate-700/50 border border-white/10 rounded-lg p-6">
          <div class="text-gray-400 text-sm mb-2">Всего заказов</div>
          <div class="text-3xl font-bold text-white">{{ stats.totalOrders }}</div>
          <div class="text-xs text-yellow-500 mt-2">{{ stats.ordersInProgress }} в обработке</div>
        </div>
        <div class="bg-slate-700/50 border border-white/10 rounded-lg p-6">
          <div class="text-gray-400 text-sm mb-2">Всего пользователей</div>
          <div class="text-3xl font-bold text-white">{{ stats.totalUsers }}</div>
          <div class="text-xs text-red-500 mt-2">{{ stats.blockedUsers }} блокировано</div>
        </div>
        <div class="bg-slate-700/50 border border-white/10 rounded-lg p-6">
          <div class="text-gray-400 text-sm mb-2">Услуг
</div>
          <div class="text-3xl font-bold text-white">{{ stats.totalServices }}</div>
        </div>
        <div class="bg-slate-700/50 border border-white/10 rounded-lg p-6">
          <div class="text-gray-400 text-sm mb-2">Сообщения</div>
          <div class="text-3xl font-bold text-white">{{ stats.totalMessages }}</div>
          <div class="text-xs text-blue-500 mt-2">{{ stats.unreadMessages }} новых</div>
        </div>
      </div>

      <!-- Меню красноты табов -->
      <div class="bg-slate-800/50 border border-white/10 rounded-lg mb-8 overflow-hidden">
        <div class="flex flex-wrap border-b border-white/10">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-3 font-medium text-sm transition border-b-2 -mb-px',
              activeTab === tab
                ? 'text-blue-500 border-blue-500 bg-blue-500/10'
                : 'text-gray-400 hover:text-white border-transparent'
            ]"
          >
            {{ tabLabels[tab] }}
          </button>
        </div>
      </div>

      <!-- Содержимое табов -->
      <div class="bg-slate-800/50 border border-white/10 rounded-lg p-6">
        <!-- Обзор заказов -->
        <div v-show="activeTab === 'orders'">
          <AdminOrdersSection />
        </div>

        <!-- Управление пользователями -->
        <div v-show="activeTab === 'users'">
          <AdminUsersSection />
        </div>

        <!-- Управление услугами -->
        <div v-show="activeTab === 'services'">
          <AdminServicesSection />
        </div>

        <!-- Обработка сообщений -->
        <div v-show="activeTab === 'messages'">
          <AdminMessagesSection />
        </div>

        <!-- Управление контентом -->
        <div v-show="activeTab === 'content'">
          <AdminContentSection />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminOrdersSection from '~/components/Admin/AdminOrdersSection.vue'
import AdminUsersSection from '~/components/Admin/AdminUsersSection.vue'
import AdminServicesSection from '~/components/Admin/AdminServicesSection.vue'
import AdminMessagesSection from '~/components/Admin/AdminMessagesSection.vue'
import AdminContentSection from '~/components/Admin/AdminContentSection.vue'

const router = useRouter()
const { adminUser, isAdmin, adminLogout } = useAdmin()
const { getStats } = useAdminData()

const activeTab = ref<'orders' | 'users' | 'services' | 'messages' | 'content'>('orders')
const stats = ref(getStats())

const tabs = ['orders', 'users', 'services', 'messages', 'content'] as const
const tabLabels: Record<string, string> = {
  orders: '📦 Заказы',
  users: '👥 Пользователи',
  services: '⚙️ Услуги',
  messages: '💬 Сообщения',
  content: '📝 Контент'
}

const handleLogout = () => {
  adminLogout()
  router.push('/admin/login')
}

onMounted(() => {
  if (!isAdmin.value) {
    router.push('/admin/login')
  }
  // Обновляем статистику каждые 5 секунд
  setInterval(() => {
    stats.value = getStats()
  }, 5000)
})
</script>
