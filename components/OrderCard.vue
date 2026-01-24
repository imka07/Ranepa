<template>
  <div class="bg-white border border-slate-200/50 rounded-lg p-3 sm:p-5 hover:border-blue-300/50 hover:shadow-lg transition-all duration-300 mb-3 sm:mb-4 transform hover:translate-y-[-2px] hover:bg-blue-50/30">
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
      <div class="flex-1 min-w-0">
        <h3 class="text-base sm:text-lg font-semibold text-slate-800 break-words">{{ order.subject }}: {{ order.theme }}</h3>
        <p class="text-slate-500 text-xs sm:text-sm mt-1">Заказ #{{ order.id }}</p>
      </div>
      <!-- Открываемая статус-кнопка (админ может тогда менять, юзер нет) -->
      <div v-if="isAdminView" class="relative self-start sm:ml-4">
        <button
          @click="toggleStatusMenu"
          :class="['px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap shadow-sm transition-all cursor-pointer hover:shadow-md', statusColor(order.status)]"
        >
          {{ statusLabel(order.status) }}
        </button>

        <!-- Меню выбора статуса -->
        <Transition
          enter-active-class="transition duration-100"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="statusMenuOpen"
            class="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-max"
          >
            <button
              v-for="status in statusOptions"
              :key="status"
              @click="selectStatus(status)"
              :class="[
                'block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors border-b border-slate-100 last:border-0 hover:bg-slate-50',
                order.status === status
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700'
              ]"
            >
              {{ statusLabel(status) }}
            </button>
          </div>
        </Transition>
      </div>
      <!-- Обычный статус-бейдж (юзер) -->
      <span v-else :class="['px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap shadow-sm self-start sm:ml-4', statusColor(order.status)]">
        {{ statusLabel(order.status) }}
      </span>
    </div>

    <!-- Основная информация -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-sm text-slate-600 mb-3 sm:mb-4">
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-2 sm:p-3 rounded-lg border border-blue-100/50">
        <p class="text-xs text-slate-500 mb-1 font-medium">Тип</p>
        <p class="text-slate-800 font-semibold text-xs sm:text-sm truncate">{{ getWorkTypeLabel(order.workType) }}</p>
      </div>
      <div class="bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-3 rounded-lg border border-slate-100">
        <p class="text-xs text-slate-500 mb-1 font-medium">Объём</p>
        <p class="text-slate-800 font-semibold text-xs sm:text-sm">{{ order.volume }} стр.</p>
      </div>
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-2 sm:p-3 rounded-lg border border-green-100/50">
        <p class="text-xs text-slate-500 mb-1 font-medium">Дедлайн</p>
        <p class="text-slate-800 font-semibold text-xs sm:text-sm">{{ formatDate(order.deadline) }}</p>
      </div>
      <div class="bg-gradient-to-br from-purple-50 to-indigo-50 p-2 sm:p-3 rounded-lg border border-purple-100/50">
        <p class="text-xs text-slate-500 mb-1 font-medium">Сообщений</p>
        <p class="text-slate-800 font-semibold text-xs sm:text-sm">{{ order.comment ? 1 : 0 }}</p>
      </div>
    </div>

    <!-- Сообщение от клиента (только для админа и если есть) -->
    <div v-if="isAdminView && order.comment" class="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-lg">
      <p class="text-xs font-semibold text-amber-800 mb-2">Сообщение от клиента:</p>
      <p class="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">{{ order.comment }}</p>
    </div>

    <!-- Прогресс выполнения (только для админа) -->
    <div v-if="showProgress && order.sections && order.sections.length > 0" class="mb-3 sm:mb-4">
      <div class="flex items-center justify-between mb-2">
        <p class="text-xs font-semibold text-slate-600">Прогресс выполнения</p>
        <p class="text-xs font-bold text-blue-600">{{ progress }}%</p>
      </div>
      <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Разделы работы (только для админа) -->
    <div v-if="showSections && order.sections && order.sections.length > 0" class="mb-3 sm:mb-4">
      <p class="text-xs font-semibold text-slate-600 mb-2">Разделы работы</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <div
          v-for="section in order.sections"
          :key="section.id"
          class="flex items-center gap-1.5 sm:gap-2 p-2 rounded-lg border transition-all duration-200"
          :class="section.completed
            ? 'bg-green-50 border-green-300 text-green-700'
            : 'bg-slate-50 border-slate-300 text-slate-700 cursor-pointer hover:bg-slate-100'
          "
          @click="!isAdminView || toggleSection(section.id)"
        >
          <input
            v-if="isAdminView"
            type="checkbox"
            :checked="section.completed"
            @click.stop="toggleSection(section.id)"
            class="w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer flex-shrink-0"
          />
          <span v-else :class="['w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center text-xs flex-shrink-0', section.completed ? '' : 'hidden']">
            ✓
          </span>
          <span class="text-xs font-medium truncate">{{ section.name }}</span>
        </div>
      </div>
    </div>

    <!-- Действия -->
    <div v-if="showActions" class="flex gap-2 pt-3 border-t border-slate-200/50">
      <!-- для админа: кнопка удаления -->
      <div v-if="isAdminView" class="flex gap-2 w-full">
        <!-- Кнопка удаления -->
        <button
          @click="handleDelete"
          class="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition text-xs sm:text-sm font-medium shadow-md hover:shadow-lg"
          title="Удалить заказ"
        >
          Удалить
        </button>
      </div>

      <!-- для юзер: стандартная кнопка -->
      <button
        v-else
        @click="$emit('view-details')"
        class="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition text-xs sm:text-sm font-medium shadow-md hover:shadow-lg"
      >
        Подробнее
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Order } from '~/composables/useOrders'

