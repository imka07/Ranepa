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
          class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
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
            'Работаем с профессионалами, которые знают все тонкости учебного процесса и помогут вам достигнуть успеха в учыбе.'
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
        { content: 'Спасибо за оперативную помощь с отчётом! Всё чётко и по делу.', author: 'Анна', role: 'Бакалавриат', rating: 5 },
        { content: 'Подсказали, как оформить работу и сдать вовремя. Рекомендую.', author: 'Илья', role: 'Магистратура', rating: 5 },
        { content: 'Очень понятные объяснения, перестал бояться методичек :)', author: 'Мария', role: '1 курс', rating: 5 },
        { content: 'Помогли структурировать диплом — экономия времени колоссальная.', author: 'Дмитрий', role: 'Выпускник', rating: 5 }
      ]"
      :speed="0.6"
      :pause-on-hover="true"
      :duplicate="3"
      :show-controls="true"
    />

    <LayoutFooterMain />

    <!-- Order Modal -->
    <UiBaseModal v-model="isOrderOpen" title="Оформление заявки" size="2xl" theme="light">
      <div class="space-y-6 mt-4">
        <!-- Информация о работе -->
        <div class="border-b border-slate-200 pb-6">
          <h3 class="text-sm font-semibold text-slate-800 mb-4">Информация о работе</h3>

          <!-- Тип работы -->
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2 text-slate-700">
              Тип работы<span class="text-red-500">*</span>
            </label>
              <select
                v-model="form.workType"
                class="w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition appearance-none text-sm shadow-sm"
                required
              >
              <option value="" disabled>Выберите тип работы</option>
              <option value="diploma">Диплом</option>
              <option value="coursework">Курсовая работа</option>
              <option value="scientific_article">Научная статья</option>
              <option value="report">Реферат</option>
              <option value="presentation">Презентация</option>
              <option value="exam_help">Помощь на экзамене</option>
              <option value="solution">Решение задач</option>
              <option value="other">Другое</option>
            </select>
          </div>

          <!-- Предмет и Тема в одной строке -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Предмет<span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.subject"
                type="text"
                placeholder="Например: История"
                class="form-input w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Тема<span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.theme"
                type="text"
                placeholder="Например: Черкессы"
                class="form-input w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
                required
              />
            </div>
          </div>

          <!-- Срок выполнения и Объём (страницы) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2 text-slate-700">
                Срок выполнения<span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="form.deadline"
                  type="date"
                  class="form-input form-date-input w-full px-4 py-2.5 pr-10 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition shadow-sm"
                  :min="today"
                  required
                  @focus="isDeadlineFocused = true"
                  @blur="isDeadlineFocused = false"
                />

                <span
                  v-if="!form.deadline && !isDeadlineFocused"
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none sm:hidden"
                >
                  дд.мм.гггг
                </span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Объём (страницы)<span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.volume"
                type="number"
                placeholder="Например: 10"
                min="1"
                class="form-input w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
                required
              />
            </div>
          </div>
        </div>

        <!-- Требования / методичка -->
        <div class="border-b border-slate-200 pb-6">
          <label class="block text-sm font-medium text-slate-700 mb-2">Требования / методичка</label>
          <UiFileUploader @select="onFileSelect" @remove="onFileRemove" />
          <p v-if="form.file" class="text-xs text-slate-600 mt-2">
            📄 {{ form.file.name }} ({{ formatFileSize(form.file.size) }})
          </p>
        </div>

        <!-- Комментарий / дополнительные требования -->
        <div class="border-b border-slate-200 pb-6">
          <label class="block text-sm font-medium text-slate-700 mb-2">Дополнительные требования</label>
          <textarea
            v-model="form.comment"
            placeholder="Опишите дополнительные требования, особенности работы, стиль цитирования и т.д."
            rows="4"
            class="form-input w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm resize-none shadow-sm"
          />
        </div>

        <!-- Контактные данные клиента -->
        <div>
          <h3 class="text-sm font-semibold text-slate-800 mb-4">Контактные данные</h3>

          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Ваше имя<span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Иван"
              class="form-input w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Способ связи<span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2 justify-center">
              <button
                type="button"
                :class="[
                  'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm',
                  form.contactType === 'phone'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-300 hover:bg-blue-50/50'
                ]"
                @click="form.contactType = 'phone'"
              >
                Телефон
              </button>
              <button
                type="button"
                :class="[
                  'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm',
                  form.contactType === 'telegram'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-300 hover:bg-blue-50/50'
                ]"
                @click="form.contactType = 'telegram'"
              >
                Telegram
              </button>
            </div>
          </div>

          <div v-if="form.contactType === 'phone'" class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Телефон<span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="+7 900 000-00-00"
              class="form-input w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
              required
            />
          </div>

          <div v-if="form.contactType === 'telegram'" class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Telegram<span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.telegram"
              type="text"
              placeholder="@username"
              class="form-input w-full px-4 py-2.5 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-blue-500 focus:shadow-md focus:outline-none transition placeholder-slate-400 text-sm shadow-sm"
              required
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="w-full flex items-center justify-between gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white rounded-lg hover:bg-slate-50 transition border border-slate-300 shadow-sm hover:shadow-md"
            @click="closeOrderModal"
            :disabled="isLoading"
          >
            Отмена
          </button>

          <button
            type="button"
            class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
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

