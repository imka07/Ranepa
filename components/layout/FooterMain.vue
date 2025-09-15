<template>
  <footer :class="['w-full', backgroundClass, borderClass]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Top -->
      <div class="py-12 lg:py-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <!-- Brand / About -->
          <div class="space-y-4">
            <slot name="brand">
              <NuxtLink :to="logoHref" class="inline-flex items-center gap-2">
                <img v-if="logoSrc" :src="logoSrc" :alt="logoAlt" class="h-10 w-auto" />
                <span v-else class="text-lg font-semibold">Ranepa Help</span>
              </NuxtLink>
            </slot>
            <p class="text-sm text-gray-600">
              {{ description }}
            </p>
          </div>

          <!-- Nav sections -->
          <div v-for="section in navSections" :key="section.title" class="space-y-4">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-900" :class="titleClass">
              {{ section.title }}
            </h3>
            <ul class="space-y-2">
              <li v-for="item in section.items" :key="item.href">
                <NuxtLink :to="item.href" :class="['text-sm text-gray-600 hover:text-black transition-colors', linkClass]">
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contacts -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-900" :class="titleClass">
              Контакты
            </h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li v-if="address"><span class="font-medium text-gray-900">Адрес:</span> {{ address }}</li>
              <li v-if="phone"><span class="font-medium text-gray-900">Телефон:</span> <a :href="`tel:${phone}`" class="hover:text-black transition-colors">{{ phone }}</a></li>
              <li v-if="email"><span class="font-medium text-gray-900">Email:</span> <a :href="`mailto:${email}`" class="hover:text-black transition-colors">{{ email }}</a></li>
            </ul>

            <div v-if="socialLinks && socialLinks.length" class="pt-2">
              <nav class="flex items-center gap-4" aria-label="Социальные сети">
                <a
                  v-for="s in socialLinks"
                  :key="s.href"
                  :href="s.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-gray-600 hover:text-black transition-colors"
                  :aria-label="s.label"
                >
                  {{ s.label }}
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-gray-200 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-xs text-gray-500">© {{ currentYear }} {{ copyrightText }}</p>
        <div class="flex items-center gap-4 text-xs text-gray-500">
          <NuxtLink to="/privacy" class="hover:text-black transition-colors">Политика конфиденциальности</NuxtLink>
          <NuxtLink to="/terms" class="hover:text-black transition-colors">Условия использования</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
  </template>

<script setup lang="ts">
interface NavItem { label: string; href: string }
interface NavSection { title: string; items: NavItem[] }
interface SocialLink { label: string; href: string }

const props = withDefaults(defineProps<{
  logoSrc?: string
  logoAlt?: string
  logoHref?: string
  description?: string
  navSections?: NavSection[]
  address?: string
  phone?: string
  email?: string
  socialLinks?: SocialLink[]
  backgroundClass?: string
  borderClass?: string
  titleClass?: string
  linkClass?: string
  copyrightText?: string
}>(), {
  logoSrc: undefined,
  logoAlt: 'Логотип',
  logoHref: '/',
  description: 'Помогаем студентам РАНХиГС: консультации, сопровождение и поддержка при обучении.',
  navSections: () => ([
    { title: 'Компания', items: [
      { label: 'О нас', href: '/about' },
      { label: 'Блог', href: '/blog' },
      { label: 'Карьера', href: '/careers' }
    ]},
    { title: 'Поддержка', items: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Контакты', href: '/contact' },
      { label: 'Отзывы', href: '/reviews' }
    ]}
  ]),
  address: 'Москва, пр-т Вернадского, 82',
  phone: '+7 (999) 123-45-67',
  email: 'hello@ranepa.help',
  socialLinks: () => ([
    { label: 'Telegram', href: 'https://t.me/' },
    { label: 'VK', href: 'https://vk.com/' },
    { label: 'YouTube', href: 'https://youtube.com/' }
  ]),
  backgroundClass: 'bg-white',
  borderClass: '',
  titleClass: '',
  linkClass: '',
  copyrightText: 'Ranepa Help. Все права защищены.'
})

const currentYear = new Date().getFullYear()
</script>


