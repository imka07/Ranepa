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
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://ranepa-beta.vercel.app',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
    }
  },
  
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
        style: 'scroll-behavior: smooth;'
      },
      title: 'Помощь студентам | Дипломы, Курсовые, Рефераты',
      titleTemplate: '%s',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Профессиональная помощь студентам: написание дипломов, курсовых, рефератов. Консультации по учебным вопросам. Гарантия качества и сроков. ⭐ Заказать от 1000₽' 
        },
        { 
          name: 'keywords', 
          content: 'помощь студентам, написать диплом, заказать курсовую, реферат на заказ, консультации по учебе, решение задач, презентации' 
        },
        { name: 'author', content: 'Reshala' },
        { name: 'application-name', content: 'Reshala' },
        
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Reshala' },
        { property: 'og:title', content: 'Помощь студентам | Дипломы, Курсовые, Рефераты' },
        { 
          property: 'og:description', 
          content: 'Качественная помощь с учебными работами. Опыт работы 5+ лет. Гарантия результата. Сопровождение на всех этапах.' 
        },
        { property: 'og:locale', content: 'ru_RU' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Reshala - Помощь студентам' },
        { name: 'twitter:description', content: 'Дипломы, курсовые, рефераты под ключ. Гарантия качества.' },
        
        // Additional SEO
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'theme-color', content: '#3b82f6' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})