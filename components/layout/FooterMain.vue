<template>
  <footer :class="['w-full', backgroundClass, borderClass]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="py-16 lg:py-20 text-center">
        <!-- Logo -->
        <div class="mb-8">
          <slot name="brand">
            <NuxtLink :to="logoHref" class="inline-flex items-center gap-2">
              <img v-if="logoSrc" :src="logoSrc" :alt="logoAlt" class="h-12 w-auto mx-auto" />
              <span v-else class="text-3xl font-light tracking-wide text-slate-900">Reshala</span>
            </NuxtLink>
          </slot>
        </div>

        <!-- Motivational Quote -->
        <div class="max-w-3xl mx-auto space-y-6">
          <p class="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-900 leading-relaxed">
            {{ motivationalText }}
          </p>
          <p class="text-lg text-slate-700 font-light">
            {{ subText }}
          </p>
        </div>

        <!-- Support Link -->
        <div class="mt-10">
          <a 
            :href="telegramUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <svg 
              class="w-5 h-5" 
              fill="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
            </svg>
            <span class="font-medium">Поддержка в Telegram</span>
          </a>
        </div>

        <!-- Copyright -->
        <div class="mt-12 pt-8 border-t border-slate-200/50">
          <p class="text-sm text-slate-600">© {{ currentYear }} {{ copyrightText }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  logoSrc?: string
  logoAlt?: string
  logoHref?: string
  motivationalText?: string
  subText?: string
  backgroundClass?: string
  borderClass?: string
  copyrightText?: string
  telegramUrl?: string
}>(), {
  logoSrc: undefined,
  logoAlt: 'Логотип',
  logoHref: '/',
  motivationalText: 'Твой успех начинается здесь',
  subText: 'Мы помогаем студентам достигать их целей и раскрывать потенциал',
  backgroundClass: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
  borderClass: 'border-t border-slate-200/50',
  copyrightText: 'Reshala',
  telegramUrl: 'https://t.me/reshalloo'
})

const currentYear = new Date().getFullYear()
</script>