<template>
  <div>
    <HeaderMain />

    <!-- Hero -->
    <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl font-bold text-white mb-4">Отзывы студентов</h1>
        <p class="text-gray-400">Прочитайте, что думают о нас наши клиенты</p>
      </div>
    </div>

    <!-- Reviews Grid -->
    <div class="bg-slate-900 py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="bg-slate-800 border border-white/10 rounded-lg p-5 hover:border-white/20 transition"
          >
            <!-- Rating -->
            <div class="flex gap-1 mb-3">
              <Icon
                v-for="i in 5"
                :key="i"
                :name="i <= review.rating ? 'mdi:star' : 'mdi:star-outline'"
                class="w-4 h-4 text-yellow-400"
              />
            </div>

            <!-- Text -->
            <p class="text-white mb-4 text-sm leading-relaxed">"{{ review.content }}"</p>

            <!-- Author -->
            <div class="border-t border-white/10 pt-3">
              <p class="font-semibold text-white text-sm">{{ review.author }}</p>
              <p class="text-xs text-gray-400">{{ review.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Review Section -->
    <div class="bg-slate-800/50 border-t border-white/10 py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold text-white mb-8 text-center">Оставить свой отзыв</h2>

        <div class="bg-slate-900 border border-white/10 rounded-lg p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-white mb-2">Имя</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Ваше имя"
              class="w-full px-4 py-2 bg-slate-800/50 text-white border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-2">Статус</label>
            <select
              v-model="form.role"
              class="w-full px-4 py-2 bg-slate-800/50 text-white border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
            >
              <option value="Бакалавриат">Бакалавриат</option>
              <option value="Магистратура">Магистратура</option>
              <option value="Специалитет">Специалитет</option>
              <option value="Аспирантура">Аспирантура</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-2">Оценка</label>
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
                  class="w-6 h-6 text-yellow-400 hover:text-yellow-300"
                />
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-2">Отзыв</label>
            <textarea
              v-model="form.content"
              placeholder="Поделитесь своим опытом..."
              rows="4"
              class="w-full px-4 py-2 bg-slate-800/50 text-white border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm resize-none"
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

    <LayoutFooterMain />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import HeaderMain from '~/components/layout/HeaderMain.vue'

const reviews = ref<any[]>([
  {
    id: 1,
    author: 'Анна Петрова',
    role: 'Бакалавриат',
    rating: 5,
    content: 'Отличный сервис! Помогли с курсовой, качество на высоте.'
  },
  {
    id: 2,
    author: 'Сергей Иванов',
    role: 'Магистратура',
    rating: 5,
    content: 'Реферат выполнили быстро и качественно.'
  },
  {
    id: 3,
    author: 'Мария Сидорова',
    role: 'Бакалавриат',
    rating: 5,
    content: 'Заказала диплом, качественный результат.'
  },
  {
    id: 4,
    author: 'Илья Смирнов',
    role: 'Специалитет',
    rating: 5,
    content: 'Превосходная работа, рекомендую!'
  },
  {
    id: 5,
    author: 'Елена Новикова',
    role: 'Магистратура',
    rating: 5,
    content: 'Быстрое решение основного вопроса.'
  },
  {
    id: 6,
    author: 'Дмитрий Кузнецов',
    role: 'Магистратура',
    rating: 5,
    content: 'Профессиональный подход. Нибы поеди к требованиям.'
  }
])

const form = reactive({
  name: '',
  role: 'Бакалавриат',
  rating: 5,
  content: ''
})

const isSubmitting = ref(false)

const canSubmit = computed(() => {
  return form.name && form.content && form.rating > 0
})

const submitReview = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1000))

  const newReview = {
    id: reviews.value.length + 1,
    ...form,
    date: new Date().toISOString().split('T')[0]
  }

  reviews.value.unshift(newReview)
  
  if (process.client) {
    localStorage.setItem('reviews', JSON.stringify(reviews.value))
  }

  form.name = ''
  form.content = ''
  form.rating = 5

  isSubmitting.value = false
}

onMounted(() => {
  if (process.client) {
    const stored = localStorage.getItem('reviews')
    if (stored) {
      reviews.value = JSON.parse(stored)
    }
  }
})
</script>
