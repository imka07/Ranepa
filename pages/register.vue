<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Заголовок -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Регистрация
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Уже есть аккаунт?
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            Войти
          </NuxtLink>
        </p>
      </div>

      <!-- Форма регистрации -->
      <div class="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Имя -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Имя
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Иван Иванов"
            />
          </div>

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

          <!-- Телефон -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              required
              class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <!-- Пароль -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Пароль
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

          <!-- Ошибка -->
          <div v-if="authError" class="rounded-xl bg-red-50 border border-red-200 p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="ml-3 text-sm text-red-800">{{ authError }}</p>
            </div>
          </div>

          <!-- Кнопка регистрации -->
          <div>
            <button
              type="submit"
              :disabled="authLoading"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="authLoading" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Регистрация...
              </span>
              <span v-else>
                Зарегистрироваться
              </span>
            </button>
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

const { register, error: authError, loading: authLoading } = useAuth()
const router = useRouter()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')

const handleRegister = async () => {
  const success = await register(name.value, email.value, phone.value, password.value)
  
  if (success) {
    router.push('/dashboard')
  }
}
</script>
