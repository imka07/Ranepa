<template>
  <section :class="['w-full', backgroundClass, borderClass]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div class="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
        <slot name="heading">
          <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">{{ heading }}</h2>
        </slot>
        <slot name="subheading">
          <p v-if="subheading" class="mt-4 text-base text-gray-600">{{ subheading }}</p>
        </slot>
      </div>

      <div :class="gridClass">
        <div
          v-for="(f, idx) in items"
          :key="idx"
          class="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow transition"
        >
          <div class="flex items-start gap-4">
            <div v-if="f.icon" class="shrink-0 text-2xl">{{ f.icon }}</div>
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ f.title }}</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{{ f.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="$slots.actions" class="mt-12 flex justify-center">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface FeatureItem { icon?: string; title: string; description: string }

const props = withDefaults(defineProps<{
  heading?: string
  subheading?: string
  items?: FeatureItem[]
  columns?: 2 | 3 | 4
  backgroundClass?: string
  borderClass?: string
}>(), {
  heading: 'Почему выбирают нас',
  subheading: 'Коротко о наших преимуществах и ценности для студентов.',
  items: () => ([
    { icon: '🎯', title: 'Фокус на результат', description: 'Работаем на конкретные учебные цели и дедлайны.' },
    { icon: '⚡', title: 'Быстро', description: 'Оперативное сопровождение и быстрые ответы на вопросы.' },
    { icon: '🧭', title: 'Понятно', description: 'Объясняем простым языком, без лишней бюрократии.' },
    { icon: '🛡️', title: 'Надёжно', description: 'Сохраняем конфиденциальность и отвечаем за качество.' }
  ]),
  columns: 3,
  backgroundClass: 'bg-gray-50',
  borderClass: ''
})

const gridClass = computed(() => {
  const col = props.columns
  if (col === 2) return 'grid grid-cols-1 sm:grid-cols-2 gap-6'
  if (col === 4) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
  return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
})
</script>


