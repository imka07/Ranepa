 <template>
  <header :class="['w-full', backgroundClass, borderClass]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div :class="['flex items-center justify-between gap-4', heightClass]">
        <!-- Left: Logo -->
        <div class="min-w-0 flex-shrink-0">
          <slot name="logo">
            <NuxtLink :to="logoHref" class="inline-flex items-center gap-2">
              <img v-if="logoSrc" :src="logoSrc" :alt="logoAlt" class="h-16 w-auto" />
              <span v-else class="text-lg font-semibold">Ranepa Help</span>
            </NuxtLink>
          </slot>
        </div>

        <!-- Center: Nav -->
        <nav class="flex-1 hidden md:flex items-center justify-center">
          <slot name="nav">
            <ul class="flex items-center gap-6">
              <li v-for="item in navItems" :key="item.href">
                <NuxtLink
                  :to="item.href"
                  :class="[
                    'text-sm font-medium transition-colors',
                    linkClass,
                    route.path === item.href ? linkActiveClass : ''
                  ]"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </slot>
        </nav>

        <!-- Right: CTA -->
        <div class="min-w-0 flex-shrink-0 flex items-center justify-end">
          <slot name="cta">
            <UiBaseButton
              v-bind="ctaProps"
              variant="primary"
              :className="buttonClass"
              @click="onCta"
            >
              {{ ctaText }}
            </UiBaseButton>
          </slot>
        </div>
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
  buttonClass?: string
  heightClass?: string
}>(), {
  logoSrc: undefined,
  logoAlt: 'Логотип',
  logoHref: '/',
  navItems: () => ([
    { label: 'Главная', href: '/' },
    { label: 'О нас', href: '/about' },
    { label: 'Отзывы', href: '/reviews' }
  ]),
  ctaText: 'Заказать',
  ctaProps: () => ({}),
  backgroundClass: 'bg-white',
  borderClass: 'border-b border-gray-200',
  linkClass: 'text-gray-700 hover:text-black',
  linkActiveClass: 'text-black',
  buttonClass: '',
  heightClass: 'h-16'
})

const emit = defineEmits<{ (e: 'cta'): void }>()

const route = useRoute()

const currentPath = computed(() => route.path)

function onCta() {
  emit('cta')
}
</script>