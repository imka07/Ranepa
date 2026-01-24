// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  
  // Конфигурация для Nitro (серверная часть)
  nitro: {
    preset: 'vercel'
  },
  
  // Конфигурация runtime для переменных окружения
  runtimeConfig: {
    // Приватные ключи, доступные только на сервере
    telegramBotToken: '', // будет переопределено через process.env
    telegramChatId: '',   // будет переопределено через process.env
    
    // Публичные ключи, которые также будут доступны на клиенте
    public: {
      // Здесь можно добавить публичные переменные, если нужны
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://your-site.vercel.app'
    }
  },
  
  app: {
    head: {
      title: 'Reshala',
      titleTemplate: '',
      htmlAttrs: {
        style: 'scroll-behavior: smooth;'
      },
      meta: [
        { name: 'application-name', content: 'Reshala' },
        { property: 'og:site_name', content: 'Reshala' }
      ]
    }
  }
})