<template>
  <div>
    <HeaderMain
    logo-src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcS1T41KgKPnlmbfjkCu73ImwULFtBJONRBm6z-dqlgGXYVI2KokGYfoYX4bLUmK48C7Y&usqp=CAU"
    logo-alt="Ranepa Help"
    />



    <Hero
    eyebrow="Ranepa Help"
    title="Помощь студентам РАНХиГС"
    subtitle="Консультации, сопровождение и поддержка по учебным вопросам."
    :actions="[
    { label: 'Начать', to: '/order', variant: 'primary', size: 'lg' },
    { label: 'Узнать больше', to: '/about', variant: 'outline', size: 'lg' }
    ]"
    image-src="/girl.png"
    image-alt="Студенты РАНХиГС"
    alignment="left"
    size="lg"/>

    <Features
    heading="Почему выбирают нас"
    subheading="Коротко о наших преимуществах."
    :items="[
      { icon: '🎯', title: 'Фокус', description: 'Работаем на результат.' },
      { icon: '⚡', title: 'Быстро', description: 'Оперативно и чётко.' },
      { icon: '🛡️', title: 'Надёжно', description: 'Конфиденциально.' }
    ]"
    :columns="3"
  />

  <Testimonialsr
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




    <LayoutFooterMain
  :logo-src="'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcS1T41KgKPnlmbfjkCu73ImwULFtBJONRBm6z-dqlgGXYVI2KokGYfoYX4bLUmK48C7Y&usqp=CAU'"
  logo-alt="Ranepa Help"
  :nav-sections="[
    { title: 'Компания', items: [{ label: 'О нас', href: '/about' }] },
    { title: 'Поддержка', items: [{ label: 'FAQ', href: '/faq' }] }
  ]"
  address="Москва, пр-т Вернадского, 82"
  phone="+7 (999) 123-45-67"
  email="hello@ranepa.help"
/>
  </div>
</template>


<script setup lang="ts">
import HeaderMain from '~/components/layout/HeaderMain.vue'
import { navigateTo } from '#imports'
import Hero from '~/components/blocks/Hero.vue';
import Features from '~/components/blocks/Features.vue';
import Testimonials from '~/components/blocks/Testimonials.vue';

definePageMeta({
  title: "Ranepa Help - Modal Demo",
});

function onCta() {
  navigateTo('/order')
}
</script>