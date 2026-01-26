<template>
  <section id="faq" class="w-full py-16 sm:py-20 bg-white">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <!-- Заголовок секции -->
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Часто задаваемые вопросы
        </h2>
        <p class="text-lg text-slate-600">
          Ответы на популярные вопросы о наших услугах
        </p>
      </div>

      <!-- FAQ Аккордеон -->
      <div class="space-y-4">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <button
            @click="toggle(index)"
            class="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none group"
          >
            <h3 class="text-base sm:text-lg font-semibold text-slate-900 pr-4 group-hover:text-blue-600 transition-colors">
              {{ item.question }}
            </h3>
            <svg
              :class="['w-5 h-5 text-slate-600 transition-transform duration-300 flex-shrink-0', openIndex === index ? 'rotate-180' : '']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-if="openIndex === index" class="px-6 pb-4">
              <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
                {{ item.answer }}
              </p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openIndex = ref<number | null>(null)

const faqItems = [
  {
    question: 'Сколько стоит написать диплом?',
    answer: 'Стоимость написания дипломной работы начинается от 15 000 рублей в зависимости от объема, сложности темы и сроков выполнения. Окончательная цена определяется после обсуждения всех требований к работе.'
  },
  {
    question: 'Какие сроки выполнения работ?',
    answer: 'Сроки зависят от типа работы: реферат — от 3 дней, курсовая — от 7 дней, диплом — от 14 дней. Мы можем работать в срочном режиме при необходимости.'
  },
  {
    question: 'Гарантируете ли вы уникальность работы?',
    answer: 'Да, все работы проходят проверку на уникальность через системы Антиплагиат. Мы гарантируем уникальность не менее 70-80% в зависимости от требований вашего учебного заведения. Предоставляем отчет о проверке.'
  },
  {
    question: 'Можно ли вносить правки в готовую работу?',
    answer: 'Да, все правки и доработки вносятся бесплатно в течение 14 дней после сдачи работы. Мы работаем до полного удовлетворения ваших требований.'
  },
  {
    question: 'Как происходит оплата?',
    answer: 'Оплата производится поэтапно: 50% предоплата при начале работы, оставшиеся 50% — после получения готовой работы. Принимаем оплату по карте, через СБП и электронные кошельки.'
  },
  {
    question: 'Как обеспечивается конфиденциальность?',
    answer: 'Все данные клиентов защищены и не передаются третьим лицам. Мы подписываем соглашение о конфиденциальности и гарантируем полную анонимность.'
  },
  {
    question: 'Что будет, если работа не пройдет проверку?',
    answer: 'Мы бесплатно доработаем работу до успешной сдачи. Если преподаватель указал на недочеты, мы их устраним. В случае несоответствия работы заявленным требованиям — вернем деньги.'
  }
]

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

// Schema.org разметка FAQPage
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      })
    }
  ]
})
</script>
