<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Личный кабинет</h1>
          <p class="text-gray-600 mt-1">Добро пожаловать, {{ user?.name }}!</p>
        </div>
        <div class="flex gap-4">
          <NuxtLink
            to="/"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            На главную
          </NuxtLink>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Загрузка -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Загрузка заказов...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="ordersError" class="rounded-md bg-red-50 p-4">
        <p class="text-red-800">{{ ordersError }}</p>
      </div>

      <!-- Список заказов -->
      <div v-else>
        <!-- Пустое состояние -->
        <div v-if="userOrders.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Нет заказов</h3>
          <p class="mt-1 text-sm text-gray-500">Вы еще не создали ни одного заказа</p>
          <div class="mt-6">
            <NuxtLink
              to="/#order"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Создать заказ
            </NuxtLink>
          </div>
        </div>

        <!-- Карточки заказов -->
        <div v-else class="space-y-6">
          <div
            v-for="order in userOrders"
            :key="order.id"
            class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <!-- Заголовок заказа -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ order.workType }}</h3>
                <p class="text-sm text-gray-600">{{ order.subject }}</p>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  order.status === 'в работе' ? 'bg-yellow-100 text-yellow-800' : '',
                  order.status === 'решен' ? 'bg-green-100 text-green-800' : '',
                  order.status === 'отменен' ? 'bg-red-100 text-red-800' : ''
                ]"
              >
                {{ order.status }}
              </span>
            </div>

            <!-- Детали заказа -->
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Тема:</span>
                <span class="ml-2 text-gray-900">{{ order.theme }}</span>
              </div>
              <div>
                <span class="text-gray-600">Срок:</span>
                <span class="ml-2 text-gray-900">{{ order.deadline }}</span>
              </div>
              <div>
                <span class="text-gray-600">Объем:</span>
                <span class="ml-2 text-gray-900">{{ order.volume }}</span>
              </div>
              <div>
                <span class="text-gray-600">Дата создания:</span>
                <span class="ml-2 text-gray-900">{{ new Date(order.createdAt).toLocaleDateString('ru-RU') }}</span>
              </div>
            </div>

            <!-- Прогресс выполнения -->
            <div v-if="order.status === 'в работе'" class="mt-4">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Прогресс выполнения</span>
                <span class="text-gray-900">{{ getProgress(order) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all"
                  :style="{ width: getProgress(order) + '%' }"
                ></div>
              </div>
              
              <!-- Разделы -->
              <div class="mt-3 space-y-2">
                <div
                  v-for="section in order.sections"
                  :key="section.id"
                  class="flex items-center text-sm"
                >
                  <svg
                    :class="[
                      'h-5 w-5 mr-2',
                      section.completed ? 'text-green-500' : 'text-gray-300'
                    ]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span :class="section.completed ? 'text-gray-900' : 'text-gray-500'">
                    {{ section.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Комментарий -->
            <div v-if="order.comment" class="mt-4 p-3 bg-gray-50 rounded-md">
              <p class="text-sm text-gray-600"><span class="font-medium">Комментарий:</span> {{ order.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'user-auth',
  layout: false
})

const { user, logout } = useAuth()
const { orders, loading, error: ordersError, fetchOrders } = useOrders()
const router = useRouter()

const isLoading = computed(() => loading.value)

// Получаем только заказы текущего пользователя
const userOrders = computed(() => {
  if (!user.value) return []
  return orders.value.filter(order => order.userId === user.value!.id)
})

// Вычисляем прогресс заказа
const getProgress = (order: any) => {
  const completed = order.sections.filter((s: any) => s.completed).length
  return Math.round((completed / order.sections.length) * 100)
}

// Выход
const handleLogout = async () => {
  await logout()
  router.push('/login')
}

// Загружаем заказы при монтировании
onMounted(() => {
  fetchOrders()
})
</script>
