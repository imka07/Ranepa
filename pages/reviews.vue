<template>
  <div>
    <HeaderMain />

    <!-- Hero -->
    <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <h1 class="text-5xl font-bold text-white mb-6">Отзывы студентов</h1>
        <p class="text-gray-400 text-xl">Прочитайте, что думают о нас наши клиенты</p>
      </div>
    </div>

    <!-- Reviews Grid -->
    <div class="bg-slate-900 py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="bg-slate-800 border border-white/10 rounded-lg p-6 hover:border-white/20 transition"
          >
            <!-- Rating -->
            <div class="flex gap-1 mb-4">
              <Icon
                v-for="i in 5"
                :key="i"
                :name="i <= review.rating ? 'mdi:star' : 'mdi:star-outline'"
                class="w-5 h-5 text-yellow-400"
              />
            </div>

            <!-- Text -->
            <p class="text-white mb-4 leading-relaxed">{{ review.content }}</p>

            <!-- Author -->
            <div class="border-t border-white/10 pt-4">
              <p class="font-semibold text-white">{{ review.author }}</p>
              <p class="text-sm text-gray-400">{{ review.role }}</p>
              <p class="text-xs text-gray-500 mt-2">{{ formatDate(review.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Review -->
    <div class="bg-slate-800 border-t border-white/10 py-16 px-4">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-white mb-8 text-center">Оставить отзыв</h2>

        <div class="bg-slate-900 border border-white/10 rounded-lg p-8 space-y-4">
          <div>
            <label class="block text-sm font-medium text-white mb-2">Имя</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Ваше имя"
              class="w-full px-4 py-2 bg-slate-800 text-white border border-white/10 rounded-md focus:border-blue-500 focus:outline-none placeholder-gray-400"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-2">Статус</label>
            <select
              v-model="form.role"
              class="w-full px-4 py-2 bg-slate-800 text-white border border-white/10 rounded-md focus:border-blue-500 focus:outline-none"
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
              placeholder="Поделитесь вашим опытом..."
              rows="5"
              class="w-full px-4 py-2 bg-slate-800 text-white border border-white/10 rounded-md focus:border-blue-500 focus:outline-none placeholder-gray-400 resize-none"
            />
          </div>

          <button
            @click="submitReview"
            :disabled="!canSubmit || isSubmitting"
            class="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 transition font-medium"
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
import { ref, computed, onMounted } from 'vue'
import HeaderMain from '~/components/layout/HeaderMain.vue'


const reviews = ref<any[]>([
  {
    id: 1,
    author: 'Анна Петрова',
    role: 'Бакалавриат, 3 курс',
    rating: 5,
    content: 'Отличный сервис! Помогли с курсовой работой, качество на высоте. Менеджер был всегда на связи и отвечал на все вопросы.',
    date: '2026-01-10'
  },
  {
    id: 2,
    author: 'Сергей Иванов',
    role: 'Магистратура',
    rating: 5,
    content: 'Реферат выполнили быстро и качественно. Все сделано в соответствии с требованиями. Спасибо за оперативность!',
    date: '2026-01-08'
  },
  {
    id: 3,
    author: 'Мария Сидорова',
    role: 'Бакалавриат, 4 курс',
    rating: 5,
    content: 'Заказала дипломную работу. Команда профессионалов сделала мне качественный диплом. Очень доволена результатом!',
    date: '2026-01-05'
  },
  {
    id: 4,
    author: 'Илья Смирнов',
    role: 'Специалитет, 5 курс',
    rating: 5,
    content: 'Первый раз заказывал помощь. Был скептичен, но результат превзошёл мои ожидания. Благодарю команду!',
    date: '2026-01-01'
  },
  {
    id: 5,
    author: 'Елена Новикова',
    role: 'Бакалавриат',
    rating: 5,
    content: 'Быстрое решение задач по математике. Все примеры разобраны пошагово. Легко разобраться в материале.',
    date: '2025-12-28'
  },
  {
    id: 6,
    author: 'Дмитрий Кузнецов',
    role: 'Магистратура, 2 курс',
    rating: 5,
    content: 'Профессиональный подход к каждому заказу. Менеджер помог разобраться со всеми нюансами. Рекомендую!',
    date: '2025-12-25'
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const submitReview = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  const newReview = {
    id: reviews.value.length + 1,
    ...form,
    date: new Date().toISOString().split('T')[0]
  }

  reviews.value.unshift(newReview)
  
  // Save to localStorage
  if (process.client) {
    localStorage.setItem('reviews', JSON.stringify(reviews.value))
  }

  // Reset form
  form.name = ''
  form.content = ''
  form.rating = 5

  isSubmitting.value = false
}

onMounted(() => {
  // Load reviews from localStorage if they exist
  if (process.client) {
    const stored = localStorage.getItem('reviews')
    if (stored) {
      reviews.value = JSON.parse(stored)
    }
  }
})
</script>
