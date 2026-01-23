<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- Card -->
      <div class="bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-xl p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Вход в админку
          </h1>
          <p class="text-slate-500 text-sm">Управление заказами Ranepa</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="admin@reshala.com"
              class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              :disabled="loading"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-semibold text-slate-700 mb-2">
              Пароль
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="••••••••••"
              class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              :disabled="loading"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-red-600 text-sm font-medium">{{ errorMessage }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Вход...</span>
            <span v-else>Войти</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-6 text-center">
          <NuxtLink
            to="/"
            class="text-sm text-slate-500 hover:text-slate-700 transition"
          >
            ← Вернуться на главную
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: false // Отключаем layout для страницы логина
})

const router = useRouter()
const { login, checkAuth } = useAdminAuth()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

// Проверяем, может уже авторизован
onMounted(async () => {
  try {
    const response = await $fetch<{ authenticated: boolean }>('/api/admin/verify', {
      credentials: 'include'
    })
    
    if (response.authenticated) {
      router.push('/admin/orders')
    }
  } catch (error) {
    // Не авторизован - остаемся на странице логина
  }
})

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const result = await login(email.value, password.value)

    if (result.success) {
      // Успешная авторизация - переходим в админку
      await router.push('/admin/orders')
    } else {
      // Отображаем ошибку
      errorMessage.value = result.error || 'Вы ввели неверный пароль, попробуйте еще раз'
    }
  } catch (e: any) {
    console.error('Ошибка входа:', e)
    errorMessage.value = 'Вы ввели неверный пароль, попробуйте еще раз'
  } finally {
    loading.value = false
  }
}
</script>
