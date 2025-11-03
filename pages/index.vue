<template>
  <div>
    <HeaderMain />

    <!-- Success Alert -->
    <div v-if="showSuccessAlert" class="fixed top-4 inset-x-0 z-[10000] flex justify-center px-4">
      <UiBaseAlert
        type="success"
        title="Заявка принята"
        :message="'Спасибо! Мы получили вашу заявку. Наш менеджер свяжется по указанным данным в течение 1 часа.'"
        :dismissible="true"
      />
    </div>



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
          <UiFileUploader @select="onFileSelect" />
          <p v-if="form.file" class="mt-2 text-sm text-gray-400">Выбран файл: {{ form.file.name }}</p>
        </div>
      </div>

      <template #footer>
        <div class="w-full flex items-center justify-between gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-gray-100 bg-slate-800 rounded-md hover:bg-slate-700 transition border border-white/10"
            @click="isOrderOpen = false"
          >
            Отмена
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50 transition"
            :disabled="!canSubmit"
            @click="submitOrder"
          >
            Отправить заявку
          </button>
        </div>
      </template>
    </UiBaseModal>
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

definePageMeta({
  title: "Reshala - Помощь студентам",
});

const isOrderOpen = ref(false)
const showSuccessAlert = ref(false)

const form = ref<{ 
  name: string
  contactType: 'phone' | 'telegram'
  phone: string
  telegram: string
  comment: string
  file: File | null
}>({
  name: '',
  contactType: 'phone',
  phone: '',
  telegram: '',
  comment: '',
  file: null
})

const canSubmit = computed(() => {
  if (!form.value.name) return false
  if (form.value.contactType === 'phone' && !form.value.phone) return false
  if (form.value.contactType === 'telegram' && !form.value.telegram) return false
  return true
})

function onFileSelect(file: File) {
  form.value.file = file
}

async function submitOrder() {
  // TODO: Hook to backend when ready. For now, just close modal.
  isOrderOpen.value = false
  showSuccessAlert.value = true
  // Auto-hide after 5 seconds
  setTimeout(() => { showSuccessAlert.value = false }, 5000)
}

function onCta() {
  navigateTo('/order')
}
</script>