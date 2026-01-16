<template>
  <div>
    <HeaderMain />

    <Hero
      eyebrow="Reshala"
      title="Помощь студентам"
      :subtitles="[
        'Консультации, сопровождение и поддержка по учебным вопросам.',
        'Мы с тобой всегда, на каждом этапе обучения.',
        'Твой успех — наша главная цель и мотивация.',
        'Решаем любые учебные задачи быстро и качественно.'
      ]"
      alignment="left"
      size="lg"
    >
      <template #actions>
        <button
          type="button"
          @click="openOrderModal"
          class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
        >
          Заказать
        </button>
      </template>
    </Hero>

    <Features
      id="about"
      heading="Почему выбирают нас"
      subheading="Узнайте о наших преимуществах и особенностях работы."
      :items="[
        {
          title: 'Опытные эксперты',
          description:
            'Работаем с профессионалами, которые знают все тонкости учебного процесса и помогут вам достичь успеха в учёбе.'
        },
        {
          title: 'Современные методы',
          description:
            'Используем передовые подходы к обучению и консультированию, адаптированные под актуальные требования.'
        },
        {
          title: 'Поддержка 24/7',
          description:
            'Всегда на связи для решения ваших вопросов и оказания своевременной помощи в учебном процессе.'
        }
      ]"
    />

    <Testimonials
      id="reviews"
      heading="Отзывы студентов"
      subheading="Нам доверяют."
      :testimonials="[
        { content: 'Отличная помощь!', author: 'Анна', role: 'Бакалавриат', rating: 5 },
        { content: 'Супер быстро.', author: 'Илья', role: 'Магистратура', rating: 5 }
      ]"
      :speed="0.6"
      :pause-on-hover="true"
      :duplicate="3"
      :show-controls="true"
    />

    <LayoutFooterMain />

    <!-- Order Modal -->
    <UiBaseModal v-model="isOrderOpen" title="Оформление заявки" size="2xl" theme="dark">
      <div class="space-y-6 mt-4">
        <!-- Информация о работе -->
        <div class="border-b border-white/10 pb-6">
          <h3 class="text-sm font-semibold text-white mb-4">Информация о работе</h3>

          <!-- Тип работы -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-400 mb-2">
              Тип работы<span class="text-red-500">*</span>
            </label>
              <select
                v-model="form.workType"
                class="w-full px-2 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition appearance-none"
                required
              >
              <option value="" disabled>Выберите тип работы</option>
              <option value="essay">Реферат</option>
              <option value="coursework">Курсовая работа</option>
              <option value="diploma">Дипломная работа</option>
              <option value="abstract">Абстракт</option>
              <option value="presentation">Презентация</option>
              <option value="solution">Решение задач</option>
              <option value="other">Другое</option>
            </select>
          </div>

          <!-- Предмет и Тема в одной строке -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Предмет<span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.subject"
                type="text"
                placeholder="Например: История"
                class="form-input w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Тема<span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.theme"
                type="text"
                placeholder="Например: Черкессы"
                class="form-input w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
                required
              />
            </div>
          </div>

          <!-- Срок выполнения и Объём (страницы) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">
                Срок выполнения<span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.deadline"
                type="date"
                class="form-input w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-100"
                :min="today"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Объём (страницы)<span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.volume"
                type="number"
                placeholder="Например: 10"
                min="1"
                class="form-input w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
                required
              />
            </div>
          </div>
        </div>

        <!-- Требования / методичка -->
        <div class="border-b border-white/10 pb-6">
          <label class="block text-sm font-medium text-white mb-2">Требования / методичка</label>
          <UiFileUploader @select="onFileSelect" @remove="onFileRemove" />
          <p v-if="form.file" class="text-xs text-gray-400 mt-2">
            📎 {{ form.file.name }} ({{ formatFileSize(form.file.size) }})
          </p>
        </div>

        <!-- Комментарий / дополнительные требования -->
        <div class="border-b border-white/10 pb-6">
          <label class="block text-sm font-medium text-white mb-2">Дополнительные требования</label>
          <textarea
            v-model="form.comment"
            placeholder="Опишите дополнительные требования, особенности работы, стиль цитирования и т.д."
            rows="4"
            class="form-input w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400 resize-none"
          />
        </div>

        <!-- Контактные данные клиента -->
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">Контактные данные</h3>

          <div class="mb-4">
            <label class="block text-sm font-medium text-white mb-2">
              Ваше имя<span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Иван"
              class="form-input w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-white mb-2">
              Способ связи<span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2 justify-center">
              <button
                type="button"
                :class="[
                  'flex-1 px-4 py-2 rounded-md text-sm font-medium transition',
                  form.contactType === 'phone'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-gray-200 hover:bg-slate-700 border border-white/10'
                ]"
                @click="form.contactType = 'phone'"
              >
                📱 Телефон
              </button>
              <button
                type="button"
                :class="[
                  'flex-1 px-4 py-2 rounded-md text-sm font-medium transition',
                  form.contactType === 'telegram'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-gray-200 hover:bg-slate-700 border border-white/10'
                ]"
                @click="form.contactType = 'telegram'"
              >
                ✈️ Telegram
              </button>
            </div>
          </div>

          <div v-if="form.contactType === 'phone'" class="mb-4">
            <label class="block text-sm font-medium text-white mb-2">
              Телефон<span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="+7 900 000-00-00"
              class="form-input w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
              required
            />
          </div>

          <div v-if="form.contactType === 'telegram'" class="mb-4">
            <label class="block text-sm font-medium text-white mb-2">
              Telegram<span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.telegram"
              type="text"
              placeholder="@username"
              class="form-input w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Email (опционально)</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="example@mail.com"
              class="form-input w-full px-4 py-2 rounded-md bg-slate-800 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="w-full flex items-center justify-between gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-gray-100 bg-slate-800 rounded-md hover:bg-slate-700 transition border border-white/10"
            @click="closeOrderModal"
            :disabled="isLoading"
          >
            Отмена
          </button>

          <button
            type="button"
            class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50 transition"
            :disabled="!canSubmit || isLoading"
            @click="submitOrder"
          >
            <span v-if="isLoading" class="flex items-center">
              <Icon name="eos-icons:loading" class="w-4 h-4 mr-2" />
              Отправка...
            </span>
            <span v-else>Отправить заявку</span>
          </button>
        </div>
      </template>
    </UiBaseModal>

    <!-- Alert уведомления -->
    <div class="fixed top-4 right-4 z-[10000] space-y-2 max-w-sm">
      <UiBaseAlert
        v-if="alert.show"
        :type="alert.type"
        :title="alert.title"
        :message="alert.message"
        :show="alert.show"
        dismissible
        @dismiss="closeAlert"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderMain from '~/components/layout/HeaderMain.vue'
