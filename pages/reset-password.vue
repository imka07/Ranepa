<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Логотип и заголовок -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ranepa
          </h1>
        </NuxtLink>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Новый пароль
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Введите новый пароль для вашего аккаунта
        </p>
      </div>

      <!-- Форма установки нового пароля -->
      <div class="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
        <!-- Сообщение об успехе -->
        <div v-if="passwordUpdated" class="space-y-6">
          <div class="rounded-xl bg-green-50 border border-green-200 p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Пароль успешно изменен!
                </h3>
                <p class="mt-2 text-sm text-green-700">
                  Теперь вы можете войти с новым паролем
                </p>
              </div>
            </div>
          </div>
          
          <NuxtLink
            to="/login"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            Перейти ко входу
          </NuxtLink>
        </div>

        <!-- Форма -->
        <form v-else @submit.prevent="handlePasswordReset" class="space-y-6">
          <!-- Новый пароль -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Новый пароль
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Минимум 6 символов"
            />
          </div>

          <!-- Подтверждение пароля -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Подтвердите пароль
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Повторите пароль"
            />
          </div>

          <!-- Ошибка -->
          <div v-if="error" class="rounded-xl bg-red-50 border border-red-200 p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="ml-3 text-sm text-red-800">{{ error }}</p>
            </div>
          </div>

          <!-- Кнопка сохранения -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Сохранение...
              </span>
              <span v-else>
                Сохранить новый пароль
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

definePageMeta({
  layout: false
})

const config = useRuntimeConfig()
const router = useRouter()
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const passwordUpdated = ref(false)

const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
)

const handlePasswordReset = async () => {
  // Валидация
  if (password.value.length < 6) {
    error.value = 'Пароль должен быть не менее 6 символов'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  loading.value = true
  error.value = null

  try {
    // Обновляем пароль через Supabase
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.value
    })

    if (updateError) {
      throw updateError
    }

    // Показываем сообщение об успехе
    passwordUpdated.value = true
    console.log('✅ Пароль успешно обновлен')

    // Перенаправляем на страницу входа через 2 секунды
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err: any) {
    console.error('❌ Ошибка обновления пароля:', err)
    
    // Переводим ошибки на русский
    if (err.message?.includes('same as the old password')) {
      error.value = 'Новый пароль должен отличаться от старого'
    } else if (err.message?.includes('Password should be at least')) {
      error.value = 'Пароль должен быть не менее 6 символов'
    } else {
      error.value = err.message || 'Не удалось обновить пароль. Попробуйте позже'
    }
  } finally {
    loading.value = false
  }
}
</script>
