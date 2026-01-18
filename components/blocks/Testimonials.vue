<template>
  <section :class="['w-full', backgroundClass, borderClass]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div class="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
        <slot name="heading">
          <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{{ heading }}</h2>
        </slot>
        <slot name="subheading">
          <p v-if="subheading" class="mt-4 text-base text-slate-700">{{ subheading }}</p>
        </slot>
      </div>

      <!-- Carousel wrapper -->
      <div
        ref="trackWrapper"
        class="relative overflow-hidden"
        @mouseenter="pause()"
        @mouseleave="play()"
      >
        <!-- Infinite track -->
        <div
          ref="track"
          class="flex items-stretch gap-6 will-change-transform"
          :style="{ transform: `translateX(${translateX}px)` }"
        >
          <template v-for="(t, i) in loopedTestimonials" :key="i">
            <article class="w-80 shrink-0 rounded-xl border border-blue-300/50 bg-gradient-to-br from-blue-50 to-indigo-50/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div class="flex items-center gap-3 mb-4">
                <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-semibold text-white">
                  {{ getInitials(t.author) }}
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-900">{{ t.author }}</p>
                  <p v-if="t.role" class="text-xs text-slate-600">{{ t.role }}</p>
                </div>
              </div>
              <p class="text-sm text-slate-700 leading-relaxed mb-auto">
                {{ t.content }}
              </p>
              <div v-if="t.rating" class="mt-3 flex items-center gap-1 text-yellow-500 font-semibold">
                <span v-for="n in Math.round(t.rating)" :key="n">★</span>
              </div>
            </article>
          </template>
        </div>

        <!-- Gradient edges -->
        <div class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 via-slate-50 to-transparent" />
        <div class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 via-slate-50 to-transparent" />
      </div>

      <!-- Controls and Review Button -->
      <div class="mt-8 flex items-center justify-center gap-3 flex-wrap">
        <!-- <div class="flex gap-3">
          <UiBaseButton v-if="showControls" size="sm" variant="outline" @click="step(-1)">Назад</UiBaseButton>
          <UiBaseButton v-if="showControls" size="sm" variant="outline" @click="step(1)">Вперёд</UiBaseButton>
        </div> -->
        <NuxtLink
          to="/reviews"
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Оставить отзыв
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'

interface Testimonial { content: string; author: string; role?: string; rating?: number }

const props = withDefaults(defineProps<{
  heading?: string
  subheading?: string
  testimonials?: Testimonial[]
  speed?: number
  pauseOnHover?: boolean
  duplicate?: number
  backgroundClass?: string
  borderClass?: string
  showControls?: boolean
}>(), {
  heading: 'Отзывы студентов',
  subheading: 'Что о нас говорят те, кому мы помогли.',
  testimonials: () => ([
    { content: 'Спасибо за оперативную помощь с отчётом! Всё чётко и по делу.', author: 'Анна', role: 'Бакалавриат', rating: 5 },
    { content: 'Подсказали, как оформить работу и сдать вовремя. Рекомендую.', author: 'Илья', role: 'Магистратура', rating: 5 },
    { content: 'Очень понятные объяснения, перестал бояться методичек :)', author: 'Мария', role: '1 курс', rating: 5 },
    { content: 'Помогли структурировать диплом — экономия времени колоссальная.', author: 'Дмитрий', role: 'Выпускник', rating: 5 }
  ]),
  speed: 0.5,
  pauseOnHover: true,
  duplicate: 2,
  backgroundClass: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
  borderClass: '',
  showControls: true
})

const track = ref<HTMLElement | null>(null)
const trackWrapper = ref<HTMLElement | null>(null)
const translateX = ref(0)
let rafId: number | null = null

const loopedTestimonials = computed(() => {
  const list = props.testimonials || []
  return Array.from({ length: Math.max(1, props.duplicate) }).flatMap(() => list)
})

function getInitials(name: string) {
  return name
    .split(' ')
    .map(p => p.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

function animate() {
  translateX.value -= props.speed
  const w = track.value?.scrollWidth || 0
  const wrapperW = trackWrapper.value?.clientWidth || 0
  if (w > 0 && Math.abs(translateX.value) >= w / 2) {
    translateX.value = 0
  }
  rafId = requestAnimationFrame(animate)
}

function play() {
  if (rafId != null) return
  rafId = requestAnimationFrame(animate)
}

function pause() {
  if (!props.pauseOnHover) return
  if (rafId != null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function step(direction: number) {
  translateX.value += direction * -200
}

onMounted(() => {
  play()
})

onBeforeUnmount(() => {
  if (rafId != null) cancelAnimationFrame(rafId)
})

watch(() => props.speed, () => {
  if (rafId != null) {
    cancelAnimationFrame(rafId)
    rafId = null
    play()
  }
})
</script>