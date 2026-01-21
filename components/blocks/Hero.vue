<template>
  <section :class="['w-full mb-0 mt-0 pb-0', backgroundClass, borderClass]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div :class="['grid items-center gap-10', layoutGridClass]">
        <!-- Text content -->
        <div :class="['space-y-6', textAlignClass]">
          <slot name="eyebrow">
            <p v-if="eyebrow" class="text-xs font-semibold tracking-wider uppercase text-blue-600">
              {{ eyebrow }}
            </p>
          </slot>

          <slot name="title">
            <h1 :class="['font-semibold tracking-tight text-slate-900', titleSizeClass]">
              {{ title }}
            </h1>
          </slot>

          <slot name="subtitle">
            <p class="text-base text-slate-700 leading-relaxed min-h-[3rem]">
              <Transition name="fade" mode="out-in">
                <span class="inline-block" :key="currentIndex">{{ currentSubtitle }}</span>
              </Transition>
            </p>
          </slot>

          <div v-if="hasActions" class="flex flex-wrap items-center gap-3">
            <slot name="actions">
              <UiBaseButton
                v-for="(action, idx) in actions"
                :key="idx"
                :to="action.to"
                :variant="action.variant || (idx === 0 ? 'primary' : 'outline')"
                :size="action.size || 'lg'"
              >
                {{ action.label }}
              </UiBaseButton>
            </slot>
          </div>

          <slot name="additional" />
        </div>

        <!-- Media/3D Cube -->
        <div class="relative w-full flex items-center justify-center py-16">
          <slot name="media">
            <div class="spinner-container">
              <div class="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface Action {
  label: string
  to?: string | Record<string, any>
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'text'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
  subtitles?: string[]
  actions?: Action[]
  imageSrc?: string
  imageAlt?: string
  /** 'left' puts text first then image; 'center' centers text and hides grid split */
  alignment?: 'left' | 'center'
  /** size affects title scale */
  size?: 'sm' | 'md' | 'lg'
  backgroundClass?: string
  borderClass?: string
}>(), {
  eyebrow: 'Reshala',
  title: 'Помощь студентам',
  subtitle: 'Консультации, сопровождение и поддержка по учебным вопросам.',
  subtitles: () => ([
    'Консультации, сопровождение и поддержка по учебным вопросам.',
    'Мы с тобой всегда, на каждом этапе обучения.',
    'Твой успех — наша главная цель и мотивация.',
    'Решаем любые учебные задачи быстро и качественно.'
  ]),
  actions: () => ([
    { label: 'Заказать', to: '/order', variant: 'primary', size: 'lg' }
  ]),
  imageSrc: '',
  imageAlt: 'Иллюстрация',
  alignment: 'left',
  size: 'lg',
  backgroundClass: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
  borderClass: ''
})

const currentSubtitle = ref(props.subtitles[0])
const currentIndex = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

const getNextIndex = (): number => {
  const total = props.subtitles.length
  if (total <= 1) return 0
  let next = Math.floor(Math.random() * total)
  if (next === currentIndex.value) {
    next = (next + 1) % total
  }
  return next
}

const rotateSubtitles = () => {
  const nextIdx = getNextIndex()
  currentIndex.value = nextIdx
  currentSubtitle.value = props.subtitles[nextIdx]
}

onMounted(() => {
  intervalId = setInterval(rotateSubtitles, 4000) // Change every 4 seconds
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const hasActions = computed(() => Array.isArray(props.actions) && props.actions.length > 0)

const layoutGridClass = computed(() => {
  if (props.alignment === 'center') {
    return 'grid-cols-1 text-center py-16 sm:py-20'
  }
  return 'grid-cols-1 lg:grid-cols-2 py-16 sm:py-20'
})

const textAlignClass = computed(() => (props.alignment === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-left'))

const titleSizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-3xl sm:text-4xl'
    case 'md':
      return 'text-4xl sm:text-5xl'
    case 'lg':
    default:
      return 'text-5xl sm:text-6xl'
  }
})
</script>

<style scoped>
/* Smooth fade transition for subtitle */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 400ms ease, transform 400ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@keyframes spinner-y0fdc1 {
  0% {
    transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
  }

  50% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
  }

  100% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
  }
}

.spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  width: 200px;
  height: 200px;
  animation: spinner-y0fdc1 2s infinite ease;
  transform-style: preserve-3d;
}

.spinner > div {
  background-color: rgba(59, 130, 246, 0.15);
  height: 100%;
  position: absolute;
  width: 100%;
  border: 2px solid rgba(59, 130, 246, 0.4);
}

.spinner div:nth-of-type(1) {
  transform: translateZ(-100px) rotateY(180deg);
}

.spinner div:nth-of-type(2) {
  transform: rotateY(-270deg) translateX(50%);
  transform-origin: top right;
}

.spinner div:nth-of-type(3) {
  transform: rotateY(270deg) translateX(-50%);
  transform-origin: center left;
}

.spinner div:nth-of-type(4) {
  transform: rotateX(90deg) translateY(-50%);
  transform-origin: top center;
}

.spinner div:nth-of-type(5) {
  transform: rotateX(-90deg) translateY(50%);
  transform-origin: bottom center;
}

.spinner div:nth-of-type(6) {
  transform: translateZ(100px);
}
</style>