useHead({
  title: 'Reshala'
})

const {
  form,
  isOrderOpen,
  isLoading,
  isDeadlineFocused,
  alert,
  today,
  canSubmit,
  openOrderModal,
  closeOrderModal,
  onFileSelect,
  onFileRemove,
  closeAlert,
  formatFileSize,
  submitOrder
} = useOrderForm()
</script>

<style scoped>
/* Единые стили для всех форм */
.form-input,
.form-select {
  @apply bg-white text-slate-800 border border-slate-300 rounded-lg px-4 py-2.5 transition shadow-sm;
  box-sizing: border-box;
}

/* Высота input одинаковая (не влияет на textarea) */
input.form-input {
  min-height: 48px;
}

.form-input:focus,
.form-select:focus {
  @apply border-blue-500 outline-none shadow-md;
}

/* Placeholder стили */
.form-input::placeholder {
  @apply text-slate-400;
}

/* Date input специальные стили для мобильных */
.form-date-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font-size: 16px; /* Предотвращает автоскалирование на мобильных */
}

/* Выравнивание внутреннего текста date input (Safari/iOS) */
.form-date-input::-webkit-datetime-edit,
.form-date-input::-webkit-datetime-edit-fields-wrapper,
.form-date-input::-webkit-date-and-time-value {
  padding: 0;
  margin: 0;
  line-height: 1.25;
}

.form-date-input::-webkit-date-and-time-value {
  text-align: left;
}

.form-date-input::-webkit-outer-spin-button,
.form-date-input::-webkit-inner-spin-button {
  display: none;
}

/* Стили для date picker иконки календаря - черная */
input[type='date']::-webkit-calendar-picker-indicator {
  cursor: pointer;
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.25rem;
}

input[type='date']::placeholder {
  @apply text-slate-400;
}

/* Стили для number input спинов */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  @apply appearance-none;
}

input[type='number'] {
  @apply appearance-none;
  font-size: 16px; /* Предотвращает автоскалирование на мобильных */
}

/* Textarea стили */
textarea {
  @apply bg-white text-slate-800 border border-slate-300 rounded-lg px-4 py-2.5 transition resize-none shadow-sm;
  box-sizing: border-box;
  font-size: 16px; /* Предотвращает автоскалирование на мобильных */
}

textarea:focus {
  @apply border-blue-500 outline-none shadow-md;
}

textarea::placeholder {
  @apply text-slate-400;
}

/* Мобильные стили */
@media (max-width: 640px) {
  .form-input,
  .form-select {
    font-size: 16px; /* Гарантирует 16px на мобильных для предотвращения масштабирования */
    padding: 0.75rem 1rem; /* Немного больше padding для удобства */
  }

  .form-date-input {
    padding: 0.75rem 1rem;
  }

  input[type='date']::-webkit-calendar-picker-indicator {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>