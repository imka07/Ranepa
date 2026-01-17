<template>
  <div>
    <h3 class="text-lg font-semibold text-slate-900 mb-4">Управление заказами</h3>
    
    <div v-if="orders.length === 0" class="text-center py-8">
      <p class="text-slate-600">Нет заказов</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="text-white font-semibold text-lg">{{ order.subject }}</h4>
            <p class="text-blue-100 text-sm">{{ order.userName }} • {{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-green-300">{{ order.price }} ₽</div>
            <div class="text-xs text-blue-100">Order #{{ order.id }}</div>
          </div>
        </div>

        <p class="text-blue-50 text-sm mb-4">{{ order.description }}</p>

        <div class="flex gap-2 items-center flex-wrap">
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium text-white',
              order.status === 'принят' && 'bg-yellow-500/70 border border-yellow-400',
              order.status === 'в работе' && 'bg-orange-500/70 border border-orange-400',
              order.status === 'готов' && 'bg-green-500/70 border border-green-400',
              order.status === 'отменен' && 'bg-red-500/70 border border-red-400'
            ]"
          >
            {{ order.status }}
          </span>
          
          <select
            @change="handleStatusChange(order.id, $event)"
            class="px-3 py-1 rounded-lg bg-white/20 text-white text-xs border border-blue-300 focus:border-white focus:outline-none cursor-pointer hover:bg-white/30 transition"
          >
            <option value="принят" class="bg-slate-900">Принят</option>
            <option value="в работе" class="bg-slate-900">В работе</option>
            <option value="готов" class="bg-slate-900">Готов</option>
            <option value="отменен" class="bg-slate-900">Отменен</option>
          </select>
          
          <button
            @click="deleteOrder(order.id)"
            class="px-3 py-1 rounded-lg bg-red-600 text-white text-xs border border-red-500 hover:bg-red-700 transition font-medium"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminData } from '~/composables/useAdminData'
import type { Order } from '~/composables/useAdminData'

const { orders, updateOrderStatus: updateStatus, deleteOrder: deleteOrderFunc } = useAdminData()

const handleStatusChange = (orderId: string, event: Event) => {
  const target = event.target as HTMLSelectElement | null
  if (target && target.value) {
    updateStatus(orderId, target.value as Order['status'])
  }
}

const deleteOrder = (orderId: string) => {
  if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
    deleteOrderFunc(orderId)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>