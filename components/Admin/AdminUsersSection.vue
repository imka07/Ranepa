<template>
  <div>
    <h3 class="text-lg font-semibold text-slate-900 mb-4">Управление пользователями</h3>
    
    <div v-if="users.length === 0" class="text-center py-8">
      <p class="text-slate-600">Нет пользователей</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="user in users" :key="user.id" class="bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg p-4 flex justify-between items-center shadow-md hover:shadow-lg transition-shadow duration-300">
        <div>
          <h4 class="text-white font-semibold">{{ user.name }}</h4>
          <p class="text-blue-100 text-sm">{{ user.email }} • {{ user.phone }}</p>
          <p class="text-xs text-blue-100 mt-1">ID: {{ user.id }} • Зарегистрирован: {{ formatDate(user.createdAt) }}</p>
        </div>
        
        <div class="flex gap-2">
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium text-white',
              user.status === 'активен' && 'bg-green-500/70 border border-green-400',
              user.status === 'заблокирован' && 'bg-red-500/70 border border-red-400'
            ]"
          >
            {{ user.status }}
          </span>
          
          <button
            v-if="user.status === 'активен'"
            @click="blockUser(user.id)"
            class="px-3 py-1 rounded-lg bg-red-600 text-white text-xs border border-red-500 hover:bg-red-700 transition font-medium"
          >
            Заблокировать
          </button>
          
          <button
            v-if="user.status === 'заблокирован'"
            @click="unblockUser(user.id)"
            class="px-3 py-1 rounded-lg bg-green-600 text-white text-xs border border-green-500 hover:bg-green-700 transition font-medium"
          >
            Разблокировать
          </button>
          
          <button
            @click="deleteUser(user.id)"
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

const { users, blockUser: block, unblockUser: unblock, deleteUser: deleteFunc } = useAdminData()

const blockUser = (userId: string) => {
  if (confirm('Вы уверены, что хотите заблокировать этого пользователя?')) {
    block(userId)
  }
}

const unblockUser = (userId: string) => {
  unblock(userId)
}

const deleteUser = (userId: string) => {
  if (confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.')) {
    deleteFunc(userId)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}
</script>