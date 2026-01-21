<template>
  <div class="bg-white border border-slate-200/50 rounded-lg p-5 hover:border-blue-300/50 hover:shadow-lg transition-all duration-300 mb-4 transform hover:translate-y-[-2px] hover:bg-blue-50/30">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-slate-800">{{ order.subject }}: {{ order.theme }}</h3>
        <p class="text-slate-500 text-sm mt-1">Заказ #{{ order.id }}</p>
      </div>
      <span :class="['px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ml-4 shadow-sm', statusColor(order.status)]">
        {{ statusLabel(order.status) }}
      </span>
    </div>

    <!-- Основная информация -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-4">
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100/50">
        <p class="text-xs text-slate-500 mb-1 font-medium">Тип</p>
        <p class="text-slate-800 font-semibold">{{ getWorkTypeLabel(order.workType) }}</p>
      </div>
      <div class="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-lg border border-slate-100">
        <p class="text-xs text-slate-500 mb-1 font-medium">Объём</p>
        <p class="text-slate-800 font-semibold">{{ order.volume }} стр.</p>
      </div>
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100/50">
        <p class="text-xs text-slate-500 mb-1 font-medium">Дедлайн</p>
        <p class="text-slate-800 font-semibold">{{ formatDate(order.deadline) }}</p>
      </div>
      <div class="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-100/50">
        <p class="text-xs text-slate-500 mb-1 font-medium">Сообщений</p>
        <p class="text-slate-800 font-semibold">{{ order.messages?.length || 0 }}</p>
      </div>
    </div>

    <!-- Прогресс выполнения (только для админа) -->
    <div v-if="showProgress" class="mb-4">
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
    <div v-if="showSections" class="mb-4">
      <p class="text-xs font-semibold text-slate-600 mb-2">Разделы работы</p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div
          v-for="section in order.sections"
          :key="section.id"
          class="flex items-center gap-2 p-2 rounded-lg border transition-all duration-200"
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
            class="w-4 h-4 cursor-pointer"
          />
          <span v-else :class="['w-4 h-4 flex items-center justify-center text-xs', section.completed ? '' : 'hidden']">
            ✓
          </span>
          <span class="text-xs font-medium">{{ section.name }}</span>
        </div>
      </div>
    </div>

    <!-- действия -->
    <div v-if="showActions" class="flex gap-2 pt-3 border-t border-slate-200/50">
      <button
        v-if="isAdminView"
        @click="updateStatus('решен')"
        class="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition text-sm font-medium shadow-md hover:shadow-lg"
      >
        ✓ Решен
      </button>
      <button
        v-if="isAdminView"
        @click="updateStatus('отменен')"
        class="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition text-sm font-medium shadow-md hover:shadow-lg"
      >
        ✕ Отмена
      </button>
      <button
        v-else
        @click="$emit('view-details')"
        class="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition text-sm font-medium shadow-md hover:shadow-lg"
      >
        Подробнее
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
}>()

const { getOrderProgress } = useOrders()

const progress = computed(() => getOrderProgress(props.order.id))

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
    other: 'Другое'
  }
  return labels[type] || type
}

const updateStatus = (status: 'в работе' | 'решен' | 'отменен') => {
  emit('update-status', status)
}

const toggleSection = (sectionId: string) => {
  emit('toggle-section', sectionId)
}
</script>
