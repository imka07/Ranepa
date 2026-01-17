<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-sm">
      <!-- Лого -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">🔓 Admin Login</h1>
        <p class="text-slate-600">Панель администратора</p>
      </div>

      <!-- Форма входа -->
      <div class="space-y-4 bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Емаил администратора</label>
          <input
            v-model="email"
            type="email"
            placeholder="admin@reshala.com"
            class="w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Пароль</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
            @keyup.enter="handleLogin"
          />
        </div>

        <button
          @click="handleLogin"
          :disabled="isLoading || !email || !password"
          class="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
        >
          <span v-if="isLoading">Загружка...</span>
          <span v-else>Войти</span>
        </button>

        <p v-if="error" class="text-red-600 text-sm text-center bg-red-100 border border-red-300 rounded-lg p-3 shadow-sm">{{ error }}</p>
      </div>

      <!-- Тестовые данные -->
      <div class="mt-6 bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-300/50 rounded-lg p-4 shadow-sm">
        <p class="text-blue-700 text-xs font-semibold mb-2">🔍 Тестовые учетные данные:</p>
        <div class="space-y-2 text-xs text-slate-700">
          <p><strong class="text-blue-600">Admin:</strong> admin@reshala.com / admin123</p>
          <p><strong class="text-blue-600">Super Admin:</strong> superadmin@reshala.com / superadmin123</p>
        </div>
      </div>

      <!-- Обратная ссылка -->
      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-slate-600 hover:text-blue-600 text-sm transition font-medium">
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
const { adminLogin } = useAdmin()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const success = adminLogin(email.value, password.value)
    if (success) {
      await router.push('/admin')
    } else {
      error.value = 'Неверные креденциалы администратора'
    }
  } catch (err) {
    error.value = 'Ошибка входа'
  } finally {
    isLoading.value = false
  }
}
</script>