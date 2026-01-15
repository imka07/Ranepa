<template>
  <div class="bg-slate-900 min-h-screen flex flex-col">
    <HeaderMain />

    <!-- Hero -->
    <div class="py-12 px-4 border-b border-white/10">
      <div class="max-w-6xl mx-auto text-center">
        <h1 class="text-4xl font-bold text-white mb-4">Оставить свой отзыв</h1>
        <p class="text-gray-400">Поделитесь своим опытом с другими студентами</p>
      </div>
    </div>

    <!-- Form -->
    <div class="flex-1 py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="bg-slate-800 border border-white/10 rounded-lg p-8 space-y-5">
          <div>
            <label class="block text-sm font-medium text-white mb-2">Имя</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Ваше имя"
              class="w-full px-4 py-2 bg-slate-700/50 text-white border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-3">Прогресс</label>
            <div class="flex gap-2">
              <button
                @click="form.role = 'Решено'"
                :class="[
                  'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition border',
                  form.role === 'Решено'
                    ? 'bg-green-600 text-white border-green-500'
                    : 'bg-slate-700/50 text-gray-300 border-white/10 hover:border-white/20'
                ]"
              >
                ✅ Решено
              </button>
              <button
                @click="form.role = 'Не решено'"
                :class="[
                  'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition border',
                  form.role === 'Не решено'
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-slate-700/50 text-gray-300 border-white/10 hover:border-white/20'
                ]"
              >
                ❌ Не решено
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-3">Оценка</label>
            <div class="flex gap-2">
              <button
                v-for="i in 5"
                :key="i"
                @click="form.rating = i"
                type="button"
                class="transition"
              >
                <Icon
                  :name="i <= form.rating ? 'mdi:star' : 'mdi:star-outline'"
                  class="w-6 h-6 text-yellow-400 hover:text-yellow-300 cursor-pointer"
                />
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-2">Отзыв</label>
            <textarea
              v-model="form.content"
              placeholder="Опишите ваш опыт..."
              rows="5"
              class="w-full px-4 py-2 bg-slate-700/50 text-white border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm resize-none"
            />
          </div>

          <button
            @click="submitReview"
            :disabled="!canSubmit || isSubmitting"
            class="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition font-medium text-sm"
          >
            <span v-if="isSubmitting">Отправка...</span>
            <span v-else>Отправить отзыв</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-white/10 py-8 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <p class="text-gray-400 text-sm">© 2026 Reshala. Все права защищены.</p>
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
  rating: 5,
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
  form.rating = 5
  form.role = ''

  isSubmitting.value = false
}
</script>
