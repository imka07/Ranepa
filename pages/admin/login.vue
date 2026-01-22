<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">🔐 Admin</h1>
        <p class="text-slate-600 text-sm">Вход в админ-панель</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-2xl p-8 shadow-lg">
        <!-- Error Alert -->
        <div
          v-if="error"
          class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium"
        >
          ⚠️ {{ error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="admin@reshala.com"
              required
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:border-blue-500 focus:bg-white"
              :disabled="isLoading"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Пароль</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:border-blue-500 focus:bg-white"
              :disabled="isLoading"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-6 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ isLoading ? 'Вход...' : 'Войти' }}</span>
          </button>
        </form>

        <!-- Test Credentials -->
        <div class="mt-6 pt-6 border-t border-slate-200">
          <p class="text-xs text-slate-600 font-medium mb-3">📝 Тестовые учетные данные:</p>
          <div class="space-y-2 text-xs">
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p class="font-mono text-slate-700">admin@reshala.com</p>
              <p class="font-mono text-slate-700">admin123</p>
            </div>
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p class="font-mono text-slate-700">superadmin@reshala.com</p>
              <p class="font-mono text-slate-700">superadmin123</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Link -->
      <div class="text-center mt-6">
        <NuxtLink to="/" class="text-sm text-slate-600 hover:text-slate-900 transition-colors">
          ← Вернуться на главную
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { adminLogin, isAdmin } = useAdmin()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

const handleLogin = async () => {
  // Сброс ошибки
  error.value = null

  // Валидация
  if (!email.value || !password.value) {
    error.value = 'Заполните все поля'
    return
  }

  isLoading.value = true

  try {
    const success = await adminLogin(email.value, password.value)

    if (success) {
      // Успешный логин - перенаправляем на панель
      router.push('/admin')
    } else {
      error.value = 'Неверный email или пароль'
    }
  } catch (err: any) {
    error.value = 'Ошибка при входе: ' + (err.message || 'Unknown error')
  } finally {
    isLoading.value = false
  }
}

// Если уже авторизован, перенаправляем на панель
if (isAdmin.value) {
  router.push('/admin')
}
</script>
