<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-10 border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button
            @click="router.back()"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {{ order ? getWorkTypeLabel(order.work_type) : 'Загрузка...' }}
            </h1>
            <p class="text-sm text-gray-600">{{ order?.subject }}</p>
          </div>
        </div>
        <span
          v-if="order"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide',
            order.status === 'в работе' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' : '',
            order.status === 'решен' ? 'bg-green-100 text-green-700 border-2 border-green-300' : '',
            order.status === 'отменен' ? 'bg-red-100 text-red-700 border-2 border-red-300' : ''
          ]"
        >
          {{ order.status }}
        </span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Загрузка -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
        <p class="mt-4 text-gray-600 font-medium">Загрузка...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="rounded-xl bg-red-50 border border-red-200 p-6">
        <p class="text-red-800 font-medium">{{ error }}</p>
      </div>

      <!-- Детали заказа -->
      <div v-else-if="order" class="space-y-6">
        <!-- Основная информация -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Информация о работе</h2>
          
          <div class="space-y-4">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <p class="text-sm font-semibold text-blue-600 mb-1">Тип</p>
              <p class="text-lg font-bold text-gray-900">{{ getWorkTypeLabel(order.work_type) }}</p>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p class="text-sm font-semibold text-blue-600 mb-1">Объём</p>
                <p class="text-xl font-bold text-gray-900">{{ order.volume }} стр.</p>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4 border border-green-100">
                <p class="text-sm font-semibold text-green-600 mb-1">Дедлайн</p>
                <p class="text-base font-bold text-gray-900">{{ formatDate(order.deadline) }}</p>
              </div>

              <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p class="text-sm font-semibold text-purple-600 mb-1">Сообщений</p>
                <p class="text-xl font-bold text-gray-900">{{ order.comment ? '1' : '0' }}</p>
              </div>
            </div>

            <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <p class="text-sm font-semibold text-yellow-700 mb-2">Сообщение от клиента:</p>
              <p class="text-gray-800">{{ order.comment || 'Нет комментариев' }}</p>
            </div>
          </div>
        </div>

        <!-- Прогресс выполнения -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Прогресс выполнения</h2>
          
          <div class="flex justify-between items-center mb-3">
            <span class="text-gray-600 font-medium">Завершено</span>
            <span class="text-2xl font-bold text-blue-600">{{ getProgress(order) }}%</span>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-6">
            <div
              class="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full transition-all duration-500 shadow-lg"
              :style="{ width: getProgress(order) + '%' }"
            ></div>
          </div>

          <div class="space-y-3">
            <div
              v-for="section in order.sections"
              :key="section.id"
              :class="[
                'flex items-center justify-between p-4 rounded-lg border-2 transition-all',
                section.completed 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-gray-50 border-gray-300'
              ]"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    section.completed ? 'bg-green-500' : 'bg-gray-300'
                  ]"
                >
                  <svg
                    v-if="section.completed"
                    class="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span
                  :class="[
                    'font-medium',
                    section.completed ? 'text-green-900' : 'text-gray-600'
                  ]"
                >
                  {{ section.name }}
                </span>
              </div>
              <span
                v-if="section.completed"
                class="text-xs font-semibold text-green-600 uppercase"
              >
                Готово
              </span>
            </div>
          </div>
        </div>

        <!-- Кнопка удаления -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-red-200">
          <h2 class="text-lg font-bold text-gray-900 mb-2">Опасная зона</h2>
          <p class="text-sm text-gray-600 mb-4">Удаление заказа необратимо. Пожалуйста, будьте внимательны.</p>
          <button
            @click="handleDelete"
            :disabled="isDeleting"
            class="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isDeleting">Удаление...</span>
            <span v-else>Удалить заказ</span>
          </button>
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

const route = useRoute()
const router = useRouter()
const orderId = route.params.id as string

const order = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const isDeleting = ref(false)

// Загрузка заказа
const fetchOrder = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch(`/api/orders/${orderId}`)
    order.value = response
  } catch (err: any) {
    console.error('Ошибка загрузки заказа:', err)
    error.value = 'Не удалось загрузить заказ'
  } finally {
    loading.value = false
  }
}

// Удаление заказа
const handleDelete = async () => {
  if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return
  
  isDeleting.value = true
  
  try {
    await $fetch(`/api/orders/${orderId}`, {
      method: 'DELETE'
    })
    
    alert('Заказ успешно удалён')
    router.push('/dashboard')
  } catch (err: any) {
    console.error('Ошибка удаления:', err)
    alert('Не удалось удалить заказ')
  } finally {
    isDeleting.value = false
  }
}

// Вычисление прогресса
const getProgress = (order: any) => {
  if (!order.sections || order.sections.length === 0) return 0
  const completed = order.sections.filter((s: any) => s.completed).length
  return Math.round((completed / order.sections.length) * 100)
}

// Название типа работы
const getWorkTypeLabel = (workType: string) => {
  const labels: Record<string, string> = {
    essay: 'Реферат',
    coursework: 'Курсовая работа',
    diploma: 'Дипломная работа',
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

onMounted(() => {
  fetchOrder()
})
</script>
