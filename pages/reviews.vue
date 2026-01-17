<template>
  <div class="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen flex flex-col">
    <HeaderMain />

    <!-- Hero -->
    <div class="py-12 px-4 border-b border-slate-200/50">
      <div class="max-w-6xl mx-auto text-center">
        <h1 class="text-4xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Оставить свой отзыв</h1>
        <p class="text-slate-600">Поделитесь своим опытом с другими студентами</p>
      </div>
    </div>

    <!-- Form -->
    <div class="flex-1 py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-lg p-8 space-y-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Имя</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Ваше имя"
              class="w-full px-4 py-2.5 bg-white text-slate-800 border border-slate-300 rounded-lg focus:border-blue-500 focus:shadow-md focus:outline-none placeholder-slate-400 text-sm shadow-sm transition-all duration-200"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">Прогресс</label>
            <div class="flex gap-2">
              <button
                @click="form.role = 'Решено'"
                :class="[
                  'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition border shadow-sm',
                  form.role === 'Решено'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400 shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-green-300 hover:bg-green-50/50'
                ]"
              >
                ✔ Решено
              </button>
              <button
                @click="form.role = 'Не решено'"
                :class="[
                  'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition border shadow-sm',
                  form.role === 'Не решено'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-red-300 hover:bg-red-50/50'
                ]"
              >
                ✗ Не решено
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">Оценка</label>
            <div class="flex gap-3">
              <button
                v-for="i in 5"
                :key="i"
                @click="form.rating = i"
                type="button"
                class="transition transform hover:scale-110 duration-200"
              >
                <span
                  v-if="i <= form.rating"
                  class="text-3xl text-yellow-400 cursor-pointer drop-shadow-sm"
                >
                  ★
                </span>
                <span
                  v-else
                  class="text-3xl text-slate-300 cursor-pointer hover:text-yellow-300 transition duration-200"
                >
                  ☆
                </span>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Отзыв</label>
            <textarea
              v-model="form.content"
              placeholder="Опишите ваш опыт..."
              rows="5"
              class="w-full px-4 py-2.5 bg-white text-slate-800 border border-slate-300 rounded-lg focus:border-blue-500 focus:shadow-md focus:outline-none placeholder-slate-400 text-sm resize-none shadow-sm transition-all duration-200"
            />
          </div>

          <button
            @click="submitReview"
            :disabled="!canSubmit || isSubmitting"
            class="w-full px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
          >
            <span v-if="isSubmitting">Отправка...</span>
            <span v-else>Отправить отзыв</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-slate-200/50 py-8 px-4 bg-white/40 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto text-center">
        <p class="text-slate-600 text-sm font-medium">© 2026 Reshala. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import HeaderMain from '~/components/layout/HeaderMain.vue'

const form = reactive({
  name: '',
  role: '',
  rating: 0,
  content: ''
})

const isSubmitting = ref(false)

const canSubmit = computed(() => {
  return form.name && form.content && form.rating > 0 && form.role
})

const submitReview = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Актуально отправить на бэкенд
  try {
    await $fetch('/api/reviews', {
      method: 'POST',
      body: form
    })
  } catch (err) {
    console.error('Ошибка при отправке отзыва:', err)
  }

  // Очистим форму
  form.name = ''
  form.content = ''
  form.rating = 0
  form.role = ''

  isSubmitting.value = false
}
</script>