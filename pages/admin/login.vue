<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-sm">
      <!-- Лого -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">🔓 Admin Login</h1>
        <p class="text-gray-400">Панель администратора</p>
      </div>

      <!-- Форма входа -->
      <div class="space-y-4 bg-slate-800/50 rounded-lg p-6 border border-white/10">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Email администратора</label>
          <input
            v-model="email"
            type="email"
            placeholder="admin@reshala.com"
            class="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-white mb-2">Пароль</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-500"
            @keyup.enter="handleLogin"
          />
        </div>

        <button
          @click="handleLogin"
          :disabled="isLoading || !email || !password"
          class="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition font-medium text-sm"
        >
          <span v-if="isLoading">Загружка...</span>
          <span v-else>Войти</span>
        </button>

        <p v-if="error" class="text-red-400 text-sm text-center bg-red-900/20 border border-red-900/30 rounded-lg p-3">{{ error }}</p>
      </div>

      <!-- Тестовые данные -->
      <div class="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <p class="text-blue-400 text-xs font-semibold mb-2">🔍 Тестовые учетные данные:</p>
        <div class="space-y-2 text-xs text-gray-400">
          <p><strong class="text-blue-300">Admin:</strong> admin@reshala.com / admin123</p>
          <p><strong class="text-blue-300">Super Admin:</strong> superadmin@reshala.com / superadmin123</p>
        </div>
      </div>

      <!-- Обратная ссылка -->
      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-gray-400 hover:text-white text-sm transition">
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
