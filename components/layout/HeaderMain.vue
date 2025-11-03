<template>
 <header :class="['w-full sticky top-0 z-50 backdrop-blur bg-black/80', backgroundClass, borderClass]">
   <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
     <div :class="['flex items-center justify-between gap-8', heightClass]">
       <!-- Left: Logo -->
       <div class="min-w-0 flex-shrink-0">
         <slot name="logo">
           <NuxtLink :to="logoHref" class="inline-flex items-center gap-2">
             <img v-if="logoSrc" :src="logoSrc" :alt="logoAlt" class="h-8 w-auto" />
             <span v-else :class="['text-2xl font-light tracking-wide', logoTextClass]">Reshala</span>
           </NuxtLink>
         </slot>
       </div>

       <!-- Right: Navigation -->
       <nav class="flex-1 hidden md:flex items-center justify-end">
         <slot name="nav">
           <ul class="flex items-center gap-8">
             <li v-for="item in navItems" :key="item.href">
               <NuxtLink
                 :to="item.href"
                 :class="[
                   'text-sm font-normal transition-all duration-200',
                   linkClass,
                   route.path === item.href 
                     ? linkActiveClass 
                     : 'hover:text-white/80'
                 ]"
               >
                 {{ item.label }}
               </NuxtLink>
             </li>
           </ul>
         </slot>
       </nav>
     </div>
   </div>
 </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'

interface NavItem {
  label: string
  href: string
}

const props = withDefaults(defineProps<{
  logoSrc?: string
  logoAlt?: string
  logoHref?: string
  navItems?: NavItem[]
  ctaText?: string
  /** Props to pass directly to BaseButton (e.g., to, variant, size, loading) */
  ctaProps?: Record<string, any>
  backgroundClass?: string
  borderClass?: string
  linkClass?: string
  linkActiveClass?: string
  logoTextClass?: string
  buttonClass?: string
  heightClass?: string
}>(), {
  logoSrc: undefined,
  logoAlt: 'Логотип',
  logoHref: '/',
  navItems: () => ([
    { label: 'Главная', href: '/' },
    { label: 'О нас', href: '/#about' },
    { label: 'Отзывы', href: '/#reviews' }
  ]),
  ctaText: 'Заказать',
  ctaProps: () => ({}),
  backgroundClass: 'bg-black',
  borderClass: 'border-b border-white/10',
  linkClass: 'text-white/60',
  linkActiveClass: 'text-white border border-white/30 rounded-full px-5 py-2',
  logoTextClass: 'text-white',
  buttonClass: '',
  heightClass: 'h-20'
})

const emit = defineEmits<{ (e: 'cta'): void }>()

const route = useRoute()

const currentPath = computed(() => route.path)

function onCta() {
  emit('cta')
}
</script>