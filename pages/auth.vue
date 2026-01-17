<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Reshala</h1>
        <p class="text-slate-600">Помощь студентам</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 bg-white/50 backdrop-blur-sm rounded-lg p-1 border border-slate-200/50 shadow-sm">
        <button
          :class="[
            'flex-1 px-4 py-2.5 rounded-md font-medium transition text-sm',
            activeTab === 'login'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-800 hover:bg-blue-50/50'
          ]"
          @click="activeTab = 'login'"
        >
          Вход
        </button>
        <button
          :class="[
            'flex-1 px-4 py-2.5 rounded-md font-medium transition text-sm',
            activeTab === 'register'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-800 hover:bg-blue-50/50'
          ]"
          @click="activeTab = 'register'"
        >
          Регистрация
        </button>
      </div>

      <!-- Login Form -->
      <div v-if="activeTab === 'login'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
          <input
            v-model="loginForm.email"
            type="email"
            placeholder="example@mail.com"
            class="w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Пароль</label>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
          />
        </div>

        <button
          @click="handleLogin"
          :disabled="isLoading || !loginForm.email || !loginForm.password"
          class="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
        >
          <span v-if="isLoading">Загружка...</span>
          <span v-else>Войти</span>
        </button>

        <p v-if="error" class="text-red-600 text-sm text-center bg-red-100 border border-red-300 rounded-lg p-3 shadow-sm">{{ error }}</p>
      </div>

      <!-- Register Form -->
      <div v-if="activeTab === 'register'" class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Имя</label>
          <input
            v-model="registerForm.name"
            type="text"
            placeholder="Иван Иванов"
            class="w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
          <input
            v-model="registerForm.email"
            type="email"
            placeholder="example@mail.com"
            class="w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Телефон</label>
          <input
            v-model="registerForm.phone"
            type="tel"
            placeholder="+7 900 000-00-00"
            class="w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Пароль</label>
          <input
            v-model="registerForm.password"
            type="password"
            placeholder="Выберите прочный пароль"
            class="w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
          />
          <p class="text-xs text-slate-500 mt-1">Минимум 6 символов</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Подтвердите пароль</label>
          <input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Тот же пароль"
            class="w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
          />
        </div>

        <button
          @click="handleRegister"
          :disabled="isLoading || !isFormValid"
          class="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
        >
          <span v-if="isLoading">Загружка...</span>
          <span v-else>Зарегистрироваться</span>
        </button>

        <p v-if="error" class="text-red-600 text-sm text-center bg-red-100 border border-red-300 rounded-lg p-3 shadow-sm">{{ error }}</p>
      </div>

      <!-- Back Link -->
      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-slate-600 hover:text-blue-600 text-sm transition font-medium">
          ← Вернуться на главную
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { register: registerUser, login: loginUser, isLoading: authIsLoading } = useAuth()

const activeTab = ref<'login' | 'register'>('login')
const error = ref('')
const isLoading = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
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
    registerForm.password === registerForm.confirmPassword &&
    registerForm.password.length >= 6
  )
})

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const result = await loginUser(loginForm.email, loginForm.password)
    
    if (result.success) {
      await router.push('/dashboard')
    } else {
      error.value = result.error || 'Ошибка входа'
    }
  } catch (err) {
    error.value = 'Ошибка входа'
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  error.value = ''
  
  if (!isFormValid.value) {
    error.value = 'Проверьте все поля. Пароль минимум 6 символов'
    return
  }

  isLoading.value = true

  try {
    const result = await registerUser(
      registerForm.name,
      registerForm.email,
      registerForm.phone,
      registerForm.password
    )

    if (result.success) {
      await router.push('/dashboard')
    } else {
      error.value = result.error || 'Ошибка регистрации'
    }
  } catch (err) {
    error.value = 'Ошибка регистрации'
    console.error('Register error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>
