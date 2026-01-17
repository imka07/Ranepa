<template>
  <header class="bg-white/70 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/30 transition">
          <span class="text-white font-bold text-lg">R</span>
        </div>
        <span class="text-slate-900 font-bold text-xl hidden sm:inline">Reshala</span>
      </NuxtLink>

      <!-- Navigation -->
      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink
          to="/"
          class="text-slate-700 hover:text-slate-900 transition text-sm font-medium"
        >
          Главная
        </NuxtLink>
        <NuxtLink
          to="/#about"
          class="text-slate-700 hover:text-slate-900 transition text-sm font-medium"
        >
          О нас
        </NuxtLink>
        <NuxtLink
          to="/#reviews"
          class="text-slate-700 hover:text-slate-900 transition text-sm font-medium"
        >
          Отзывы
        </NuxtLink>
      </nav>

      <!-- Auth Buttons -->
      <div class="flex items-center gap-3">
        <NuxtLink
          v-if="!isAuthenticated"
          to="/auth"
          class="px-4 py-2 text-slate-700 text-sm font-medium rounded-md border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition"
        >
          Вход
        </NuxtLink>
        <NuxtLink
          v-if="!isAuthenticated"
          to="/auth"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-md hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition transform hover:scale-105 duration-200"
        >
          Регистрация
        </NuxtLink>
        <NuxtLink
          v-if="isAuthenticated"
          to="/dashboard"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-md hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition transform hover:scale-105 duration-200 flex items-center gap-2"
        >
          <img
            src="/public/icons/profile.svg"
            alt="Profile"
            width="24"
            height="24"
          />
          <span class="hidden sm:inline">{{ user?.name || 'Кабинет' }}</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { user, isAuthenticated } = useAuth()
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>