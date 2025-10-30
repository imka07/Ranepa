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
      <a 
        href="/order" 
        class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
      >
        Заказать
      </a>
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
  </div>
</template>


<script setup lang="ts">
import HeaderMain from '~/components/layout/HeaderMain.vue'
import { navigateTo } from '#imports'
import Hero from '~/components/blocks/Hero.vue';
import Features from '~/components/blocks/Features.vue';
import Testimonials from '~/components/blocks/Testimonials.vue';

definePageMeta({
  title: "Reshala - Помощь студентам",
});

function onCta() {
  navigateTo('/order')
}
</script>