<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Reshala</h1>
        <p class="text-gray-400">Помощь студентам</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 bg-slate-800 rounded-lg p-1">
        <button
          :class="[
            'flex-1 px-4 py-2 rounded-md font-medium transition',
            activeTab === 'login'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          ]"
          @click="activeTab = 'login'"
        >
          Вход
        </button>
        <button
          :class="[
            'flex-1 px-4 py-2 rounded-md font-medium transition',
            activeTab === 'register'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          ]"
          @click="activeTab = 'register'"
        >
          Регистрация
        </button>
      </div>

      <!-- Login Form -->
      <div v-if="activeTab === 'login'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Email</label>
          <input
            v-model="loginForm.email"
            type="email"
            placeholder="example@mail.com"
            class="w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-white mb-2">Пароль</label>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
          />
        </div>

        <button
          @click="handleLogin"
          :disabled="isLoading || !loginForm.email || !loginForm.password"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 transition font-medium"
        >
          <span v-if="isLoading">Загрузка...</span>
          <span v-else>Войти</span>
        </button>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
        <p class="text-gray-400 text-sm text-center">
          Тестовые данные: test@mail.com / password123
        </p>
      </div>

      <!-- Register Form -->
      <div v-if="activeTab === 'register'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Имя</label>
          <input
            v-model="registerForm.name"
            type="text"
            placeholder="Иван"
            class="w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-white mb-2">Email</label>
          <input
            v-model="registerForm.email"
            type="email"
            placeholder="example@mail.com"
            class="w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-white mb-2">Телефон</label>
          <input
            v-model="registerForm.phone"
            type="tel"
            placeholder="+7 900 000-00-00"
            class="w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-white mb-2">Пароль</label>
          <input
            v-model="registerForm.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-white mb-2">Подтверждение пароля</label>
          <input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
          />
        </div>

        <button
          @click="handleRegister"
          :disabled="isLoading || !isFormValid"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 transition font-medium"
        >
          <span v-if="isLoading">Загрузка...</span>
          <span v-else>Зарегистрироваться</span>
        </button>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { register, login } = useAuth()

const activeTab = ref<'login' | 'register'>('login')
const isLoading = ref(false)
const error = ref('')

const loginForm = reactive({
  email: 'test@mail.com',
  password: 'password123'
})

const registerForm = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  return (
    registerForm.name &&
    registerForm.email &&
    registerForm.phone &&
    registerForm.password &&
    registerForm.password === registerForm.confirmPassword
  )
})

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const success = login(loginForm.email, loginForm.password)
    if (success) {
      await router.push('/dashboard')
    } else {
      error.value = 'Неверный email или пароль'
    }
  } catch (err) {
    error.value = 'Ошибка входа'
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  error.value = ''
  if (!isFormValid.value) {
    error.value = 'Заполните все поля корректно'
    return
  }

  isLoading.value = true

  try {
    register(
      registerForm.name,
      registerForm.email,
      registerForm.phone,
      registerForm.password
    )
    await router.push('/dashboard')
  } catch (err) {
    error.value = 'Ошибка регистрации'
  } finally {
    isLoading.value = false
  }
}
</script>
