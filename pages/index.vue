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
          @click="isOrderOpen = true"
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
          description: 'Работаем с профессионалами, которые знают все тонкости учебного процесса и помогут вам достичь успеха в учёбе.'
        },
        { 
          title: 'Современные методы', 
          description: 'Используем передовые подходы к обучению и консультированию, адаптированные под актуальные требования.'
        },
        { 
          title: 'Поддержка 24/7', 
          description: 'Всегда на связи для решения ваших вопросов и оказания своевременной помощи в учебном процессе.'
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
    <UiBaseModal
      v-model="isOrderOpen"
      title="Оформление заявки"
      size="xl"
      theme="dark"
    >
      <div class="space-y-6 mt-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UiBaseInput
            v-model="form.name"
            label="Ваше имя"
            placeholder="Иван"
            required
          />

          <div>
            <label class="block text-sm font-medium text-white mb-1">Способ связи<span class="text-red-500">*</span></label>
            <div class="flex gap-2 justify-center">
              <button
                type="button"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition',
                  form.contactType === 'phone' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-200 hover:bg-slate-700 border border-white/10'
                ]"
                @click="form.contactType = 'phone'"
              >
                Телефон
              </button>
              <button
                type="button"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition',
                  form.contactType === 'telegram' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-200 hover:bg-slate-700 border border-white/10'
                ]"
                @click="form.contactType = 'telegram'"
              >
                Telegram
              </button>
            </div>
          </div>

          <UiBaseInput
            v-if="form.contactType === 'phone'"
            v-model="form.phone"
            label="Телефон"
            placeholder="+7 900 000-00-00"
            required
          />
          
          <UiBaseInput
            v-if="form.contactType === 'telegram'"
            v-model="form.telegram"
            label="Telegram"
            placeholder="@username"
            required
          />
        </div>

        <UiBaseTextarea
          v-model="form.comment"
          label="Комментарий"
          placeholder="Опишите задачу, сроки и требования"
          :rows="5"
        />

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Материалы</label>
          <UiFileUploader 
            @select="onFileSelect" 
            @remove="onFileRemove"
          />
        </div>
      </div>

      <template #footer>
        <div class="w-full flex items-center justify-between gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-gray-100 bg-slate-800 rounded-md hover:bg-slate-700 transition border border-white/10"
            @click="isOrderOpen = false"
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
import { navigateTo } from '#imports'
import Hero from '~/components/blocks/Hero.vue';
import Features from '~/components/blocks/Features.vue';
import Testimonials from '~/components/blocks/Testimonials.vue';
import UiBaseModal from '~/components/ui/BaseModal.vue'
import UiBaseInput from '~/components/ui/BaseInput.vue'
import UiBaseTextarea from '~/components/ui/BaseTextarea.vue'
import UiFileUploader from '~/components/ui/FileUploader.vue'
import UiBaseAlert from '~/components/ui/BaseAlert.vue'
import { ref, computed } from 'vue'

// Типы для формы
interface FormData {
  name: string
  phone: string
  telegram: string
  contactType: 'phone' | 'telegram'
  comment: string
  file: File | null
}

interface TelegramFormData {
  name: string
  phone: string
  telegram: string
  contactType: 'phone' | 'telegram'
  comment: string
  file: {
    name: string
    size: number
    type: string
  } | null
  fileData?: string
}

definePageMeta({
  title: "Reshala - Помощь студентам",
});

// Состояние формы
const form = reactive<FormData>({
  name: '',
  phone: '',
  telegram: '',
  contactType: 'phone',
  comment: '',
  file: null
})

// Состояние модалки
const isOrderOpen = ref(false)

// Состояние загрузки
const isLoading = ref(false)

// Состояние уведомления
const alert = reactive({
  show: false,
  type: 'success' as 'success' | 'error',
  title: '',
  message: ''
})

// Вычисляемое свойство для проверки возможности отправки
const canSubmit = computed(() => {
  return form.name && 
    (form.contactType === 'phone' ? form.phone : form.telegram)
})

// Обработчик выбора файла
const onFileSelect = (selectedFile: File) => {
  form.file = selectedFile
}

// Обработчик удаления файла
const onFileRemove = () => {
  form.file = null
}

// Функция показа уведомления
const showAlert = (type: 'success' | 'error', title: string, message: string) => {
  alert.type = type
  alert.title = title
  alert.message = message
  alert.show = true
  
  // Автоматически скрыть через 5 секунд
  setTimeout(() => {
    closeAlert()
  }, 5000)
}

// Функция закрытия уведомления
const closeAlert = () => {
  alert.show = false
}

// Функция для чтения файла как base64
const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Убираем префикс data:application/...;base64,
        const base64 = reader.result
        const base64Data = base64.split(',')[1]
        if (base64Data) {
          resolve(base64Data)
        } else {
          reject(new Error('Failed to read file as base64'))
        }
      } else {
        reject(new Error('FileReader result is not a string'))
      }
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    reader.readAsDataURL(file)
  })
}

// Обработчик отправки формы
const submitOrder = async () => {
  if (isLoading.value) return
  
  isLoading.value = true

  try {
    // Подготовка данных для отправки
    const formData: TelegramFormData = {
      name: form.name,
      phone: form.phone,
      telegram: form.telegram,
      contactType: form.contactType,
      comment: form.comment,
      file: form.file ? {
        name: form.file.name,
        size: form.file.size,
        type: form.file.type
      } : null
    }

    // Если есть файл, добавляем его данные
    if (form.file) {
      // Читаем файл как base64
      const fileData = await readFileAsBase64(form.file)
      formData.fileData = fileData
    }

    const { data, error } = await useFetch('/api/send-telegram', {
      method: 'POST',
      body: formData
    })

    if (error.value) {
      throw error.value
    }

    // Показываем уведомление об успехе
    showAlert(
      'success', 
      'Успешно!', 
      'Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.'
    )
    
    // Закрываем модалку
    isOrderOpen.value = false
    
    // Сбрасываем форму
    resetForm()
    
  } catch (error: any) {
    console.error('Ошибка отправки заявки:', error)
    
    // Показываем уведомление об ошибке
    showAlert(
      'error', 
      'Ошибка!', 
      'Не удалось отправить заявку. Пожалуйста, попробуйте еще раз или свяжитесь с нами другим способом.'
    )
  } finally {
    isLoading.value = false
  }
}

// Сброс формы
const resetForm = () => {
  form.name = ''
  form.phone = ''
  form.telegram = ''
  form.contactType = 'phone'
  form.comment = ''
  form.file = null
}

function onCta() {
  navigateTo('/order')
}
</script>