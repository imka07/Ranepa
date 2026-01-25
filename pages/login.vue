<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
      <!-- Логотип -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isLoginMode ? 'Вход в личный кабинет' : 'Регистрация' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isLoginMode ? 'Войдите, чтобы отслеживать свои заказы' : 'Создайте аккаунт для управления заказами' }}
        </p>
      </div>

      <!-- Ошибка -->
      <div v-if="authError" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {{ authError }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Форма -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <!-- Имя (только для регистрации) -->
          <div v-if="!isLoginMode">
            <label for="name" class="sr-only">Имя</label>
            <input
              id="name"
              v-model="formData.name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Ваше имя"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <input
              id="email-address"
              v-model="formData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              :class="[
                'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
                isLoginMode ? 'rounded-t-md' : ''
              ]"
              placeholder="Email адрес"
            />
          </div>

          <!-- Телефон (только для регистрации) -->
          <div v-if="!isLoginMode">
            <label for="phone" class="sr-only">Телефон</label>
            <input
              id="phone"
              v-model="formData.phone"
              name="phone"
              type="tel"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Телефон (опционально)"
            />
          </div>

          <!-- Пароль -->
          <div>
            <label for="password" class="sr-only">Пароль</label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Пароль"
            />
          </div>
        </div>

        <!-- Кнопка отправки -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span v-if="isLoading">Загрузка...</span>
            <span v-else>{{ isLoginMode ? 'Войти' : 'Зарегистрироваться' }}</span>
          </button>
        </div>

        <!-- Переключение режима -->
        <div class="text-center">
          <button
            type="button"
            @click="toggleMode"
            class="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            {{ isLoginMode ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите' }}
          </button>
        </div>

        <!-- Ссылка на главную -->
        <div class="text-center">
          <NuxtLink
            to="/"
            class="text-sm font-medium text-gray-600 hover:text-gray-500 transition-colors"
          >
            ← Вернуться на главную
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const { login, register, loading, error: authError } = useAuth()
const router = useRouter()

const isLoginMode = ref(true)
const isLoading = computed(() => loading.value)

const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: ''
})

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  authError.value = null
  // Очищаем форму при переключении
  if (isLoginMode.value) {
    formData.value.name = ''
    formData.value.phone = ''
  }
}

const handleSubmit = async () => {
  authError.value = null

  if (isLoginMode.value) {
    // Вход
    const success = await login(formData.value.email, formData.value.password)
    if (success) {
      router.push('/dashboard')
    }
  } else {
    // Регистрация
    if (formData.value.password.length < 6) {
      authError.value = 'Пароль должен быть не менее 6 символов'
      return
    }

    const success = await register(
      formData.value.name,
      formData.value.email,
      formData.value.phone,
      formData.value.password
    )

    if (success) {
      router.push('/dashboard')
    }
  }
}
</script>
