<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Администратор</h1>
        </div>
        <div class="flex gap-3 items-center">
          <span class="text-slate-600 text-sm">{{ adminUser?.email }}</span>
          <button
            @click="handleLogout"
            class="px-4 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            Выход
          </button>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="text-slate-600 text-sm font-medium mb-2">Всего заказов</div>
          <div class="text-3xl font-bold text-slate-900">{{ stats.totalOrders }}</div>
          <div class="text-xs text-amber-600 mt-2 font-medium">{{ stats.ordersInProgress }} в обработке</div>
        </div>
        <div class="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="text-slate-600 text-sm font-medium mb-2">Всего пользователей</div>
          <div class="text-3xl font-bold text-slate-900">{{ stats.totalUsers }}</div>
          <div class="text-xs text-red-600 mt-2 font-medium">{{ stats.blockedUsers }} блокировано</div>
        </div>
        <div class="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="text-slate-600 text-sm font-medium mb-2">Услуг</div>
          <div class="text-3xl font-bold text-slate-900">{{ stats.totalServices }}</div>
          <div class="text-xs text-slate-500 mt-2">&nbsp;</div>
        </div>
        <div class="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="text-slate-600 text-sm font-medium mb-2">Сообщения</div>
          <div class="text-3xl font-bold text-slate-900">{{ stats.totalMessages }}</div>
          <div class="text-xs text-blue-600 mt-2 font-medium">{{ stats.unreadMessages }} новых</div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl mb-8 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="flex flex-wrap border-b border-slate-200/50">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-3.5 font-medium text-sm transition-all duration-200 border-b-2 -mb-px relative',
              activeTab === tab
                ? 'text-white border-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 shadow-md'
                : 'text-slate-600 hover:text-slate-800 border-transparent hover:bg-slate-100/50'
            ]"
          >
            {{ tabLabels[tab] }}
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <!-- Orders -->
        <div v-show="activeTab === 'orders'">
          <AdminOrdersSection />
        </div>

        <!-- Users -->
        <div v-show="activeTab === 'users'">
          <AdminUsersSection />
        </div>

        <!-- Services -->
        <div v-show="activeTab === 'services'">
          <AdminServicesSection />
        </div>

        <!-- Messages -->
        <div v-show="activeTab === 'messages'">
          <AdminMessagesSection />
        </div>

        <!-- Content -->
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
  content: '📋 Контент'
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