interface Props {
  order: Order
  isAdminView?: boolean
  showProgress?: boolean
  showSections?: boolean
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isAdminView: false,
  showProgress: false,
  showSections: false,
  showActions: true
})

const emit = defineEmits<{
  'view-details': []
  'update-status': [status: 'в работе' | 'решен' | 'отменен']
  'toggle-section': [sectionId: string]
  'delete-order': []
}>()

const { deleteOrder } = useOrders()

const statusMenuOpen = ref(false)
const statusOptions: Array<'в работе' | 'решен' | 'отменен'> = ['в работе', 'решен', 'отменен']

const progress = ref(0)

// Пересчитываем прогресс при изменении sections
const recalculateProgress = () => {
  if (!props.order.sections || props.order.sections.length === 0) {
    progress.value = 0
    return
  }
  const completedSections = props.order.sections.filter(s => s?.completed).length
  progress.value = Math.round((completedSections / props.order.sections.length) * 100)
}

// Получаем начальное значение прогресса
recalculateProgress()

// Обслуживаем изменения sections
watch(
  () => props.order.sections,
  () => {
    recalculateProgress()
  },
  { deep: true }
)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU')
}

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'в работе': 'В работе',
    'решен': 'Решен',
    'отменен': 'Отменен'
  }
  return labels[status] || status
}

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    'в работе': 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-300/50 shadow-sm',
    'решен': 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-300/50 shadow-sm',
    'отменен': 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-300/50 shadow-sm'
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
    report: 'Реферат',
    scientific_article: 'Научная статья',
    exam_help: 'Помощь на экзамене',
    other: 'Другое'
  }
  return labels[type] || type
}

const toggleStatusMenu = () => {
  statusMenuOpen.value = !statusMenuOpen.value
}

const selectStatus = (status: 'в работе' | 'решен' | 'отменен') => {
  emit('update-status', status)
  statusMenuOpen.value = false
}

const toggleSection = (sectionId: string) => {
  emit('toggle-section', sectionId)
}

const handleDelete = () => {
  if (confirm('Вы уверены? Нельзя вернуть это действие.')) {
    deleteOrder(props.order.id)
    emit('delete-order')
  }
}
</script>