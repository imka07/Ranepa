// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
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
