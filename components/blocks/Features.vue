<template>
  <section :class="['w-full', backgroundClass, borderClass]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div class="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
        <slot name="heading">
          <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-white">{{ heading }}</h2>
        </slot>
        <slot name="subheading">
          <p v-if="subheading" class="mt-4 text-base text-gray-300">{{ subheading }}</p>
        </slot>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Card 1 - Blue, Large -->
        <div 
          v-if="items[0]"
          class="relative rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 lg:p-10 flex flex-col justify-between min-h-[400px] group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
        >
          <div class="space-y-4">
            <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <h3 class="text-3xl font-bold text-white tracking-tight">{{ items[0].title }}</h3>
            <p class="text-lg text-blue-100 leading-relaxed">{{ items[0].description }}</p>
          </div>
          
          <div class="flex items-center mt-8">
            <div class="flex -space-x-3">
              <!-- Avatar 1 -->
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-blue-600 flex items-center justify-center overflow-hidden">
                <svg class="w-full h-full" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="18" r="8" fill="white" opacity="0.9"/>
                  <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="white" opacity="0.9"/>
                </svg>
              </div>
              <!-- Avatar 2 -->
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 border-2 border-blue-600 flex items-center justify-center overflow-hidden">
                <svg class="w-full h-full" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="18" r="8" fill="white" opacity="0.9"/>
                  <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="white" opacity="0.9"/>
                </svg>
              </div>
              <!-- Avatar 3 -->
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-2 border-blue-600 flex items-center justify-center overflow-hidden">
                <svg class="w-full h-full" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="18" r="8" fill="white" opacity="0.9"/>
                  <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="white" opacity="0.9"/>
                </svg>
              </div>
              <!-- Avatar 4 -->
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-blue-600 flex items-center justify-center overflow-hidden">
                <svg class="w-full h-full" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="18" r="8" fill="white" opacity="0.9"/>
                  <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="white" opacity="0.9"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Card 2 - Blue, Medium -->
          <div 
            v-if="items[1]"
            class="relative rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 flex flex-col justify-between min-h-[190px] group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
          >
            <h3 class="text-3xl font-bold text-white tracking-tight mb-4">{{ items[1].title }}</h3>
            <p class="text-lg text-blue-100 leading-relaxed">{{ items[1].description }}</p>
          </div>

          <!-- Card 3 - Light Gray, Medium -->
          <div 
            v-if="items[2]"
            class="relative rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex flex-col justify-between min-h-[190px] group hover:shadow-2xl transition-all duration-300"
          >
            <h3 class="text-3xl font-bold text-gray-900 tracking-tight mb-4">{{ items[2].title }}</h3>
            <p class="text-lg text-gray-700 leading-relaxed">{{ items[2].description }}</p>
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
interface FeatureItem { 
  icon?: string
  title: string
  description: string
}

const props = withDefaults(defineProps<{
  heading?: string
  subheading?: string
  items?: FeatureItem[]
  backgroundClass?: string
  borderClass?: string
}>(), {
  heading: 'Почему выбирают нас',
  subheading: 'Коротко о наших преимуществах и ценности для студентов.',
  items: () => ([
    { 
      title: 'Опытные эксперты', 
      description: 'Работаем с профессионалами, которые знают все тонкости учебного процесса и помогут вам достичь целей.'
    },
    { 
      title: 'Современные методы', 
      description: 'Используем передовые подходы к обучению, адаптированные под требования вуза.'
    },
    { 
      title: 'Нетворкинг', 
      description: 'Помогаем установить полезные связи и найти единомышленников для успешной учёбы.'
    }
  ]),
  backgroundClass: 'bg-black',
  borderClass: ''
})
</script>


