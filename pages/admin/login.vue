<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-sm text-center">
      <!-- Лого -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">🔓 Admin</h1>
        <p class="text-slate-600">Перенаправление в админ-панель...</p>
      </div>

      <!-- Анимация загружки -->
      <div class="flex justify-center mb-6">
        <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>

      <p class="text-slate-600 text-sm">Подождите...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// Redirecting to admin panel immediately
onMounted(() => {
  router.push('/admin')
})
</script>
