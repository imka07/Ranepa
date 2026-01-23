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
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-red-600 text-sm font-medium">{{ error }}</p>
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
const { login, isAuthenticated } = useAdminAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Если уже авторизован - редиректим на админку
onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/admin/orders')
  }
})

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await login(email.value, password.value)

    if (result.success) {
      // Успешная авторизация - переходим в админку
      await router.push('/admin/orders')
    } else {
      error.value = result.error || 'Ошибка входа'
    }
  } catch (e: any) {
    error.value = 'Произошла ошибка при входе'
  } finally {
    loading.value = false
  }
}
</script>
