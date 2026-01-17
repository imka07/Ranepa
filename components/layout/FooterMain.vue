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
}>(), {
  logoSrc: undefined,
  logoAlt: 'Логотип',
  logoHref: '/',
  motivationalText: 'Твой успех начинается здесь',
  subText: 'Мы помогаем студентам достигать их целей и раскрывать потенциал',
  backgroundClass: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
  borderClass: 'border-t border-slate-200/50',
  copyrightText: 'Reshala'
})

const currentYear = new Date().getFullYear()
</script>