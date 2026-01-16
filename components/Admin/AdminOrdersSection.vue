<template>
  <div>
    <h3 class="text-lg font-semibold text-white mb-4">Управление заказами</h3>
    
    <div v-if="orders.length === 0" class="text-center py-8">
      <p class="text-gray-400">Нет заказов</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="bg-slate-700/30 border border-white/10 rounded-lg p-4">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="text-white font-semibold">{{ order.subject }}</h4>
            <p class="text-gray-400 text-sm">{{ order.userName }} • {{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-green-400">{{ order.price }} ₽</div>
            <div class="text-xs text-gray-400">Order #{{ order.id }}</div>
          </div>
        </div>

        <p class="text-gray-300 text-sm mb-4">{{ order.description }}</p>

        <div class="flex gap-2 items-center flex-wrap">
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              order.status === 'принят' && 'bg-blue-500/30 text-blue-300 border border-blue-500/50',
              order.status === 'в работе' && 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50',
              order.status === 'готов' && 'bg-green-500/30 text-green-300 border border-green-500/50',
              order.status === 'отменен' && 'bg-red-500/30 text-red-300 border border-red-500/50'
            ]"
          >
            {{ order.status }}
          </span>
          
          <select
            @change="updateOrderStatus(order.id, $event.target.value)"
            class="px-3 py-1 rounded-lg bg-slate-600/50 text-white text-xs border border-white/20 focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="принят">Принят</option>
            <option value="в работе">В работе</option>
            <option value="готов">Готов</option>
            <option value="отменен">Отменен</option>
          </select>
          
          <button
            @click="deleteOrder(order.id)"
            class="px-3 py-1 rounded-lg bg-red-600/30 text-red-300 text-xs border border-red-500/50 hover:bg-red-600/50 transition"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminData } from '~/composables/useAdminData'

const { orders, updateOrderStatus: updateStatus, deleteOrder: deleteOrderFunc } = useAdminData()

const updateOrderStatus = (orderId: string, newStatus: string) => {
  updateStatus(orderId, newStatus as any)
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