import Hero from '~/components/blocks/Hero.vue'
import Features from '~/components/blocks/Features.vue'
import Testimonials from '~/components/blocks/Testimonials.vue'
import UiBaseModal from '~/components/ui/BaseModal.vue'
import UiFileUploader from '~/components/ui/FileUploader.vue'
import UiBaseAlert from '~/components/ui/BaseAlert.vue'
import { computed, reactive, ref } from 'vue'

type ContactType = 'phone' | 'telegram'
type WorkType = 'essay' | 'coursework' | 'diploma' | 'abstract' | 'presentation' | 'solution' | 'other' | ''

interface FormData {
  workType: WorkType
  subject: string
  theme: string
  deadline: string
  volume: string
  file: File | null
  comment: string
  name: string
  contactType: ContactType
  phone: string
  telegram: string
  email: string
}

interface TelegramFormData {
  workType: WorkType
  subject: string
  theme: string
  deadline: string
  volume: string
  file: { name: string; size: number; type: string } | null
  fileData?: string
  comment: string
  name: string
  contactType: ContactType
  phone: string
  telegram: string
  email: string
}

useHead({
  title: 'Reshala - Помощь студентам'
})

// Получаем сегодняшнюю дату в формате YYYY-MM-DD для минимума в date input
const today = ref(new Date().toISOString().split('T')[0])

