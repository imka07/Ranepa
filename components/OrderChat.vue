<template>
  <div class="flex flex-col h-[600px] bg-white border border-slate-200/50 rounded-lg overflow-hidden shadow-lg">
    <!-- Chat Header -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-4 text-white">
      <h3 class="font-semibold text-lg">Чат с менеджером</h3>
      <p class="text-xs text-blue-100 mt-1">Заказ #{{ orderId }}</p>
    </div>

    <!-- Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="[
          'flex w-max max-w-sm lg:max-w-md rounded-lg px-4 py-2.5 shadow-sm transition-all duration-200 text-sm',
          msg.sender === 'user'
            ? 'ml-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-bl-2xl'
            : 'mr-auto bg-white text-slate-800 border border-slate-200/50 rounded-br-2xl'
        ]"
      >
        <span class="whitespace-pre-wrap leading-relaxed">{{ msg.text }}</span>
      </div>
      <div v-if="messages.length === 0" class="flex items-center justify-center h-full text-slate-400 text-sm text-center">
        <div>
          <Icon name="mdi:chat-outline" class="w-12 h-12 mx-auto mb-2 text-slate-300" />
          <p>Нет сообщений</p>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-slate-200/50 p-4 bg-white">
      <div class="flex gap-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Наберите сообщение..." 
          @keyup.enter="sendMessage"
          class="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-400 text-sm font-medium"
        />
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim()"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md hover:shadow-lg"
        >
          <Icon name="mdi:send" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { Message } from '~/composables/useOrders'

interface Props {
  orderId: string
  messages: Message[]
}

defineProps<Props>()

const emit = defineEmits<{
  'send-message': [text: string]
}>()

const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

// Автоскрол к днище при новых сообщениях
watch(
  () => messagesContainer.value?.scrollHeight,
  async () => {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }
)

const sendMessage = () => {
  if (newMessage.value.trim()) {
    emit('send-message', newMessage.value)
    newMessage.value = ''
  }
}
</script>
