<template>
  <section :class="['w-full mb-0 mt-0 pb-0', backgroundClass, borderClass]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div :class="['grid items-center gap-10', layoutGridClass]">
        <!-- Text content -->
        <div :class="['space-y-6', textAlignClass]">
          <slot name="eyebrow">
            <p v-if="eyebrow" class="text-xs font-semibold tracking-wider uppercase text-blue-700">
              {{ eyebrow }}
            </p>
          </slot>

          <slot name="title">
            <h1 :class="['font-semibold tracking-tight text-gray-900', titleSizeClass]">
              {{ title }}
            </h1>
          </slot>

          <slot name="subtitle">
            <p v-if="subtitle" class="text-base text-gray-600 leading-relaxed">
              {{ subtitle }}
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

        <!-- Media/image -->
        <div v-if="imageSrc || $slots.media" class="relative w-full">
          <slot name="media">
            <img
              :src="imageSrc"
              :alt="imageAlt"
              class="w-120 h-auto object-cover rounded-xl shadow-sm"
            />
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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
  eyebrow: 'Ranepa Help',
  title: 'Помощь студентам РАНХиГС',
  subtitle: 'Консультации, сопровождение и поддержка по учебным вопросам. Быстро, понятно и по делу.',
  actions: () => ([
    { label: 'Начать', to: '/order', variant: 'primary', size: 'lg' },
    { label: 'Узнать больше', to: '/about', variant: 'outline', size: 'lg' }
  ]),
  imageSrc: '',
  imageAlt: 'Иллюстрация',
  alignment: 'left',
  size: 'lg',
  backgroundClass: 'bg-white',
  borderClass: ''
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


