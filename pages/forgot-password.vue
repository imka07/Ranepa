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
          Восстановление пароля
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Введите email, на который зарегистрирован аккаунт
        </p>
      </div>

      <!-- Форма восстановления -->
      <div class="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
        <!-- Сообщение об успехе -->
        <div v-if="emailSent" class="mb-6">
          <div class="rounded-xl bg-green-50 border border-green-200 p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Письмо отправлено!
                </h3>
                <p class="mt-2 text-sm text-green-700">
                  Проверьте почту <strong>{{ email }}</strong> и перейдите по ссылке для сброса пароля.
                </p>
                <p class="mt-2 text-xs text-green-600">
                  Если письмо не пришло, проверьте папку "Спам"
                </p>
              </div>
            </div>
          </div>
          
          <div class="mt-6 text-center">
            <NuxtLink
              to="/login"
              class="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              ← Вернуться к входу
            </NuxtLink>
          </div>
        </div>

        <!-- Форма -->
        <form v-else @submit.prevent="handleResetRequest" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="your@email.com"
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

          <!-- Кнопка отправки -->
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
                Отправка...
              </span>
              <span v-else>
                Отправить ссылку для сброса
              </span>
            </button>
          </div>

          <!-- Ссылки -->
          <div class="text-center space-y-2">
            <NuxtLink
              to="/login"
              class="block text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              ← Вернуться к входу
            </NuxtLink>
            <p class="text-sm text-gray-600">
              Нет аккаунта?
              <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500">
                Зарегистрироваться
              </NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const email = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const emailSent = ref(false)

const supabase = useSupabase()

const handleResetRequest = async () => {
  if (!email.value) {
    error.value = 'Введите email'
    return
  }

  if (!supabase) {
    error.value = 'Ошибка инициализации. Перезагрузите страницу'
    return
  }

  loading.value = true
  error.value = null

  try {
    // Отправляем запрос на сброс пароля через Supabase
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.value,
      {
        redirectTo: `${window.location.origin}/reset-password`
      }
    )

    if (resetError) {
      throw resetError
    }

    // Показываем сообщение об успехе
    emailSent.value = true
    console.log('✅ Письмо для сброса пароля отправлено на:', email.value)
  } catch (err: any) {
    console.error('❌ Ошибка отправки письма:', err)
    
    // Переводим ошибки на русский
    if (err.message?.includes('User not found')) {
      error.value = 'Пользователь с таким email не найден'
    } else if (err.message?.includes('Email rate limit')) {
      error.value = 'Превышен лимит запросов. Попробуйте позже'
    } else {
      error.value = err.message || 'Не удалось отправить письмо. Попробуйте позже'
    }
  } finally {
    loading.value = false
  }
}
</script>
