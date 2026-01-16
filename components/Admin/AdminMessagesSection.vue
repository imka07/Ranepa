<template>
  <div>
    <h3 class="text-lg font-semibold text-white mb-4">Сообщения от пользователей</h3>
    
    <div v-if="messages.length === 0" class="text-center py-8">
      <p class="text-gray-400">Нет сообщений</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="message in messages" :key="message.id" class="bg-slate-700/30 border border-white/10 rounded-lg p-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="text-white font-semibold">{{ message.subject }}</h4>
            <p class="text-gray-400 text-sm">{{ message.userName }} • {{ message.email }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(message.createdAt) }}</p>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              message.status === 'новое' && 'bg-blue-500/30 text-blue-300 border border-blue-500/50',
              message.status === 'прочитано' && 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50',
              message.status === 'ответлено' && 'bg-green-500/30 text-green-300 border border-green-500/50'
            ]"
          >
            {{ message.status }}
          </span>
        </div>

        <p class="text-gray-300 text-sm mb-3 bg-slate-800/50 rounded p-3">{{ message.text }}</p>

        <div class="flex gap-2">
          <button
            v-if="message.status !== 'прочитано'"
            @click="markAsRead(message.id)"
            class="px-3 py-1 rounded-lg bg-blue-600/30 text-blue-300 text-xs border border-blue-500/50 hover:bg-blue-600/50 transition"
          >
            Отметить как прочитано
          </button>
          
          <button
            v-if="message.status !== 'ответлено'"
            @click="markAsAnswered(message.id)"
            class="px-3 py-1 rounded-lg bg-green-600/30 text-green-300 text-xs border border-green-500/50 hover:bg-green-600/50 transition"
          >
            Отметить как ответлено
          </button>
          
          <button
            @click="deleteMessage(message.id)"
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
import { useAdminData } from '~/composables/useAdminData'

const { messages, markMessageAsRead, markMessageAsAnswered, deleteMessage: deleteFunc } = useAdminData()

const markAsRead = (messageId: string) => {
  markMessageAsRead(messageId)
}

const markAsAnswered = (messageId: string) => {
  markMessageAsAnswered(messageId)
}

const deleteMessage = (messageId: string) => {
  if (confirm('Вы уверены, что хотите удалить это сообщение?')) {
    deleteFunc(messageId)
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
