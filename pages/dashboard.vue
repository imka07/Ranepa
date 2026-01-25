<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-10 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Личный кабинет
          </h1>
          <p class="text-sm text-gray-600 mt-1">Добро пожаловать, <span class="font-medium text-gray-900">{{ user?.name }}</span>!</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink
            to="/"
            class="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all hover:shadow-md"
          >
            На главную
          </NuxtLink>
          <button
            @click="handleLogout"
            class="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all hover:shadow-md"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Загрузка -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
        <p class="mt-4 text-gray-600 font-medium">Загрузка заказов...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="ordersError" class="rounded-xl bg-red-50 border border-red-200 p-6">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-800 font-medium">{{ ordersError }}</p>
        </div>
      </div>

      <!-- Список заказов -->
      <div v-else>
        <!-- Пустое состояние -->
        <div v-if="userOrders.length === 0" class="text-center py-20">
          <div class="mx-auto h-24 w-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <svg class="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="mt-6 text-xl font-semibold text-gray-900">Нет заказов</h3>
          <p class="mt-2 text-gray-600">Вы еще не создали ни одного заказа</p>
          <div class="mt-8">
            <NuxtLink
              to="/#order"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Создать заказ
            </NuxtLink>
          </div>
        </div>

        <!-- Карточки заказов -->
        <div v-else>
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Мои заказы</h2>
            <p class="text-sm text-gray-600 mt-1">Всего: {{ userOrders.length }} {{ userOrders.length === 1 ? 'заказ' : 'заказов' }}</p>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <NuxtLink
              v-for="order in userOrders"
              :key="order.id"
              :to="`/order/${order.id}`"
              class="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
            >
              <!-- Заголовок -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {{ getWorkTypeLabel(order.work_type) }}
                      </h3>
                      <span
                        :class="[
                          'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
                          order.status === 'в работе' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : '',
                          order.status === 'решен' ? 'bg-green-100 text-green-700 border border-green-300' : '',
                          order.status === 'отменен' ? 'bg-red-100 text-red-700 border border-red-300' : ''
                        ]"
                      >
                        {{ order.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1 font-medium">{{ order.subject }}</p>
                  </div>
                  <svg class="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              <!-- Детали -->
              <div class="px-6 py-5">
                <!-- Тема -->
                <div class="mb-4">
                  <p class="text-sm font-medium text-gray-500 mb-1">Тема:</p>
                  <p class="text-gray-900 font-medium">{{ order.theme }}</p>
                </div>

                <!-- Информация -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div class="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <p class="text-xs text-blue-600 font-semibold mb-1">Срок</p>
                    <p class="text-sm font-bold text-gray-900">{{ formatDate(order.deadline) }}</p>
                  </div>
                  <div class="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                    <p class="text-xs text-indigo-600 font-semibold mb-1">Объём</p>
                    <p class="text-sm font-bold text-gray-900">{{ order.volume }} стр.</p>
                  </div>
                  <div class="bg-green-50 rounded-lg p-3 border border-green-100">
                    <p class="text-xs text-green-600 font-semibold mb-1">Дата создания</p>
                    <p class="text-sm font-bold text-gray-900">{{ formatDate(order.created_at) }}</p>
                  </div>
                  <div class="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <p class="text-xs text-purple-600 font-semibold mb-1">Сообщений</p>
                    <p class="text-sm font-bold text-gray-900">{{ order.comment ? '1' : '0' }}</p>
                  </div>
                </div>

                <!-- Прогресс -->
                <div v-if="order.status === 'в работе' && order.sections" class="mt-4">
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600 font-medium">Прогресс выполнения</span>
                    <span class="text-blue-600 font-bold">{{ getProgress(order) }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      class="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                      :style="{ width: getProgress(order) + '%' }"
                    ></div>
                  </div>
                  
                  <!-- Разделы -->
                  <div class="mt-3 flex flex-wrap gap-2">
                    <div
                      v-for="section in order.sections"
                      :key="section.id"
                      :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors',
                        section.completed 
                          ? 'bg-green-100 text-green-700 border border-green-300' 
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                      ]"
                    >
                      <svg
                        :class="['h-4 w-4 mr-1.5', section.completed ? 'text-green-600' : 'text-gray-400']"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      {{ section.name }}
                    </div>
                  </div>
                </div>
              </div>
            </NuxtLink>
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
  return orders.value.filter(order => order.user_id === user.value!.id)
})

// Вычисляем прогресс заказа
const getProgress = (order: any) => {
  if (!order.sections || order.sections.length === 0) return 0
  const completed = order.sections.filter((s: any) => s.completed).length
  return Math.round((completed / order.sections.length) * 100)
}

// Получение названия типа работы
const getWorkTypeLabel = (workType: string) => {
  const labels: Record<string, string> = {
    essay: 'Реферат',
    coursework: 'Курсовая',
    diploma: 'Диплом',
    abstract: 'Абстракт',
    presentation: 'Презентация',
    solution: 'Решение задач',
    report: 'Отчет',
    scientific_article: 'Научная статья',
    exam_help: 'Помощь на экзамене',
    other: 'Другое'
  }
  return labels[workType] || workType
}

// Форматирование даты
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { 
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric'
  })
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