// Состояние формы
const form = reactive<FormData>({
  workType: '',
  subject: '',
  theme: '',
  deadline: '',
  volume: '',
  file: null,
  comment: '',
  name: '',
  contactType: 'phone',
  phone: '',
  telegram: '',
  email: ''
})

// UI состояния
const isOrderOpen = ref(false)
const isLoading = ref(false)

const alert = reactive({
  show: false,
  type: 'success' as 'success' | 'error',
  title: '',
  message: ''
})

let alertTimer: ReturnType<typeof setTimeout> | null = null

// Проверка: все обязательные поля заполнены
const canSubmit = computed(() => {
  const contact = form.contactType === 'phone' ? form.phone : form.telegram
  return Boolean(
    form.workType &&
    form.subject &&
    form.theme &&
    form.deadline &&
    form.volume &&
    form.name &&
    contact
  )
})

const openOrderModal = () => {
  isOrderOpen.value = true
}

const closeOrderModal = () => {
  isOrderOpen.value = false
}

const onFileSelect = (selectedFile: File) => {
  form.file = selectedFile
}

const onFileRemove = () => {
  form.file = null
}

const closeAlert = () => {
  alert.show = false
  if (alertTimer) {
    clearTimeout(alertTimer)
    alertTimer = null
  }
}

const showAlert = (type: 'success' | 'error', title: string, message: string) => {
  closeAlert()

  alert.type = type
  alert.title = title
  alert.message = message
  alert.show = true

  alertTimer = setTimeout(() => {
    closeAlert()
  }, 5000)
}

// Форматирование размера файла в читаемый вид
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') return reject(new Error('FileReader result is not a string'))

      const base64Data = result.split(',')[1]
      if (!base64Data) return reject(new Error('Failed to read file as base64'))

      resolve(base64Data)
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

const resetForm = () => {
  form.workType = ''
  form.subject = ''
  form.theme = ''
  form.deadline = ''
  form.volume = ''
  form.file = null
  form.comment = ''
  form.name = ''
  form.contactType = 'phone'
  form.phone = ''
  form.telegram = ''
  form.email = ''
}

const submitOrder = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const payload: TelegramFormData = {
      workType: form.workType,
      subject: form.subject,
      theme: form.theme,
      deadline: form.deadline,
      volume: form.volume,
      file: form.file
        ? { name: form.file.name, size: form.file.size, type: form.file.type }
        : null,
      comment: form.comment,
      name: form.name,
      contactType: form.contactType,
      phone: form.phone,
      telegram: form.telegram,
      email: form.email
    }

    if (form.file) {
      payload.fileData = await readFileAsBase64(form.file)
    }

    const { error } = await useFetch('/api/send-telegram', {
      method: 'POST',
      body: payload
    })

    if (error.value) {
      throw error.value
    }

    showAlert('success', 'Успешно!', 'Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.')
    closeOrderModal()
    resetForm()
  } catch (err) {
    console.error('Ошибка отправки заявки:', err)
    showAlert(
      'error',
      'Ошибка!',
      'Не удалось отправить заявку. Пожалуйста, попробуйте еще раз или свяжитесь с нами другим способом.'
    )
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Единые стили для всех форм */
.form-input,
.form-select {
  @apply bg-slate-800 text-white border border-white/10 rounded-md px-4 py-2 transition;
}

.form-input:focus,
.form-select:focus {
  @apply border-blue-500 outline-none;
}

/* Placeholder стили */
.form-input::placeholder {
  @apply text-gray-400;
}

/* Стили для date picker иконки календаря - белая */
input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(1.1);
  cursor: pointer;
}

input[type='date']::placeholder {
  @apply text-gray-400;
}

/* Стили для number input спинов */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  @apply appearance-none;
}

input[type='number'] {
  @apply appearance-none;
}

/* Textarea стили */
textarea {
  @apply bg-slate-800 text-white border border-white/10 rounded-md px-4 py-2 transition resize-none;
}

textarea:focus {
  @apply border-blue-500 outline-none;
}

textarea::placeholder {
  @apply text-gray-400;
}
</style>