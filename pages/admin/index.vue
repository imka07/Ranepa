<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Навигация -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
            Admin Panel
        </h1>
        <div class="flex items-center gap-4">
          <span class="text-slate-700 text-sm font-medium">{{ adminUser?.email }}</span>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
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
        <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-300/50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="text-slate-700 text-sm mb-2 font-medium">Всего заказов</div>
          <div class="text-3xl font-bold text-slate-900">{{ stats.totalOrders }}</div>
          <div class="text-xs text-yellow-700 mt-2 font-semibold">{{ stats.ordersInProgress }} в обработке</div>
        </div>
        <div class="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-300/50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="text-slate-700 text-sm mb-2 font-medium">Всего пользователей</div>
          <div class="text-3xl font-bold text-slate-900">{{ stats.totalUsers }}</div>
          <div class="text-xs text-red-700 mt-2 font-semibold">{{ stats.blockedUsers }} блокировано</div>
        </div>
        <div class="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-300/50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="text-slate-700 text-sm mb-2 font-medium">Услуг</div>
          <div class="text-3xl font-bold text-slate-900">{{ stats.totalServices }}</div>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-300/50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="text-slate-700 text-sm mb-2 font-medium">Сообщения</div>
          <div class="text-3xl font-bold text-slate-900">{{ stats.totalMessages }}</div>
          <div class="text-xs text-blue-700 mt-2 font-semibold">{{ stats.unreadMessages }} новых</div>
        </div>
      </div>

      <!-- Меню табов -->
      <div class="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-lg mb-8 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="flex flex-wrap border-b border-slate-200/50">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-3.5 font-medium text-sm transition-all duration-200 border-b-2 -mb-px',
              activeTab === tab
                ? 'text-white border-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 shadow-md'
                : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-blue-50/50'
            ]"
          >
            {{ tabLabels[tab] }}
          </button>
        </div>
      </div>

      <!-- Содержимое табов -->
      <div class="bg-gradient-to-br from-blue-50/60 to-indigo-50/60 backdrop-blur-sm border border-blue-300/50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
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
  orders: 'Заказы',
  users: 'Пользователи',
  services: 'Услуги',
  messages: 'Сообщения',
  content: 'Контент'
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